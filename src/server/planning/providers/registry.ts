import "server-only";

import { PLANNER_MODEL_ALIAS } from "@/lib/planner/plan-contract";
import { OpenAIPlanningProvider } from "@/server/planning/providers/openai";
import type { PlanningProvider } from "@/server/planning/providers/types";

const providers: Record<string, () => PlanningProvider> = {
  [PLANNER_MODEL_ALIAS]: () => new OpenAIPlanningProvider(),
};

export function resolvePlanningProvider(modelAlias = PLANNER_MODEL_ALIAS) {
  const createProvider = providers[modelAlias];
  if (!createProvider) throw new Error("Unknown planning model alias.");
  return createProvider();
}
