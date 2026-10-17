import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mapsBetaInsightsSchema,
  type GenerationRunType,
  type MapsBetaInsights,
} from "@/server/validation/beta-insights";

export type BetaInsightsDataErrorCode = "unauthenticated" | "forbidden" | "unavailable";

export class BetaInsightsDataError extends Error {
  constructor(public readonly code: BetaInsightsDataErrorCode) {
    super("MAPS could not load private-beta insights.");
    this.name = "BetaInsightsDataError";
  }
}

type CostEstimate = {
  estimatedCostUsd: number;
  estimatedCostByRunType: Record<GenerationRunType, number>;
  pricedMeteredRuns: number;
  totalMeteredRuns: number;
  pricingCoveragePercent: number;
  pricingDate: "2026-10-16";
  basis: "standard_uncached_upper_bound";
};

export type MapsBetaInsightsView = MapsBetaInsights & {
  generation: MapsBetaInsights["generation"] & {
    cost_estimate: CostEstimate;
  };
};

const pricingPerMillionTokens = {
  "gpt-5.4-mini": { input: 0.75, output: 4.5 },
} as const;

function pricingForModel(modelId: string) {
  if (modelId === "gpt-5.4-mini" || modelId.startsWith("gpt-5.4-mini-")) {
    return pricingPerMillionTokens["gpt-5.4-mini"];
  }
  return null;
}

function estimateGenerationCost(insights: MapsBetaInsights): CostEstimate {
  const byRunType: Record<GenerationRunType, number> = {
    initial_generation: 0,
    guided_revision: 0,
  };
  let estimatedCostUsd = 0;
  let pricedMeteredRuns = 0;
  let totalMeteredRuns = 0;

  for (const row of insights.generation.token_usage_by_model) {
    totalMeteredRuns += row.metered_runs;
    const pricing = pricingForModel(row.model_id);
    if (!pricing) continue;

    const rowCost =
      (row.total_input_tokens / 1_000_000) * pricing.input
      + (row.total_output_tokens / 1_000_000) * pricing.output;
    estimatedCostUsd += rowCost;
    byRunType[row.run_type] += rowCost;
    pricedMeteredRuns += row.metered_runs;
  }

  return {
    estimatedCostUsd,
    estimatedCostByRunType: byRunType,
    pricedMeteredRuns,
    totalMeteredRuns,
    pricingCoveragePercent: totalMeteredRuns
      ? Math.round((pricedMeteredRuns / totalMeteredRuns) * 1000) / 10
      : 0,
    pricingDate: "2026-10-16",
    basis: "standard_uncached_upper_bound",
  };
}

export async function getMapsBetaInsights(): Promise<MapsBetaInsightsView> {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new BetaInsightsDataError("unauthenticated");
  }

  const { data, error } = await supabase.rpc("get_maps_beta_insights");

  if (error?.code === "42501") {
    throw new BetaInsightsDataError("forbidden");
  }
  if (error || !data) {
    throw new BetaInsightsDataError("unavailable");
  }

  const parsed = mapsBetaInsightsSchema.safeParse(data);
  if (!parsed.success) {
    throw new BetaInsightsDataError("unavailable");
  }

  return {
    ...parsed.data,
    generation: {
      ...parsed.data.generation,
      cost_estimate: estimateGenerationCost(parsed.data),
    },
  };
}
