import "server-only";

import { z } from "zod";

import {
  CREATOR_LESSON_INPUT_SCHEMA_VERSION,
  creatorRevisionIntents,
  creatorTeachingApproachValues,
  type CreatorLessonActionState,
  type CreatorLessonField,
  type CreatorLessonInputSnapshotV1,
  type CreatorRevisionActionState,
  type CreatorRevisionInputSnapshotV1,
  type CreatorRevisionRequestV1,
} from "@/lib/planner/creator-lesson-contract";
import { CREATOR_MIN_DURATION_MINUTES } from "@/lib/planner/creator-timing-budget";

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalText = (maximum: number) => boundedText(maximum).optional();
const provenanceSchema = z.enum(["user", "profile", "system"]);

const creatorLessonInputSchema = z.object({
  workflow: z.literal("creator_lesson"),
  planning_context: z.literal("adult_creator"),
  subject: boundedText(160),
  topic_or_working_title: boundedText(300),
  audience: boundedText(1000),
  prior_knowledge: boundedText(1200),
  learner_goal: boundedText(1200),
  learning_outcome: boundedText(1200),
  duration_minutes: z.number().int().min(5).max(180),
  teaching_approach: z.enum(creatorTeachingApproachValues),
  delivery_format: z.literal("youtube_asynchronous"),
  source_notes: optionalText(5000),
  tools_version_context: optionalText(1500),
  materials_resources: z.array(boundedText(300)).max(30),
  additional_notes: optionalText(2000),
}).strict();

// Keep stored V1 snapshots with shorter durations readable. New requests need
// enough time for the minimum instructional phases of every approach.
const creatorLessonFormInputSchema = creatorLessonInputSchema.extend({
  duration_minutes: z.number().int().min(CREATOR_MIN_DURATION_MINUTES).max(180),
});

const creatorLessonSnapshotSchema = z.object({
  input: creatorLessonInputSchema,
  provenance: z.object({
    planning_context: z.literal("system"),
    subject: provenanceSchema,
    topic_or_working_title: provenanceSchema,
    audience: provenanceSchema,
    prior_knowledge: provenanceSchema,
    learner_goal: provenanceSchema,
    learning_outcome: provenanceSchema,
    duration_minutes: provenanceSchema,
    teaching_approach: provenanceSchema,
    delivery_format: z.literal("system"),
    source_notes: provenanceSchema,
    tools_version_context: provenanceSchema,
    materials_resources: provenanceSchema,
    additional_notes: provenanceSchema,
  }).strict(),
}).strict();

const revisionIntentValues = creatorRevisionIntents.map(({ value }) => value) as [
  (typeof creatorRevisionIntents)[number]["value"],
  ...(typeof creatorRevisionIntents)[number]["value"][],
];

const creatorRevisionRequestSchema = z.object({
  intent: z.enum(revisionIntentValues),
  creator_direction: optionalText(800),
}).strict();

const creatorRevisionSnapshotSchema = z.object({
  source_input: creatorLessonSnapshotSchema,
  revision_request: creatorRevisionRequestSchema,
}).strict();

export class CreatorLessonValidationError extends Error {
  constructor(public readonly fieldErrors: Partial<Record<CreatorLessonField, string>>) {
    super("Creator lesson input is invalid.");
    this.name = "CreatorLessonValidationError";
  }
}

export class CreatorRevisionValidationError extends Error {
  constructor(public readonly fieldErrors: CreatorRevisionActionState["fieldErrors"]) {
    super("Creator revision input is invalid.");
    this.name = "CreatorRevisionValidationError";
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optional(value: string) {
  return value || undefined;
}

function list(value: string) {
  return [...new Set(value.split(/[\r\n,]+/).map((item) => item.trim()).filter(Boolean))];
}

function mapInputIssue(root: PropertyKey | undefined): CreatorLessonField {
  if (root === "topic_or_working_title") return "topicOrWorkingTitle";
  if (root === "prior_knowledge") return "priorKnowledge";
  if (root === "learner_goal") return "learnerGoal";
  if (root === "learning_outcome") return "learningOutcome";
  if (root === "duration_minutes") return "durationMinutes";
  if (root === "teaching_approach") return "teachingApproach";
  if (root === "source_notes") return "sourceNotes";
  if (root === "tools_version_context") return "toolsVersionContext";
  if (root === "materials_resources") return "materialsResources";
  if (root === "additional_notes") return "additionalNotes";
  if (root === "audience") return "audience";
  if (root === "prior_knowledge") return "priorKnowledge";
  return "subject";
}

export function parseCreatorLessonForm(formData: FormData): CreatorLessonInputSnapshotV1 {
  const rawDuration = Number(text(formData, "duration_minutes"));
  const parsed = creatorLessonFormInputSchema.safeParse({
    workflow: "creator_lesson",
    planning_context: "adult_creator",
    subject: text(formData, "subject"),
    topic_or_working_title: text(formData, "topic_or_working_title"),
    audience: text(formData, "audience"),
    prior_knowledge: text(formData, "prior_knowledge"),
    learner_goal: text(formData, "learner_goal"),
    learning_outcome: text(formData, "learning_outcome"),
    duration_minutes: Number.isInteger(rawDuration) ? rawDuration : Number.NaN,
    teaching_approach: text(formData, "teaching_approach") || "explanation_and_demonstration",
    delivery_format: "youtube_asynchronous",
    source_notes: optional(text(formData, "source_notes")),
    tools_version_context: optional(text(formData, "tools_version_context")),
    materials_resources: list(text(formData, "materials_resources")),
    additional_notes: optional(text(formData, "additional_notes")),
  });

  if (!parsed.success) {
    const fieldErrors: CreatorLessonActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = mapInputIssue(issue.path[0]);
      fieldErrors[field] ??= "Review this field and its length or value.";
    }
    throw new CreatorLessonValidationError(fieldErrors);
  }

  const input = parsed.data;
  return {
    input,
    provenance: {
      planning_context: "system",
      subject: "user",
      topic_or_working_title: "user",
      audience: "user",
      prior_knowledge: "user",
      learner_goal: "user",
      learning_outcome: "user",
      duration_minutes: "user",
      teaching_approach: "user",
      delivery_format: "system",
      source_notes: input.source_notes ? "user" : "system",
      tools_version_context: input.tools_version_context ? "user" : "system",
      materials_resources: input.materials_resources.length ? "user" : "system",
      additional_notes: input.additional_notes ? "user" : "system",
    },
  };
}

export function parseCreatorRevisionForm(formData: FormData): CreatorRevisionRequestV1 {
  const parsed = creatorRevisionRequestSchema.safeParse({
    intent: text(formData, "intent"),
    creator_direction: optional(text(formData, "creator_direction")),
  });
  if (!parsed.success) {
    const fieldErrors: CreatorRevisionActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] === "creator_direction" ? "creatorDirection" : "intent";
      fieldErrors[field] ??= "Review this field and try again.";
    }
    throw new CreatorRevisionValidationError(fieldErrors);
  }
  return parsed.data;
}

export function parseStoredCreatorLessonInput(value: unknown) {
  return creatorLessonSnapshotSchema.parse(value) as CreatorLessonInputSnapshotV1;
}

export function parseStoredCreatorRevisionInput(value: unknown) {
  return creatorRevisionSnapshotSchema.parse(value) as CreatorRevisionInputSnapshotV1;
}

export { CREATOR_LESSON_INPUT_SCHEMA_VERSION };
