import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import type {
  PlanFeedbackResponse,
  SavedPlanFeedback,
} from "@/lib/planner/feedback-contract";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PlanFeedbackDataErrorCode = "unauthenticated" | "not_found" | "unavailable";

export class PlanFeedbackDataError extends Error {
  constructor(public readonly code: PlanFeedbackDataErrorCode) {
    super("MAPS could not complete the feedback request.");
    this.name = "PlanFeedbackDataError";
  }
}

type AuthenticatedContext = {
  supabase: SupabaseClient;
  user: User;
};

type FeedbackRow = {
  teach_tomorrow_response: PlanFeedbackResponse;
  comment: string | null;
  updated_at: string;
};

async function requireAuthenticatedContext(): Promise<AuthenticatedContext> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new PlanFeedbackDataError("unauthenticated");
  return { supabase, user: data.user };
}

async function requireOwnedRevision(
  supabase: SupabaseClient,
  planId: string,
  revisionId: string,
) {
  const { data, error } = await supabase
    .from("plan_revisions")
    .select("id")
    .eq("id", revisionId)
    .eq("plan_id", planId)
    .maybeSingle();

  if (error) throw new PlanFeedbackDataError("unavailable");
  if (!data) throw new PlanFeedbackDataError("not_found");
}

export async function getCurrentUserPlanFeedback(
  planId: string,
  revisionId: string,
): Promise<SavedPlanFeedback | null> {
  const { supabase, user } = await requireAuthenticatedContext();
  await requireOwnedRevision(supabase, planId, revisionId);

  const { data, error } = await supabase
    .from("plan_revision_feedback")
    .select("teach_tomorrow_response, comment, updated_at")
    .eq("owner_user_id", user.id)
    .eq("plan_id", planId)
    .eq("revision_id", revisionId)
    .maybeSingle();

  if (error) throw new PlanFeedbackDataError("unavailable");
  if (!data) return null;
  const feedback = data as FeedbackRow;

  return {
    response: feedback.teach_tomorrow_response,
    comment: feedback.comment,
    updatedAt: feedback.updated_at,
  };
}

export async function saveCurrentUserPlanFeedback({
  planId,
  revisionId,
  response,
  comment,
}: {
  planId: string;
  revisionId: string;
  response: PlanFeedbackResponse;
  comment?: string;
}) {
  const { supabase, user } = await requireAuthenticatedContext();
  await requireOwnedRevision(supabase, planId, revisionId);

  const { error } = await supabase
    .from("plan_revision_feedback")
    .upsert({
      owner_user_id: user.id,
      plan_id: planId,
      revision_id: revisionId,
      teach_tomorrow_response: response,
      comment: comment ?? null,
    }, {
      onConflict: "owner_user_id,plan_id,revision_id",
    });

  if (error) throw new PlanFeedbackDataError("unavailable");
}
