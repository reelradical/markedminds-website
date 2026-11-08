"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  CreatorLessonActionState,
  CreatorRevisionActionState,
  CreatorRevisionInputSnapshotV1,
} from "@/lib/planner/creator-lesson-contract";
import { buildCreatorTimingBudget } from "@/lib/planner/creator-timing-budget";
import {
  CreatorLessonOutputValidationError,
  creatorLessonDuration,
  creatorLessonOutputText,
  validateCreatorLessonAgainstInput,
} from "@/lib/planner/creator-lesson-schema";
import {
  createCreatorLessonRun,
  createCreatorRevisionRun,
  finalizeCreatorLesson,
  finalizeCreatorRevision,
  getCurrentUserCreatorPlan,
  markGenerationRunFailed,
  markGenerationRunRunning,
  PlanDataError,
} from "@/server/dal/plans";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";
import { PlanningService } from "@/server/planning/planning-service";
import {
  PlanningProviderError,
  type SafeGenerationErrorCategory,
} from "@/server/planning/providers/types";
import {
  CreatorLessonValidationError,
  CreatorRevisionValidationError,
  parseCreatorLessonForm,
  parseCreatorRevisionForm,
} from "@/server/validation/creator-lesson";
import {
  containsObviousSensitiveText,
  creatorRevisionPrivacyError,
  screenCreatorLessonInput,
} from "@/server/validation/planning-privacy";

function generationErrorState(
  message: string,
  fieldErrors: CreatorLessonActionState["fieldErrors"] = {},
): CreatorLessonActionState {
  return { status: "error", message, fieldErrors };
}

function revisionErrorState(
  message: string,
  fieldErrors: CreatorRevisionActionState["fieldErrors"] = {},
): CreatorRevisionActionState {
  return { status: "error", message, fieldErrors };
}

function generationSafeMessage(category: SafeGenerationErrorCategory) {
  if (category === "missing_configuration") return "Creator lesson generation is not configured yet.";
  if (category === "provider_timeout") return "MAPS took too long to build this lesson. Please try again.";
  if (category === "rate_limited") return "MAPS is receiving many requests right now. Please wait a moment and retry.";
  if (category === "duration_validation_failed") return "MAPS could not fit this lesson into the requested video time. No plan was saved.";
  if (category === "privacy_output_blocked") return "MAPS could not safely complete this lesson. Review the context and try again.";
  if (category === "structured_output_invalid") return "MAPS could not create a complete adult-learning plan this time. No plan was saved.";
  return "MAPS could not create a valid creator lesson this time. No plan was saved. Please try again.";
}

function revisionSafeMessage(category: SafeGenerationErrorCategory) {
  if (category === "provider_timeout") return "MAPS took too long to revise this lesson. Your saved plan was not changed.";
  if (category === "rate_limited") return "MAPS is receiving many requests right now. Please wait a moment and retry.";
  if (category === "duration_validation_failed") return "MAPS could not keep this revision within the original video time. Your saved plan was not changed.";
  if (category === "privacy_output_blocked") return "MAPS could not safely complete this revision. Your saved plan was not changed.";
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
    // Preserve the safe user-facing failure; never serialize DAL or provider details.
  }
}

export async function generateCreatorLesson(
  _previousState: CreatorLessonActionState,
  formData: FormData,
): Promise<CreatorLessonActionState> {
  let currentRunId: string | null = null;
  let completedPlanId: string | null = null;
  let profileReady = false;

  try {
    const bundle = await getCurrentProfileBundle();
    profileReady = Boolean(bundle.profile?.onboardingCompleted);
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return generationErrorState("MAPS could not verify your creator workspace. Please refresh and try again.");
  }
  if (!profileReady) redirect("/onboarding");

  try {
    const snapshot = parseCreatorLessonForm(formData);
    const privacyErrors = screenCreatorLessonInput(snapshot.input);
    if (Object.keys(privacyErrors).length) {
      return generationErrorState("Review the highlighted fields before generating.", privacyErrors);
    }
    const timingBudget = buildCreatorTimingBudget({
      requestedMinutes: snapshot.input.duration_minutes,
      teachingApproach: snapshot.input.teaching_approach,
    });

    const descriptor = PlanningService.descriptor();
    currentRunId = await createCreatorLessonRun({
      provider: descriptor.provider,
      modelAlias: descriptor.modelAlias,
    });
    await markGenerationRunRunning(currentRunId);

    const result = await PlanningService.generateCreatorLesson({ input: snapshot, timingBudget });
    const generatedMinutes = creatorLessonDuration(result.output);

    if (generatedMinutes !== snapshot.input.duration_minutes) {
      await safelyFailRun(currentRunId, "duration_validation_failed", result.latencyMs);
      return generationErrorState(generationSafeMessage("duration_validation_failed"));
    }

    try {
      validateCreatorLessonAgainstInput(result.output, snapshot);
    } catch (error) {
      if (error instanceof CreatorLessonOutputValidationError) {
        await safelyFailRun(currentRunId, "structured_output_invalid", result.latencyMs);
        return generationErrorState(generationSafeMessage("structured_output_invalid"));
      }
      throw error;
    }

    if (containsObviousSensitiveText(creatorLessonOutputText(result.output))) {
      await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
      return generationErrorState(generationSafeMessage("privacy_output_blocked"));
    }

    try {
      completedPlanId = await finalizeCreatorLesson({
        runId: currentRunId,
        input: snapshot,
        output: result.output,
        providerModelId: result.providerModelId,
        latencyMs: result.latencyMs,
        usage: result.usage,
      });
    } catch {
      await safelyFailRun(currentRunId, "persistence_failed", result.latencyMs);
      return generationErrorState("MAPS created a lesson but could not save it safely. No plan was added. Please try again.");
    }
  } catch (error) {
    if (error instanceof CreatorLessonValidationError) {
      return generationErrorState("Review the highlighted fields and try again.", error.fieldErrors);
    }
    if (
      (error instanceof ProfileDataError && error.code === "unauthenticated")
      || (error instanceof PlanDataError && error.code === "unauthenticated")
    ) {
      redirect("/login");
    }
    if (error instanceof PlanningProviderError) {
      await safelyFailRun(currentRunId, error.category);
      return generationErrorState(generationSafeMessage(error.category));
    }
    await safelyFailRun(currentRunId, "unknown_safe");
    return generationErrorState(generationSafeMessage("unknown_safe"));
  }

  if (completedPlanId) {
    revalidatePath("/planner");
    revalidatePath("/planner/plans");
    redirect(`/planner/plans/${completedPlanId}/creator`);
  }
  return generationErrorState("MAPS could not start this creator lesson. Please try again.");
}

