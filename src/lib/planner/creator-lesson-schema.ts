import { z } from "zod";

import {
  creatorTeachingApproachValues,
  type CreatorLessonInputSnapshotV1,
  type CreatorLessonOutputV1,
} from "@/lib/planner/creator-lesson-contract";
import type { CreatorTimingBudget } from "@/lib/planner/creator-timing-budget";

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalProviderText = (maximum: number) => boundedText(maximum).nullable();
const timedMinutes = (maximum: number, contribution: string) => z.number()
  .int()
  .min(1)
  .max(maximum)
  .describe(`Whole minutes for ${contribution}; this value contributes to the exact requested lesson total.`);
const teachingApproachSchema = z.enum(creatorTeachingApproachValues);
const beatKindSchema = z.enum([
  "explanation",
  "demonstration",
  "example",
  "guided_practice",
  "transition",
]);
const verificationReasonSchema = z.enum([
  "version_sensitive",
  "price_sensitive",
  "capability_sensitive",
  "current_information",
  "source_needed",
]);

const providerMaterialsSchema = z.object({
  item: boundedText(300),
  purpose: optionalProviderText(500),
  required: z.boolean(),
}).strict();

const canonicalMaterialsSchema = z.object({
  item: boundedText(300),
  purpose: boundedText(500).optional(),
  required: z.boolean(),
}).strict();

const lessonBeatSchema = z.object({
  sequence: z.number().int().min(1).max(30),
  kind: beatKindSchema,
  title: boundedText(200),
  duration_minutes: timedMinutes(180, "this lesson beat"),
  educator_action: boundedText(1600),
  learner_action: boundedText(1200),
  learning_purpose: boundedText(1000),
}).strict();

const pauseAndTrySchema = z.object({
  duration_minutes: timedMinutes(60, "the optional pause-and-try activity when present"),
  activity: boundedText(1500),
  success_signal: boundedText(1000),
}).strict();

// The provider supplies lesson content for fixed slots. It cannot choose or
// change minute values: the application attaches its precomputed budget.
export function providerCreatorLessonContentSchema(beatCount: number) {
  return z.object({
    title: boundedText(160),
    learning_outcome: boundedText(1200),
    prerequisites: z.array(boundedText(500)).min(1).max(12),
    materials_tools: z.array(providerMaterialsSchema).max(20),
    opening_hook: z.object({
      teaching_move: boundedText(1200),
      learner_need_connection: boundedText(1000),
    }).strict(),
    lesson_beats: z.array(z.object({
      title: boundedText(200),
      educator_action: boundedText(1600),
      learner_action: boundedText(1200),
      learning_purpose: boundedText(1000),
    }).strict()).length(beatCount),
    likely_confusions: z.array(z.object({
      misconception_or_confusion: boundedText(1000),
      response: boundedText(1400),
    }).strict()).min(1).max(12),
    pause_and_try: z.object({
      activity: boundedText(1500),
      success_signal: boundedText(1000),
    }).strict().nullable(),
    self_check: z.object({
      prompt: boundedText(1200),
      look_for: boundedText(1200),
    }).strict(),
    recap: z.object({
      key_points: z.array(boundedText(500)).min(1).max(10),
    }).strict(),
    next_learning_step: boundedText(1000),
    recording_preparation_notes: z.object({
      must_prepare: z.array(boundedText(800)).max(20),
      optional_preparation: z.array(boundedText(800)).max(20),
      filming_notes: z.array(boundedText(800)).max(20),
    }).strict(),
    claims_resources_to_verify: z.array(z.object({
      claim_or_resource: boundedText(1000),
      reason: verificationReasonSchema,
      verification_action: boundedText(1000),
    }).strict()).max(20),
  }).strict();
}

const canonicalCreatorLessonOutputSchema: z.ZodType<CreatorLessonOutputV1> = z.object({
  title: boundedText(160),
  learning_outcome: boundedText(1200),
  prerequisites: z.array(boundedText(500)).min(1).max(12),
  materials_tools: z.array(canonicalMaterialsSchema).max(20),
  opening_hook: z.object({
    duration_minutes: timedMinutes(30, "the opening hook"),
    teaching_move: boundedText(1200),
    learner_need_connection: boundedText(1000),
  }).strict(),
  lesson_beats: z.array(lessonBeatSchema).min(1).max(20),
  likely_confusions: z.array(z.object({
    misconception_or_confusion: boundedText(1000),
    response: boundedText(1400),
  }).strict()).min(1).max(12),
  pause_and_try: pauseAndTrySchema.nullable(),
  self_check: z.object({
    duration_minutes: timedMinutes(30, "the self-check"),
    prompt: boundedText(1200),
    look_for: boundedText(1200),
  }).strict(),
  recap: z.object({
    duration_minutes: timedMinutes(30, "the recap"),
    key_points: z.array(boundedText(500)).min(1).max(10),
  }).strict(),
  next_learning_step: boundedText(1000),
  recording_preparation_notes: z.object({
    must_prepare: z.array(boundedText(800)).max(20),
    optional_preparation: z.array(boundedText(800)).max(20),
    filming_notes: z.array(boundedText(800)).max(20),
  }).strict(),
  claims_resources_to_verify: z.array(z.object({
    claim_or_resource: boundedText(1000),
    reason: verificationReasonSchema,
    verification_action: boundedText(1000),
  }).strict()).max(20),
}).strict();

