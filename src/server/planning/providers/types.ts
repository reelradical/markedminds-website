import "server-only";

import type {
  CreatorLessonInputSnapshotV1,
  CreatorLessonOutputV1,
  CreatorRevisionRequestV1,
} from "@/lib/planner/creator-lesson-contract";
import type { CreatorTimingBudget } from "@/lib/planner/creator-timing-budget";
import type {
  GeneratedPlanOutputV1,
  GuidedRevisionRequestV1,
  PlanTomorrowInputSnapshotV1,
} from "@/lib/planner/plan-contract";
import type {
  RotationPlanInputSnapshotV1,
  RotationPlanOutputV1,
} from "@/lib/planner/rotation-plan-contract";
import type { PlanPromptContext } from "@/server/planning/prompts/plan-tomorrow-v2";

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

export type RotationPlanProviderResult = Omit<PlanningProviderResult, "output"> & {
  output: RotationPlanOutputV1;
};

export type CreatorLessonProviderResult = Omit<PlanningProviderResult, "output"> & {
  output: CreatorLessonOutputV1;
};

export type GeneratePlanRequest = {
  input: PlanTomorrowInputSnapshotV1;
  profile: PlanPromptContext;
  timingCorrection?: { requestedMinutes: number; priorMinutes: number };
};

export type RevisePlanRequest = {
  input: PlanTomorrowInputSnapshotV1;
  sourceOutput: GeneratedPlanOutputV1;
  revision: GuidedRevisionRequestV1;
  profile: PlanPromptContext;
  timingCorrection?: { requestedMinutes: number; priorMinutes: number };
};

export type GenerateRotationPlanRequest = {
  input: RotationPlanInputSnapshotV1;
  profile: PlanPromptContext;
};

export type GenerateCreatorLessonRequest = {
  input: CreatorLessonInputSnapshotV1;
  timingBudget: CreatorTimingBudget;
};

export type ReviseCreatorLessonRequest = {
  input: CreatorLessonInputSnapshotV1;
  sourceOutput: CreatorLessonOutputV1;
  revision: CreatorRevisionRequestV1;
  timingBudget: CreatorTimingBudget;
};

export interface PlanningProvider {
  readonly id: string;
  readonly modelAlias: string;
  readonly modelId: string;
  generatePlan(request: GeneratePlanRequest): Promise<PlanningProviderResult>;
  generateRotationPlan(request: GenerateRotationPlanRequest): Promise<RotationPlanProviderResult>;
  generateCreatorLesson(request: GenerateCreatorLessonRequest): Promise<CreatorLessonProviderResult>;
  reviseCreatorLesson(request: ReviseCreatorLessonRequest): Promise<CreatorLessonProviderResult>;
  revisePlan(request: RevisePlanRequest): Promise<PlanningProviderResult>;
}
