import "server-only";

import { PLANNER_MODEL_ALIAS } from "@/lib/planner/plan-contract";
import { resolvePlanningProvider } from "@/server/planning/providers/registry";
import type { GeneratePlanRequest, RevisePlanRequest } from "@/server/planning/providers/types";

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
  revisePlan(request: RevisePlanRequest) {
    return resolvePlanningProvider(PLANNER_MODEL_ALIAS).revisePlan(request);
  },
};
