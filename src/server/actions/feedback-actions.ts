"use server";

import { redirect } from "next/navigation";

import type { PlanFeedbackActionState } from "@/lib/planner/feedback-contract";
import {
  PlanFeedbackDataError,
  saveCurrentUserPlanFeedback,
} from "@/server/dal/feedback";
import { planningFeedbackPrivacyError } from "@/server/validation/planning-privacy";
import {
  parsePlanFeedbackForm,
  PlanFeedbackValidationError,
} from "@/server/validation/plan-feedback";

function errorState(
  message: string,
  fieldErrors: PlanFeedbackActionState["fieldErrors"] = {},
): PlanFeedbackActionState {
  return { status: "error", message, fieldErrors };
}

export async function savePlanFeedback(
  planId: string,
  revisionId: string,
  _previousState: PlanFeedbackActionState,
  formData: FormData,
): Promise<PlanFeedbackActionState> {
  try {
    const feedback = parsePlanFeedbackForm(formData);
    const privacyError = planningFeedbackPrivacyError(feedback.comment);
    if (privacyError) {
      return errorState("Review your feedback comment before saving.", {
        comment: privacyError,
      });
    }

    await saveCurrentUserPlanFeedback({
      planId,
      revisionId,
      response: feedback.response,
      comment: feedback.comment,
    });
  } catch (error) {
    if (error instanceof PlanFeedbackValidationError) {
      return errorState("Review the highlighted feedback fields.", error.fieldErrors);
    }
    if (error instanceof PlanFeedbackDataError && error.code === "unauthenticated") {
      redirect("/login");
    }
    if (error instanceof PlanFeedbackDataError && error.code === "not_found") {
      return errorState("This plan revision is no longer available.");
    }
    return errorState("MAPS could not save your feedback. Your plan was not changed. Please try again.");
  }

  return {
    status: "success",
    message: "Thanks—your feedback is saved for this revision.",
    fieldErrors: {},
  };
}
