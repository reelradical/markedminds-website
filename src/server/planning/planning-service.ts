import "server-only";

import { PLANNER_MODEL_ALIAS } from "@/lib/planner/plan-contract";
import { resolvePlanningProvider } from "@/server/planning/providers/registry";
import type {
  GenerateCreatorLessonRequest,
  GeneratePlanRequest,
  GenerateRotationPlanRequest,
  ReviseCreatorLessonRequest,
  RevisePlanRequest,
} from "@/server/planning/providers/types";

export const PlanningService = {
  descriptor() {
    const provider = resolvePlanningProvider(PLANNER_MODEL_ALIAS);
    return {
      provider: provider.id,
      modelAlias: provider.modelAlias,
      providerModelId: provider.modelId,
    };
  },
  generatePlan(request: GeneratePlanRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).generatePlan(request);
  },
  generateRotationPlan(request: GenerateRotationPlanRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).generateRotationPlan(request);
  },
  generateCreatorLesson(request: GenerateCreatorLessonRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).generateCreatorLesson(request);
  },
  reviseCreatorLesson(request: ReviseCreatorLessonRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).reviseCreatorLesson(request);
  },
  revisePlan(request: RevisePlanRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).revisePlan(request);
  },
};
