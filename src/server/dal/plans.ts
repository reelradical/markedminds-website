import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  GENERATED_PLAN_OUTPUT_SCHEMA_VERSION,
  GUIDED_REVISION_INPUT_SCHEMA_VERSION,
  GUIDED_REVISION_PROMPT_VERSION,
  PLAN_TOMORROW_INPUT_SCHEMA_VERSION,
  PLAN_TOMORROW_PROMPT_VERSION,
  type GeneratedPlanOutputV1,
  type GuidedRevisionInputSnapshotV1,
  type PlanTomorrowInputSnapshotV1,
} from "@/lib/planner/plan-contract";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { lessonFlowDuration, parseStoredPlanOutput } from "@/server/planning/output-schema";
import type { SafeGenerationErrorCategory } from "@/server/planning/providers/types";
import { parseStoredGuidedRevisionInput } from "@/server/validation/guided-revision";
import { parseStoredInputSnapshot } from "@/server/validation/plan-tomorrow";

export type PlanDataErrorCode = "unauthenticated" | "unavailable" | "not_found" | "invalid_data";

export class PlanDataError extends Error {
  constructor(public readonly code: PlanDataErrorCode) {
    super("MAPS could not complete the plan request.");
    this.name = "PlanDataError";
  }
}

type AuthenticatedContext = {
  supabase: SupabaseClient;
  user: User;
};

type PlanRow = {
  id: string;
  title: string;
  current_revision_id: string | null;
  created_at: string;
};

type RevisionRow = {
  id: string;
  revision_number: number;
  source_kind: "initial_generation" | "regeneration";
  input_schema_version: string;
  input_snapshot: unknown;
  output_snapshot: unknown;
  created_at: string;
};

export type SavedPlanRevisionSummary = {
  id: string;
  revisionNumber: number;
  sourceKind: "initial_generation" | "regeneration";
  revisionIntent?: GuidedRevisionInputSnapshotV1["revision_request"]["intent"];
  createdAt: string;
};

export type SavedPlanSummary = {
  id: string;
  title: string;
  subjectArea: string;
  gradeLevels: string[];
  durationMinutes: number;
  createdAt: string;
};

export type SavedPlanDetail = SavedPlanSummary & {
  currentRevisionId: string;
  revisionId: string;
  revisionNumber: number;
  isCurrentRevision: boolean;
  revisionIntent?: GuidedRevisionInputSnapshotV1["revision_request"]["intent"];
  input: PlanTomorrowInputSnapshotV1;
  output: GeneratedPlanOutputV1;
  revisionCreatedAt: string;
  revisions: SavedPlanRevisionSummary[];
};

async function requireAuthenticatedContext(): Promise<AuthenticatedContext> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new PlanDataError("unauthenticated");
  return { supabase, user: data.user };
}

function parseRevisionInput(revision: RevisionRow) {
  if (revision.input_schema_version === PLAN_TOMORROW_INPUT_SCHEMA_VERSION) {
    return { input: parseStoredInputSnapshot(revision.input_snapshot) };
  }
  if (revision.input_schema_version === GUIDED_REVISION_INPUT_SCHEMA_VERSION) {
    const guided = parseStoredGuidedRevisionInput(revision.input_snapshot);
    return {
      input: guided.source_input,
      revisionIntent: guided.revision_request.intent,
    };
  }
  throw new PlanDataError("invalid_data");
}

function mapSummary(plan: PlanRow, revision: RevisionRow): SavedPlanSummary {
  try {
    const snapshot = parseRevisionInput(revision).input;
    return {
      id: plan.id,
      title: plan.title,
      subjectArea: snapshot.input.subject_area,
      gradeLevels: snapshot.input.grade_levels,
      durationMinutes: snapshot.input.duration_minutes,
      createdAt: plan.created_at,
    };
  } catch {
    throw new PlanDataError("invalid_data");
  }
}

