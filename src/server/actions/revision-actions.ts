"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  type GuidedRevisionActionState,
  type GuidedRevisionInputSnapshotV1,
} from "@/lib/planner/plan-contract";
import {
  createGuidedRevisionRun,
  finalizeGuidedRevision,
  getCurrentUserPlan,
  markGenerationRunFailed,
  markGenerationRunRunning,
  PlanDataError,
} from "@/server/dal/plans";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";
import { lessonFlowDuration, planOutputText } from "@/server/planning/output-schema";
import { PlanningService } from "@/server/planning/planning-service";
import {
  PlanningProviderError,
  type SafeGenerationErrorCategory,
} from "@/server/planning/providers/types";
import {
  GuidedRevisionValidationError,
  parseGuidedRevisionForm,
} from "@/server/validation/guided-revision";
import {
  containsObviousSensitiveText,
  guidedRevisionPrivacyError,
} from "@/server/validation/planning-privacy";

const TIMING_TOLERANCE_MINUTES = 1;

function errorState(
  message: string,
  fieldErrors: GuidedRevisionActionState["fieldErrors"] = {},
): GuidedRevisionActionState {
  return { status: "error", message, fieldErrors };
}

function safeMessage(category: SafeGenerationErrorCategory) {
  if (category === "missing_configuration") {
    return "Plan revision is not configured yet. Please try again after the MAPS provider is connected.";
  }
  if (category === "provider_timeout") return "MAPS took too long to revise this plan. Please try again.";
  if (category === "rate_limited") return "MAPS is receiving many requests right now. Please wait a moment and retry.";
  if (category === "duration_validation_failed") {
    return "MAPS could not keep this revision within the original lesson time. Your saved plan was not changed.";
  }
  if (category === "privacy_output_blocked") {
    return "MAPS could not safely complete this revision. Your saved plan was not changed.";
  }
  return "MAPS could not create a valid revision this time. Your saved plan was not changed.";
}

async function safelyFailRun(
  runId: string | null,
  category: SafeGenerationErrorCategory,
  latencyMs?: number,
) {
  if (!runId) return;
  try {
    await markGenerationRunFailed(runId, category, latencyMs);
  } catch {
    // Preserve the safe revision failure; never serialize DAL details.
  }
}

export async function reviseSavedPlan(
  planId: string,
  sourceRevisionId: string,
  _previousState: GuidedRevisionActionState,
  formData: FormData,
): Promise<GuidedRevisionActionState> {
  let currentRunId: string | null = null;
  let redirectDestination: "/login" | "/onboarding" | null = null;
  let completedRevisionId: string | null = null;

  try {
    const revisionRequest = parseGuidedRevisionForm(formData);
    const privacyError = guidedRevisionPrivacyError(revisionRequest.teacher_direction);
    if (privacyError) {
      return errorState("Review your revision direction before continuing.", {
        teacherDirection: privacyError,
      });
    }

    const bundle = await getCurrentProfileBundle();
    if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) {
      redirectDestination = "/onboarding";
    } else {
      const source = await getCurrentUserPlan(planId, sourceRevisionId);
      const descriptor = PlanningService.descriptor();
      currentRunId = await createGuidedRevisionRun({
        provider: descriptor.provider,
        modelAlias: descriptor.modelAlias,
        planId,
        sourceRevisionId,
      });
      await markGenerationRunRunning(currentRunId);

      let result = await PlanningService.revisePlan({
        input: source.input,
        sourceOutput: source.output,
        revision: revisionRequest,
        profile: bundle.teacherProfile,
      });
      if (containsObviousSensitiveText(planOutputText(result.output))) {
        await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
        return errorState(safeMessage("privacy_output_blocked"));
      }

      const requestedMinutes = source.input.input.duration_minutes;
      let generatedMinutes = lessonFlowDuration(result.output);
      if (Math.abs(generatedMinutes - requestedMinutes) > TIMING_TOLERANCE_MINUTES) {
        const firstRunId = currentRunId;
        await safelyFailRun(firstRunId, "duration_validation_failed", result.latencyMs);
        currentRunId = await createGuidedRevisionRun({
          provider: descriptor.provider,
          modelAlias: descriptor.modelAlias,
          planId,
          sourceRevisionId,
          retryOfRunId: firstRunId,
        });
        await markGenerationRunRunning(currentRunId);
        result = await PlanningService.revisePlan({
          input: source.input,
          sourceOutput: source.output,
          revision: revisionRequest,
          profile: bundle.teacherProfile,
          timingCorrection: {
            requestedMinutes,
            priorMinutes: generatedMinutes,
          },
        });
        generatedMinutes = lessonFlowDuration(result.output);
      }

      if (Math.abs(generatedMinutes - requestedMinutes) > TIMING_TOLERANCE_MINUTES) {
        await safelyFailRun(currentRunId, "duration_validation_failed", result.latencyMs);
        return errorState(safeMessage("duration_validation_failed"));
      }
      if (containsObviousSensitiveText(planOutputText(result.output))) {
        await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
        return errorState(safeMessage("privacy_output_blocked"));
      }

      const revisionInput: GuidedRevisionInputSnapshotV1 = {
        source_input: source.input,
        revision_request: revisionRequest,
      };
      completedRevisionId = await finalizeGuidedRevision({
        runId: currentRunId,
        planId,
        sourceRevisionId,
        input: revisionInput,
        output: result.output,
        providerModelId: result.providerModelId,
        latencyMs: result.latencyMs,
        usage: result.usage,
      });
    }
  } catch (error) {
    if (error instanceof GuidedRevisionValidationError) {
      return errorState("Review the highlighted revision fields.", error.fieldErrors);
    }
    if (
      (error instanceof ProfileDataError && error.code === "unauthenticated")
      || (error instanceof PlanDataError && error.code === "unauthenticated")
    ) {
      redirectDestination = "/login";
    } else if (error instanceof PlanDataError && error.code === "not_found") {
      return errorState("This saved plan or revision is no longer available.");
    } else if (error instanceof PlanningProviderError) {
      await safelyFailRun(currentRunId, error.category);
      return errorState(safeMessage(error.category));
    } else {
      await safelyFailRun(currentRunId, "unknown_safe");
      return errorState(safeMessage("unknown_safe"));
    }
  }

  if (redirectDestination) redirect(redirectDestination);
  if (!completedRevisionId) return errorState(safeMessage("unknown_safe"));

  revalidatePath(`/planner/plans/${planId}`);
  revalidatePath("/planner/plans");
  redirect(`/planner/plans/${planId}?revision=${completedRevisionId}`);
}
