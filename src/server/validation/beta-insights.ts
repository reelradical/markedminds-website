import "server-only";

import { z } from "zod";

const nonNegativeInteger = z.number().int().nonnegative();
const nullableNonNegativeInteger = nonNegativeInteger.nullable();
const nonNegativeNumber = z.number().nonnegative();
const percentage = z.number().min(0).max(100);
const timestamp = z.string().datetime({ offset: true });
const nullableTimestamp = timestamp.nullable();
const utcDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const feedbackCountsSchema = z.object({
  feedback_count: nonNegativeInteger,
  yes: nonNegativeInteger,
  mostly: nonNegativeInteger,
  no: nonNegativeInteger,
}).strict();

const generationRollupSchema = z.object({
  run_type: z.enum(["initial_generation", "guided_revision"]),
  successful_runs: nonNegativeInteger,
  metered_runs: nonNegativeInteger,
  average_latency_ms: nullableNonNegativeInteger,
  median_latency_ms: nullableNonNegativeInteger,
  average_input_tokens: nullableNonNegativeInteger,
  average_output_tokens: nullableNonNegativeInteger,
  average_total_tokens: nullableNonNegativeInteger,
  total_input_tokens: nonNegativeInteger,
  total_output_tokens: nonNegativeInteger,
}).strict();

const modelTokenRollupSchema = z.object({
  run_type: z.enum(["initial_generation", "guided_revision"]),
  model_id: z.string().trim().min(1).max(160),
  successful_runs: nonNegativeInteger,
  metered_runs: nonNegativeInteger,
  total_input_tokens: nonNegativeInteger,
  total_output_tokens: nonNegativeInteger,
}).strict();

export const mapsBetaInsightsSchema = z.object({
  generated_at: timestamp,
  summary: z.object({
    total_beta_users: nonNegativeInteger,
    users_with_saved_plan: nonNegativeInteger,
    returning_users: nonNegativeInteger,
    users_active_last_7_days: nonNegativeInteger,
    total_saved_plans: nonNegativeInteger,
    total_revisions: nonNegativeInteger,
    plans_per_active_user: nonNegativeNumber,
    revision_rate_percent: percentage,
    total_feedback_submissions: nonNegativeInteger,
    feedback_response_rate_percent: percentage,
    teachability_rate_percent: percentage,
    yes_or_mostly_rate_percent: percentage,
  }).strict(),
  feedback: z.object({
    totals: z.object({
      total: nonNegativeInteger,
      yes: nonNegativeInteger,
      mostly: nonNegativeInteger,
      no: nonNegativeInteger,
      yes_percent: percentage,
      mostly_percent: percentage,
      no_percent: percentage,
    }).strict(),
    by_version_type: z.array(feedbackCountsSchema.extend({
      version_type: z.enum(["original", "revised"]),
    }).strict()),
    by_revision_intent: z.array(feedbackCountsSchema.extend({
      revision_intent: z.enum([
        "fit_learners",
        "improve_pacing",
        "reduce_prep",
        "strengthen_evidence",
        "increase_agency",
      ]),
    }).strict()),
  }).strict(),
  generation: z.object({
    by_run_type: z.array(generationRollupSchema),
    token_usage_by_model: z.array(modelTokenRollupSchema),
  }).strict(),
  daily_usage: z.array(z.object({
    date: utcDate,
    active_users: nonNegativeInteger,
    plans_created: nonNegativeInteger,
    revisions_created: nonNegativeInteger,
    feedback_submitted: nonNegativeInteger,
  }).strict()),
  users: z.array(z.object({
    beta_id: z.string().regex(/^[A-F0-9]{10}$/),
    display_name: z.string().trim().min(1).max(80).nullable(),
    first_activity: nullableTimestamp,
    last_activity: nullableTimestamp,
    plans_created: nonNegativeInteger,
    revisions_created: nonNegativeInteger,
    feedback_submitted: nonNegativeInteger,
    active_day_count: nonNegativeInteger,
  }).strict()),
}).strict();

export type MapsBetaInsights = z.infer<typeof mapsBetaInsightsSchema>;
export type GenerationRunType = MapsBetaInsights["generation"]["by_run_type"][number]["run_type"];
