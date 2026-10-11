"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  PlanTomorrowActionState,
  PlanTomorrowFormDefaults,
} from "@/lib/planner/plan-contract";
import {
  createGenerationRun,
  finalizeInitialPlan,
  markGenerationRunFailed,
  markGenerationRunRunning,
  PlanDataError,
} from "@/server/dal/plans";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";
import { lessonFlowDuration, planOutputText } from "@/server/planning/output-schema";
import { PlanningService } from "@/server/planning/planning-service";
import { PlanningProviderError, type SafeGenerationErrorCategory } from "@/server/planning/providers/types";
import { parsePlanTomorrowForm, PlanTomorrowValidationError } from "@/server/validation/plan-tomorrow";
import { containsObviousSensitiveText, screenPlanTomorrowInput } from "@/server/validation/planning-privacy";

const TIMING_TOLERANCE_MINUTES = 1;

function errorState(
  message: string,
  fieldErrors: PlanTomorrowActionState["fieldErrors"] = {},
): PlanTomorrowActionState {
  return { status: "error", message, fieldErrors };
}

function safeMessage(category: SafeGenerationErrorCategory) {
  if (category === "missing_configuration") {
    return "Plan generation is not configured yet. Please try again after the MAPS provider is connected.";
  }
  if (category === "provider_timeout") return "MAPS took too long to build this plan. Please try again.";
  if (category === "rate_limited") return "MAPS is receiving many requests right now. Please wait a moment and retry.";
  if (category === "duration_validation_failed") {
    return "MAPS could not fit this lesson into the requested time. Adjust the duration or constraints and try again.";
  }
  if (category === "privacy_output_blocked") {
    return "MAPS could not safely complete this plan. Revise the classroom context and try again.";
  }
  return "MAPS could not generate a valid plan this time. Your request was not saved as a plan. Please try again.";
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
    // Preserve the safe user-facing generation failure; never serialize DAL details.
  }
}

export async function generatePlanTomorrow(
  _previousState: PlanTomorrowActionState,
  formData: FormData,
): Promise<PlanTomorrowActionState> {
  let currentRunId: string | null = null;
  let redirectDestination: "/login" | "/onboarding" | null = null;
  let completedPlanId: string | null = null;

  try {
    const bundle = await getCurrentProfileBundle();
    if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) {
      redirectDestination = "/onboarding";
    } else {
      const profile = bundle.teacherProfile;
      const profileDefaults: PlanTomorrowFormDefaults = {
        subjectArea: profile.subjectAreas.length === 1 ? profile.subjectAreas[0] : "",
        gradeLevels: profile.gradeLevels,
        durationMinutes: profile.typicalClassDurationMinutes,
        classSize: profile.typicalClassSize,
        availableMaterials: profile.commonMaterials,
      };
      const snapshot = parsePlanTomorrowForm(formData, profileDefaults);
      const privacyErrors = screenPlanTomorrowInput(snapshot.input);
      if (Object.keys(privacyErrors).length) {
        return errorState("Review the highlighted fields before generating.", privacyErrors);
      }

      const descriptor = PlanningService.descriptor();
      currentRunId = await createGenerationRun({
        provider: descriptor.provider,
        modelAlias: descriptor.modelAlias,
      });
      await markGenerationRunRunning(currentRunId);

      let result = await PlanningService.generatePlan({ input: snapshot, profile });
      if (containsObviousSensitiveText(planOutputText(result.output))) {
        await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
        return errorState(safeMessage("privacy_output_blocked"));
      }

      let generatedMinutes = lessonFlowDuration(result.output);
      if (Math.abs(generatedMinutes - snapshot.input.duration_minutes) > TIMING_TOLERANCE_MINUTES) {
        const firstRunId = currentRunId;
        await safelyFailRun(firstRunId, "duration_validation_failed", result.latencyMs);
        currentRunId = await createGenerationRun({
          provider: descriptor.provider,
          modelAlias: descriptor.modelAlias,
          retryOfRunId: firstRunId,
        });
        await markGenerationRunRunning(currentRunId);
        result = await PlanningService.generatePlan({
          input: snapshot,
          profile,
          timingCorrection: {
            requestedMinutes: snapshot.input.duration_minutes,
            priorMinutes: generatedMinutes,
          },
        });
        generatedMinutes = lessonFlowDuration(result.output);
      }

      if (Math.abs(generatedMinutes - snapshot.input.duration_minutes) > TIMING_TOLERANCE_MINUTES) {
        await safelyFailRun(currentRunId, "duration_validation_failed", result.latencyMs);
        return errorState(safeMessage("duration_validation_failed"));
      }
      if (containsObviousSensitiveText(planOutputText(result.output))) {
        await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
        return errorState(safeMessage("privacy_output_blocked"));
      }

      let planId: string;
      try {
        planId = await finalizeInitialPlan({
          runId: currentRunId,
          input: snapshot,
          output: result.output,
          providerModelId: result.providerModelId,
          latencyMs: result.latencyMs,
          usage: result.usage,
        });
      } catch {
        await safelyFailRun(currentRunId, "persistence_failed", result.latencyMs);
        return errorState("MAPS created a plan but could not save it safely. No plan was added. Please try again.");
      }

      revalidatePath("/planner");
      revalidatePath("/planner/plans");
      completedPlanId = planId;
    }
  } catch (error) {
    if (error instanceof PlanTomorrowValidationError) {
      return errorState("Review the highlighted fields and try again.", error.fieldErrors);
    }
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirectDestination = "/login";
    else if (error instanceof PlanDataError && error.code === "unauthenticated") redirectDestination = "/login";
    else if (error instanceof PlanningProviderError) {
      await safelyFailRun(currentRunId, error.category);
      return errorState(safeMessage(error.category));
    } else {
      await safelyFailRun(currentRunId, "unknown_safe");
      return errorState(safeMessage("unknown_safe"));
    }
  }

  if (redirectDestination) redirect(redirectDestination);
  if (completedPlanId) redirect(`/planner/plans/${completedPlanId}`);
  return errorState("MAPS could not start this plan. Please try again.");
}