export async function reviseCreatorLesson(
  planId: string,
  sourceRevisionId: string,
  _previousState: CreatorRevisionActionState,
  formData: FormData,
): Promise<CreatorRevisionActionState> {
  let currentRunId: string | null = null;
  let completedRevisionId: string | null = null;
  let profileReady = false;

  try {
    const bundle = await getCurrentProfileBundle();
    profileReady = Boolean(bundle.profile?.onboardingCompleted);
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return revisionErrorState("MAPS could not verify your creator workspace. Please refresh and try again.");
  }
  if (!profileReady) redirect("/onboarding");

  try {
    const revisionRequest = parseCreatorRevisionForm(formData);
    const privacyError = creatorRevisionPrivacyError(revisionRequest.creator_direction);
    if (privacyError) {
      return revisionErrorState("Review your revision direction before continuing.", {
        creatorDirection: privacyError,
      });
    }

    const source = await getCurrentUserCreatorPlan(planId, sourceRevisionId);
    const timingBudget = buildCreatorTimingBudget({
      requestedMinutes: source.input.input.duration_minutes,
      teachingApproach: source.input.input.teaching_approach,
    });
    const descriptor = PlanningService.descriptor();
    currentRunId = await createCreatorRevisionRun({
      provider: descriptor.provider,
      modelAlias: descriptor.modelAlias,
      planId,
      sourceRevisionId,
    });
    await markGenerationRunRunning(currentRunId);

    const result = await PlanningService.reviseCreatorLesson({
      input: source.input,
      sourceOutput: source.output,
      revision: revisionRequest,
      timingBudget,
    });
    const requestedMinutes = source.input.input.duration_minutes;
    const generatedMinutes = creatorLessonDuration(result.output);

    if (generatedMinutes !== requestedMinutes) {
      await safelyFailRun(currentRunId, "duration_validation_failed", result.latencyMs);
      return revisionErrorState(revisionSafeMessage("duration_validation_failed"));
    }

    try {
      validateCreatorLessonAgainstInput(result.output, source.input);
    } catch (error) {
      if (error instanceof CreatorLessonOutputValidationError) {
        await safelyFailRun(currentRunId, "structured_output_invalid", result.latencyMs);
        return revisionErrorState(revisionSafeMessage("structured_output_invalid"));
      }
      throw error;
    }

    if (containsObviousSensitiveText(creatorLessonOutputText(result.output))) {
      await safelyFailRun(currentRunId, "privacy_output_blocked", result.latencyMs);
      return revisionErrorState(revisionSafeMessage("privacy_output_blocked"));
    }

    const revisionInput: CreatorRevisionInputSnapshotV1 = {
      source_input: source.input,
      revision_request: revisionRequest,
    };
    completedRevisionId = await finalizeCreatorRevision({
      runId: currentRunId,
      planId,
      sourceRevisionId,
      input: revisionInput,
      output: result.output,
      providerModelId: result.providerModelId,
      latencyMs: result.latencyMs,
      usage: result.usage,
    });
  } catch (error) {
    if (error instanceof CreatorRevisionValidationError) {
      return revisionErrorState("Review the highlighted revision fields.", error.fieldErrors);
    }
    if (
      (error instanceof ProfileDataError && error.code === "unauthenticated")
      || (error instanceof PlanDataError && error.code === "unauthenticated")
    ) {
      redirect("/login");
    }
    if (error instanceof PlanDataError && error.code === "not_found") {
      return revisionErrorState("This saved lesson or revision is no longer available.");
    }
    if (error instanceof PlanningProviderError) {
      await safelyFailRun(currentRunId, error.category);
      return revisionErrorState(revisionSafeMessage(error.category));
    }
    await safelyFailRun(currentRunId, "unknown_safe");
    return revisionErrorState(revisionSafeMessage("unknown_safe"));
  }

  if (!completedRevisionId) return revisionErrorState(revisionSafeMessage("unknown_safe"));
  revalidatePath(`/planner/plans/${planId}/creator`);
  revalidatePath("/planner/plans");
  redirect(`/planner/plans/${planId}/creator?revision=${completedRevisionId}`);
}
