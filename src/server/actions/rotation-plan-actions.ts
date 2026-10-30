"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  RotationPlanActionState,
} from "@/lib/planner/rotation-plan-contract";
import { rotationPlanOutputText } from "@/lib/planner/rotation-plan-schema";
import {
  createRotationPlanRun,
  finalizeRotationPlan,
  markGenerationRunFailed,
  markGenerationRunRunning,
  PlanDataError,
} from "@/server/dal/plans";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";
import { PlanningService } from "@/server/planning/planning-service";
import { rotationPlanDefaultsFromProfile } from "@/server/planning/rotation-plan-defaults";
import {
  PlanningProviderError,
  type SafeGenerationErrorCategory,
} from "@/server/planning/providers/types";
import {
  containsObviousSensitiveText,
  screenRotationPlanInput,
} from "@/server/validation/planning-privacy";
import {
  parseRotationPlanForm,
  RotationPlanValidationError,
} from "@/server/validation/rotation-plan";

function errorState(
  message: string,
  fieldErrors: RotationPlanActionState["fieldErrors"] = {},
): RotationPlanActionState {
  return { status: "error", message, fieldErrors };
}

function safeMessage(category: SafeGenerationErrorCategory) {
  if (category === "missing_configuration") {
    return "Template planning is not configured yet. Please try again after the MAPS provider is connected.";
  }
  if (category === "provider_timeout") {
    return "MAPS took too long to build this multi-grade plan. Please try again.";
  }
  if (category === "rate_limited") {
    return "MAPS is receiving many requests right now. Please wait a moment and retry.";
  }
  if (category === "privacy_output_blocked") {
    return "MAPS could not safely complete this plan. Revise the classroom context and try again.";
  }
  if (category === "structured_output_invalid") {
    return "MAPS could not complete every required template field safely. No plan was saved. Please try again.";
  }
  return "MAPS could not create a valid rotation plan this time. No plan was saved. Please try again.";
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
    // Preserve the safe generation failure; never serialize DAL details.
  }
}

export async function generateRotationPlan(
  _previousState: RotationPlanActionState,
  formData: FormData,
): Promise<RotationPlanActionState> {
  let currentRunId: string | null = null;
  let redirectDestination: "/login" | "/onboarding?context=school" | null = null;
  let completedPlanId: string | null = null;

  try {
    const bundle = await getCurrentProfileBundle();
    if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) {
      redirectDestination = "/onboarding?context=school";
    } else {
      const profile = bundle.teacherProfile;
      const defaults = rotationPlanDefaultsFromProfile({
        ...bundle,
        profile: bundle.profile,
        teacherProfile: profile,
      });
      const snapshot = parseRotationPlanForm(formData, defaults);
      const privacyErrors = screenRotationPlanInput(snapshot.input);
      if (Object.keys(privacyErrors).length) {
        return errorState("Review the highlighted fields before generating.", privacyErrors);
      }

      const descriptor = PlanningService.descriptor();
      currentRunId = await createRotationPlanRun({
        provider: descriptor.provider,
        modelAlias: descriptor.modelAlias,
      });
      await markGenerationRunRunning(currentRunId);

      const result = await PlanningService.generateRotationPlan({ input: snapshot, profile });
      if (containsObviousSensitiveText(rotationPlanOutputText(result.output))) {
        await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
        return errorState(safeMessage("privacy_output_blocked"));
      }

      try {
        completedPlanId = await finalizeRotationPlan({
          runId: currentRunId,
          input: snapshot,
          output: result.output,
          providerModelId: result.providerModelId,
          latencyMs: result.latencyMs,
          usage: result.usage,
        });
      } catch {
        await safelyFailRun(currentRunId, "persistence_failed", result.latencyMs);
        return errorState("MAPS created a rotation plan but could not save it safely. No plan was added. Please try again.");
      }
    }
  } catch (error) {
    if (error instanceof RotationPlanValidationError) {
      return errorState("Review the highlighted fields and try again.", error.fieldErrors);
    }
    if (
      (error instanceof ProfileDataError && error.code === "unauthenticated")
      || (error instanceof PlanDataError && error.code === "unauthenticated")
    ) {
      redirectDestination = "/login";
    } else if (error instanceof PlanningProviderError) {
      await safelyFailRun(currentRunId, error.category);
      return errorState(safeMessage(error.category));
    } else {
      await safelyFailRun(currentRunId, "unknown_safe");
      return errorState(safeMessage("unknown_safe"));
    }
  }

  if (redirectDestination) redirect(redirectDestination);
  if (completedPlanId) {
    revalidatePath("/planner");
    revalidatePath("/planner/plans");
    redirect(`/planner/plans/${completedPlanId}/template`);
  }
  return errorState("MAPS could not start this template plan. Please try again.");
}
