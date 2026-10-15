import "server-only";

import { z } from "zod";

import {
  planFeedbackResponses,
  type PlanFeedbackActionState,
  type PlanFeedbackResponse,
} from "@/lib/planner/feedback-contract";

const feedbackSchema = z.object({
  response: z.enum(planFeedbackResponses.map((option) => option.value)),
  comment: z.string().trim().min(1).max(500).optional(),
}).strict();

export class PlanFeedbackValidationError extends Error {
  constructor(public readonly fieldErrors: PlanFeedbackActionState["fieldErrors"]) {
    super("The plan feedback is invalid.");
    this.name = "PlanFeedbackValidationError";
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function parsePlanFeedbackForm(formData: FormData): {
  response: PlanFeedbackResponse;
  comment?: string;
} {
  const comment = text(formData, "comment");
  const parsed = feedbackSchema.safeParse({
    response: text(formData, "response"),
    comment: comment || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: PlanFeedbackActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "comment") {
        fieldErrors.comment ??= "Keep your comment to 500 characters or fewer.";
      } else {
        fieldErrors.response ??= "Choose Yes, Mostly, or No.";
      }
    }
    throw new PlanFeedbackValidationError(fieldErrors);
  }

  return parsed.data;
}
