import "server-only";

import type { GeneratedPlanOutputV1, PlanTomorrowInputSnapshotV1 } from "@/lib/planner/plan-contract";
import type { PlanPromptContext } from "@/server/planning/prompts/plan-tomorrow-v1";

export type SafeGenerationErrorCategory =
  | "missing_configuration"
  | "rate_limited"
  | "provider_unavailable"
  | "provider_timeout"
  | "content_policy_blocked"
  | "structured_output_invalid"
  | "duration_validation_failed"
  | "privacy_output_blocked"
  | "persistence_failed"
  | "unknown_safe";

export class PlanningProviderError extends Error {
  constructor(public readonly category: SafeGenerationErrorCategory) {
    super("The planning provider could not complete the request.");
    this.name = "PlanningProviderError";
  }
}

export type PlanningProviderResult = {
  output: GeneratedPlanOutputV1;
  provider: string;
  providerModelId: string;
  latencyMs: number;
  usage: {
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
  };
};

export type GeneratePlanRequest = {
  input: PlanTomorrowInputSnapshotV1;
  profile: PlanPromptContext;
  timingCorrection?: { requestedMinutes: number; priorMinutes: number };
};

export interface PlanningProvider {
  readonly id: string;
  readonly modelAlias: string;
  readonly modelId: string;
  generatePlan(request: GeneratePlanRequest): Promise<PlanningProviderResult>;
}
