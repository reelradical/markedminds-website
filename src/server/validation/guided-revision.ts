import "server-only";

import { z } from "zod";

import {
  guidedRevisionIntents,
  type GuidedRevisionActionState,
  type GuidedRevisionInputSnapshotV1,
  type GuidedRevisionRequestV1,
  type PlanTomorrowInputSnapshotV1,
} from "@/lib/planner/plan-contract";
import { parseStoredInputSnapshot } from "@/server/validation/plan-tomorrow";

const intentSchema = z.enum(guidedRevisionIntents.map((intent) => intent.value));

const requestSchema = z.object({
  intent: intentSchema,
  teacher_direction: z.string().trim().min(1).max(600).optional(),
}).strict();

const snapshotSchema = z.object({
  source_input: z.unknown(),
  revision_request: requestSchema,
}).strict();

export class GuidedRevisionValidationError extends Error {
  constructor(public readonly fieldErrors: GuidedRevisionActionState["fieldErrors"]) {
    super("The guided revision request is invalid.");
    this.name = "GuidedRevisionValidationError";
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function parseGuidedRevisionForm(formData: FormData): GuidedRevisionRequestV1 {
  const teacherDirection = text(formData, "teacher_direction");
  const parsed = requestSchema.safeParse({
    intent: text(formData, "intent"),
    teacher_direction: teacherDirection || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: GuidedRevisionActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "teacher_direction") {
        fieldErrors.teacherDirection ??= "Keep your direction to 600 characters or fewer.";
      } else {
        fieldErrors.intent ??= "Choose what this revision should improve.";
      }
    }
    throw new GuidedRevisionValidationError(fieldErrors);
  }

  return parsed.data;
}

export function parseStoredGuidedRevisionInput(value: unknown): GuidedRevisionInputSnapshotV1 {
  const parsed = snapshotSchema.parse(value);
  return {
    source_input: parseStoredInputSnapshot(parsed.source_input) as PlanTomorrowInputSnapshotV1,
    revision_request: parsed.revision_request,
  };
}