export class CreatorLessonOutputValidationError extends Error {
  constructor(public readonly reasons: string[]) {
    super("The creator lesson output does not satisfy its planning contract.");
    this.name = "CreatorLessonOutputValidationError";
  }
}

export function assembleProviderCreatorLessonOutput(
  value: z.infer<ReturnType<typeof providerCreatorLessonContentSchema>>,
  budget: CreatorTimingBudget,
): CreatorLessonOutputV1 {
  if (value.lesson_beats.length !== budget.lesson_beats.length) {
    throw new CreatorLessonOutputValidationError(["The lesson beat count does not match its assigned slots."]);
  }
  if (Boolean(value.pause_and_try) !== (budget.pause_and_try_minutes !== null)) {
    throw new CreatorLessonOutputValidationError(["The pause-and-try activity does not match its assigned slot."]);
  }

  return canonicalCreatorLessonOutputSchema.parse({
    ...value,
    materials_tools: value.materials_tools.map((item) => ({
      ...item,
      purpose: item.purpose ?? undefined,
    })),
    opening_hook: {
      ...value.opening_hook,
      duration_minutes: budget.opening_hook_minutes,
    },
    lesson_beats: value.lesson_beats.map((beat, index) => ({
      ...beat,
      ...budget.lesson_beats[index],
    })),
    pause_and_try: value.pause_and_try && budget.pause_and_try_minutes !== null
      ? { ...value.pause_and_try, duration_minutes: budget.pause_and_try_minutes }
      : null,
    self_check: {
      ...value.self_check,
      duration_minutes: budget.self_check_minutes,
    },
    recap: {
      ...value.recap,
      duration_minutes: budget.recap_minutes,
    },
  });
}

export function creatorLessonDuration(output: CreatorLessonOutputV1) {
  return output.opening_hook.duration_minutes
    + output.lesson_beats.reduce((total, beat) => total + beat.duration_minutes, 0)
    + (output.pause_and_try?.duration_minutes ?? 0)
    + output.self_check.duration_minutes
    + output.recap.duration_minutes;
}

export function validateCreatorLessonAgainstInput(
  output: CreatorLessonOutputV1,
  snapshot: CreatorLessonInputSnapshotV1,
) {
  const reasons: string[] = [];
  const requested = snapshot.input;

  if (output.learning_outcome !== requested.learning_outcome) {
    reasons.push("The learning outcome must reproduce the creator-supplied outcome exactly.");
  }

  if (creatorLessonDuration(output) !== requested.duration_minutes) {
    reasons.push(`Lesson timing must total exactly ${requested.duration_minutes} minutes.`);
  }

  output.lesson_beats.forEach((beat, index) => {
    if (beat.sequence !== index + 1) reasons.push("Lesson-beat sequences must be contiguous and start at 1.");
  });

  const kinds = new Set(output.lesson_beats.map((beat) => beat.kind));
  if (!kinds.has("explanation")) reasons.push("Every creator lesson needs an explanation beat.");
  if (
    ["demonstration", "guided_tutorial", "explanation_and_demonstration", "guided_build_along"].includes(
      requested.teaching_approach,
    )
    && !kinds.has("demonstration")
  ) {
    reasons.push("The selected teaching approach requires a demonstration beat.");
  }
  if (
    ["guided_tutorial", "guided_build_along"].includes(requested.teaching_approach)
    && (!kinds.has("guided_practice") || !output.pause_and_try)
  ) {
    reasons.push("The selected teaching approach requires guided practice and a pause-and-try activity.");
  }

  if (reasons.length) throw new CreatorLessonOutputValidationError(reasons);
  return output;
}

export function parseStoredCreatorLessonOutput(value: unknown) {
  return canonicalCreatorLessonOutputSchema.parse(value);
}

export function creatorLessonOutputText(output: CreatorLessonOutputV1) {
  return [
    output.title,
    output.learning_outcome,
    ...output.prerequisites,
    ...output.materials_tools.flatMap((item) => [item.item, item.purpose]),
    output.opening_hook.teaching_move,
    output.opening_hook.learner_need_connection,
    ...output.lesson_beats.flatMap((beat) => [
      beat.title,
      beat.educator_action,
      beat.learner_action,
      beat.learning_purpose,
    ]),
    ...output.likely_confusions.flatMap((item) => [item.misconception_or_confusion, item.response]),
    output.pause_and_try?.activity,
    output.pause_and_try?.success_signal,
    output.self_check.prompt,
    output.self_check.look_for,
    ...output.recap.key_points,
    output.next_learning_step,
    ...output.recording_preparation_notes.must_prepare,
    ...output.recording_preparation_notes.optional_preparation,
    ...output.recording_preparation_notes.filming_notes,
    ...output.claims_resources_to_verify.flatMap((item) => [
      item.claim_or_resource,
      item.verification_action,
    ]),
  ].filter((value): value is string => Boolean(value));
}

export { teachingApproachSchema };
