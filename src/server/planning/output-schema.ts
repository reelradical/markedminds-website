import "server-only";

import { z } from "zod";

import type { GeneratedPlanOutputV1 } from "@/lib/planner/plan-contract";

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalProviderText = (maximum: number) => boundedText(maximum).nullable();
const positiveSequence = z.number().int().min(1).max(100);

export const providerPlanOutputSchema = z.object({
  title: boundedText(160),
  goal: boundedText(1000),
  before_students_arrive: z.array(z.object({
    sequence: positiveSequence,
    task: boundedText(500),
    estimated_minutes: z.number().int().min(0).max(240).nullable(),
    essential: z.boolean(),
  }).strict()).max(30),
  materials: z.array(z.object({
    item: boundedText(200),
    quantity_or_setup: optionalProviderText(300),
    required: z.boolean(),
    notes: optionalProviderText(500),
  }).strict()).max(40),
  lesson_flow: z.array(z.object({
    sequence: positiveSequence,
    duration_minutes: z.number().int().min(1).max(240),
    activity_title: boundedText(200),
    teacher_action: boundedText(1500),
    student_action: boundedText(1500),
    notes: optionalProviderText(1000),
    transition_guidance: optionalProviderText(1000),
  }).strict()).min(1).max(40),
  teacher_moves: z.array(z.object({
    move: boundedText(1000),
    purpose: optionalProviderText(1000),
    during_flow_sequence: positiveSequence.nullable(),
  }).strict()).min(1).max(40),
  differentiation: z.object({
    access_supports: z.array(boundedText(1000)).max(30),
    additional_challenge: z.array(boundedText(1000)).max(30),
    grouping_or_participation: z.array(boundedText(1000)).max(30).nullable(),
  }).strict(),
  checks_for_understanding: z.array(z.object({
    during_flow_sequence: positiveSequence,
    method: boundedText(1000),
    look_for: boundedText(1000),
    response_if_not_yet: optionalProviderText(1000),
  }).strict()).min(1).max(40),
  if_things_go_sideways: z.array(z.object({
    likely_issue: boundedText(1000),
    signal: optionalProviderText(1000),
    response: boundedText(1500),
    time_adjustment: optionalProviderText(500),
  }).strict()).min(1).max(30),
  what_you_need_for_tomorrow: z.array(boundedText(500)).max(30),
}).strict();

const canonicalPlanOutputSchema: z.ZodType<GeneratedPlanOutputV1> = z.object({
  title: boundedText(160),
  goal: boundedText(1000),
  before_students_arrive: z.array(z.object({
    sequence: positiveSequence,
    task: boundedText(500),
    estimated_minutes: z.number().int().min(0).max(240).optional(),
    essential: z.boolean(),
  }).strict()).max(30),
  materials: z.array(z.object({
    item: boundedText(200),
    quantity_or_setup: boundedText(300).optional(),
    required: z.boolean(),
    notes: boundedText(500).optional(),
  }).strict()).max(40),
  lesson_flow: z.array(z.object({
    sequence: positiveSequence,
    duration_minutes: z.number().int().min(1).max(240),
    activity_title: boundedText(200),
    teacher_action: boundedText(1500),
    student_action: boundedText(1500),
    notes: boundedText(1000).optional(),
    transition_guidance: boundedText(1000).optional(),
  }).strict()).min(1).max(40),
  teacher_moves: z.array(z.object({
    move: boundedText(1000),
    purpose: boundedText(1000).optional(),
    during_flow_sequence: positiveSequence.optional(),
  }).strict()).min(1).max(40),
  differentiation: z.object({
    access_supports: z.array(boundedText(1000)).max(30),
    additional_challenge: z.array(boundedText(1000)).max(30),
    grouping_or_participation: z.array(boundedText(1000)).max(30).optional(),
  }).strict(),
  checks_for_understanding: z.array(z.object({
    during_flow_sequence: positiveSequence,
    method: boundedText(1000),
    look_for: boundedText(1000),
    response_if_not_yet: boundedText(1000).optional(),
  }).strict()).min(1).max(40),
  if_things_go_sideways: z.array(z.object({
    likely_issue: boundedText(1000),
    signal: boundedText(1000).optional(),
    response: boundedText(1500),
    time_adjustment: boundedText(500).optional(),
  }).strict()).min(1).max(30),
  what_you_need_for_tomorrow: z.array(boundedText(500)).max(30),
}).strict().superRefine((plan, context) => {
  const expectedSequences = plan.lesson_flow.map((_, index) => index + 1);
  const actualSequences = plan.lesson_flow.map((step) => step.sequence);
  if (actualSequences.some((sequence, index) => sequence !== expectedSequences[index])) {
    context.addIssue({ code: "custom", message: "Lesson flow sequences must be contiguous from 1." });
  }

  const validSequences = new Set(actualSequences);
  for (const move of plan.teacher_moves) {
    if (move.during_flow_sequence && !validSequences.has(move.during_flow_sequence)) {
      context.addIssue({ code: "custom", message: "Teacher move references an unknown lesson step." });
    }
  }
  for (const check of plan.checks_for_understanding) {
    if (!validSequences.has(check.during_flow_sequence)) {
      context.addIssue({ code: "custom", message: "Assessment references an unknown lesson step." });
    }
  }
});