export async function createGenerationRun({
  provider,
  modelAlias,
  retryOfRunId,
  planId,
  sourceRevisionId,
  promptVersion = PLAN_TOMORROW_PROMPT_VERSION,
  inputSchemaVersion = PLAN_TOMORROW_INPUT_SCHEMA_VERSION,
}: {
  provider: string;
  modelAlias: string;
  retryOfRunId?: string;
  planId?: string;
  sourceRevisionId?: string;
  promptVersion?: string;
  inputSchemaVersion?: string;
}) {
  const { supabase, user } = await requireAuthenticatedContext();
  const { data, error } = await supabase
    .from("generation_runs")
    .insert({
      requested_by_user_id: user.id,
      retry_of_run_id: retryOfRunId ?? null,
      plan_id: planId ?? null,
      source_revision_id: sourceRevisionId ?? null,
      provider,
      model_alias: modelAlias,
      prompt_version: promptVersion,
      input_schema_version: inputSchemaVersion,
      output_schema_version: GENERATED_PLAN_OUTPUT_SCHEMA_VERSION,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) throw new PlanDataError("unavailable");
  return (data as { id: string }).id;
}

export async function createGuidedRevisionRun({
  provider,
  modelAlias,
  planId,
  sourceRevisionId,
  retryOfRunId,
}: {
  provider: string;
  modelAlias: string;
  planId: string;
  sourceRevisionId: string;
  retryOfRunId?: string;
}) {
  return createGenerationRun({
    provider,
    modelAlias,
    planId,
    sourceRevisionId,
    retryOfRunId,
    promptVersion: GUIDED_REVISION_PROMPT_VERSION,
    inputSchemaVersion: GUIDED_REVISION_INPUT_SCHEMA_VERSION,
  });
}

export async function markGenerationRunRunning(runId: string) {
  const { supabase, user } = await requireAuthenticatedContext();
  const { data, error } = await supabase
    .from("generation_runs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", runId)
    .eq("requested_by_user_id", user.id)
    .eq("status", "pending")
    .select("id")
    .single();

  if (error || !data) throw new PlanDataError("unavailable");
}

export async function markGenerationRunFailed(
  runId: string,
  category: SafeGenerationErrorCategory,
  latencyMs?: number,
) {
  const { supabase, user } = await requireAuthenticatedContext();
  const { error } = await supabase
    .from("generation_runs")
    .update({
      status: "failed",
      safe_error_category: category,
      latency_ms: latencyMs ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", runId)
    .eq("requested_by_user_id", user.id)
    .in("status", ["pending", "running"]);

  if (error) throw new PlanDataError("unavailable");
}

export async function finalizeInitialPlan({
  runId,
  input,
  output,
  providerModelId,
  latencyMs,
  usage,
}: {
  runId: string;
  input: PlanTomorrowInputSnapshotV1;
  output: GeneratedPlanOutputV1;
  providerModelId: string;
  latencyMs: number;
  usage: { inputTokens: number | null; outputTokens: number | null; totalTokens: number | null };
}) {
  const { supabase } = await requireAuthenticatedContext();
  const planId = crypto.randomUUID();
  const revisionId = crypto.randomUUID();
  const { data, error } = await supabase.rpc("finalize_plan_tomorrow_generation", {
    run_id: runId,
    plan_id: planId,
    revision_id: revisionId,
    plan_title: output.title,
    input_snapshot: input,
    output_snapshot: output,
    provider_model_id: providerModelId,
    latency_ms: latencyMs,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    total_tokens: usage.totalTokens,
  });

  if (error || data !== planId) throw new PlanDataError("unavailable");
  return planId;
}

export async function finalizeGuidedRevision({
  runId,
  planId,
  sourceRevisionId,
  input,
  output,
  providerModelId,
  latencyMs,
  usage,
}: {
  runId: string;
  planId: string;
  sourceRevisionId: string;
  input: GuidedRevisionInputSnapshotV1;
  output: GeneratedPlanOutputV1;
  providerModelId: string;
  latencyMs: number;
  usage: { inputTokens: number | null; outputTokens: number | null; totalTokens: number | null };
}) {
  const { supabase } = await requireAuthenticatedContext();
  const revisionId = crypto.randomUUID();
  const { data, error } = await supabase.rpc("finalize_guided_plan_revision", {
    run_id: runId,
    plan_id: planId,
    source_revision_id: sourceRevisionId,
    revision_id: revisionId,
    plan_title: output.title,
    input_snapshot: input,
    output_snapshot: output,
    provider_model_id: providerModelId,
    latency_ms: latencyMs,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    total_tokens: usage.totalTokens,
  });

  if (error || data !== revisionId) throw new PlanDataError("unavailable");
  return revisionId;
}

export async function listCurrentUserPlans(): Promise<SavedPlanSummary[]> {
  const { supabase, user } = await requireAuthenticatedContext();
  const { data: plansData, error: plansError } = await supabase
    .from("plans")
    .select("id, title, current_revision_id, created_at")
    .eq("owner_user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (plansError) throw new PlanDataError("unavailable");
  const plans = (plansData ?? []) as PlanRow[];
  const revisionIds = plans.flatMap((plan) => plan.current_revision_id ? [plan.current_revision_id] : []);
  if (!revisionIds.length) return [];

  const { data: revisionsData, error: revisionsError } = await supabase
    .from("plan_revisions")
    .select("id, revision_number, source_kind, input_schema_version, input_snapshot, output_snapshot, created_at")
    .in("id", revisionIds);

  if (revisionsError) throw new PlanDataError("unavailable");
  const revisions = new Map(((revisionsData ?? []) as RevisionRow[]).map((revision) => [revision.id, revision]));

  return plans.flatMap((plan) => {
    const revision = plan.current_revision_id ? revisions.get(plan.current_revision_id) : null;
    return revision ? [mapSummary(plan, revision)] : [];
  });
}

export async function getCurrentUserPlan(
  planId: string,
  selectedRevisionId?: string,
): Promise<SavedPlanDetail> {
  const { supabase, user } = await requireAuthenticatedContext();
  const { data: planData, error: planError } = await supabase
    .from("plans")
    .select("id, title, current_revision_id, created_at")
    .eq("id", planId)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (planError) throw new PlanDataError("unavailable");
  if (!planData) throw new PlanDataError("not_found");
  const plan = planData as PlanRow;
  if (!plan.current_revision_id) throw new PlanDataError("invalid_data");

  const revisionId = selectedRevisionId ?? plan.current_revision_id;
  const { data: revisionData, error: revisionError } = await supabase
    .from("plan_revisions")
    .select("id, revision_number, source_kind, input_schema_version, input_snapshot, output_snapshot, created_at")
    .eq("id", revisionId)
    .eq("plan_id", plan.id)
    .maybeSingle();

  if (revisionError) throw new PlanDataError("unavailable");
  if (!revisionData) throw new PlanDataError("not_found");
  const revision = revisionData as RevisionRow;

  const { data: revisionsData, error: revisionsError } = await supabase
    .from("plan_revisions")
    .select("id, revision_number, source_kind, input_schema_version, input_snapshot, output_snapshot, created_at")
    .eq("plan_id", plan.id)
    .order("revision_number", { ascending: false });

  if (revisionsError) throw new PlanDataError("unavailable");
  const revisions = (revisionsData ?? []) as RevisionRow[];

  try {
    const summary = mapSummary(plan, revision);
    const parsedInput = parseRevisionInput(revision);
    const input = parsedInput.input;
    const output = parseStoredPlanOutput(revision.output_snapshot);
    if (Math.abs(lessonFlowDuration(output) - input.input.duration_minutes) > 1) {
      throw new PlanDataError("invalid_data");
    }
    return {
      ...summary,
      currentRevisionId: plan.current_revision_id,
      revisionId: revision.id,
      revisionNumber: revision.revision_number,
      isCurrentRevision: revision.id === plan.current_revision_id,
      revisionIntent: parsedInput.revisionIntent,
      input,
      output,
      revisionCreatedAt: revision.created_at,
      revisions: revisions.map((item) => {
        const parsed = parseRevisionInput(item);
        return {
          id: item.id,
          revisionNumber: item.revision_number,
          sourceKind: item.source_kind,
          revisionIntent: parsed.revisionIntent,
          createdAt: item.created_at,
        };
      }),
    };
  } catch (error) {
    if (error instanceof PlanDataError) throw error;
    throw new PlanDataError("invalid_data");
  }
}