function withoutNull<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function normalizeProviderPlanOutput(value: z.infer<typeof providerPlanOutputSchema>) {
  return canonicalPlanOutputSchema.parse({
    ...value,
    before_students_arrive: value.before_students_arrive.map((item) => ({
      ...item,
      estimated_minutes: withoutNull(item.estimated_minutes),
    })),
    materials: value.materials.map((item) => ({
      ...item,
      quantity_or_setup: withoutNull(item.quantity_or_setup),
      notes: withoutNull(item.notes),
    })),
    lesson_flow: value.lesson_flow.map((item) => ({
      ...item,
      notes: withoutNull(item.notes),
      transition_guidance: withoutNull(item.transition_guidance),
    })),
    teacher_moves: value.teacher_moves.map((item) => ({
      ...item,
      purpose: withoutNull(item.purpose),
      during_flow_sequence: withoutNull(item.during_flow_sequence),
    })),
    differentiation: {
      ...value.differentiation,
      grouping_or_participation: withoutNull(value.differentiation.grouping_or_participation),
    },
    checks_for_understanding: value.checks_for_understanding.map((item) => ({
      ...item,
      response_if_not_yet: withoutNull(item.response_if_not_yet),
    })),
    if_things_go_sideways: value.if_things_go_sideways.map((item) => ({
      ...item,
      signal: withoutNull(item.signal),
      time_adjustment: withoutNull(item.time_adjustment),
    })),
  });
}

export function parseStoredPlanOutput(value: unknown) {
  return canonicalPlanOutputSchema.parse(value);
}

export function lessonFlowDuration(plan: GeneratedPlanOutputV1) {
  return plan.lesson_flow.reduce((total, step) => total + step.duration_minutes, 0);
}

export function planOutputText(plan: GeneratedPlanOutputV1) {
  return [
    plan.title,
    plan.goal,
    ...plan.before_students_arrive.map((item) => item.task),
    ...plan.materials.flatMap((item) => [item.item, item.quantity_or_setup, item.notes]),
    ...plan.lesson_flow.flatMap((item) => [
      item.activity_title,
      item.teacher_action,
      item.student_action,
      item.notes,
      item.transition_guidance,
    ]),
    ...plan.teacher_moves.flatMap((item) => [item.move, item.purpose]),
    ...plan.differentiation.access_supports,
    ...plan.differentiation.additional_challenge,
    ...(plan.differentiation.grouping_or_participation ?? []),
    ...plan.checks_for_understanding.flatMap((item) => [item.method, item.look_for, item.response_if_not_yet]),
    ...plan.if_things_go_sideways.flatMap((item) => [item.likely_issue, item.signal, item.response, item.time_adjustment]),
    ...plan.what_you_need_for_tomorrow,
  ].filter((value): value is string => Boolean(value));
}
