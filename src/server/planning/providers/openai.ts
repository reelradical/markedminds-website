import "server-only";

import OpenAI, {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { ZodError } from "zod";

import { PLANNER_MODEL_ALIAS } from "@/lib/planner/plan-contract";
import { normalizeProviderPlanOutput, providerPlanOutputSchema } from "@/server/planning/output-schema";
import { buildGuidedRevisionPrompt } from "@/server/planning/prompts/guided-revision-v1";
import { buildPlanTomorrowPrompt } from "@/server/planning/prompts/plan-tomorrow-v2";
import {
  PlanningProviderError,
  type GeneratePlanRequest,
  type PlanningProvider,
  type RevisePlanRequest,
} from "@/server/planning/providers/types";

const PROVIDER_ID = "openai";
const PROVIDER_MODEL_ID = "gpt-5.4-mini";
const PROVIDER_TIMEOUT_MS = 45_000;

function configuredClient() {
  const apiKey = process.env.MARKEDMINDS_PLANNING_OPENAI_API_KEY?.trim();
  if (!apiKey) throw new PlanningProviderError("missing_configuration");
  return new OpenAI({ apiKey, timeout: PROVIDER_TIMEOUT_MS, maxRetries: 0 });
}

function safeProviderError(error: unknown) {
  if (error instanceof PlanningProviderError) return error;
  if (error instanceof APIConnectionTimeoutError) return new PlanningProviderError("provider_timeout");
  if (error instanceof RateLimitError) return new PlanningProviderError("rate_limited");
  if (error instanceof APIConnectionError) return new PlanningProviderError("provider_unavailable");
  if (error instanceof ZodError) return new PlanningProviderError("structured_output_invalid");
  if (error instanceof APIError) {
    if (error.status === 400 || error.status === 422) {
      return new PlanningProviderError("content_policy_blocked");
    }
    if (error.status && error.status >= 500) return new PlanningProviderError("provider_unavailable");
  }
  return new PlanningProviderError("unknown_safe");
}

export class OpenAIPlanningProvider implements PlanningProvider {
  readonly id = PROVIDER_ID;
  readonly modelAlias = PLANNER_MODEL_ALIAS;
  readonly modelId = PROVIDER_MODEL_ID;

  private async generateStructuredPlan(prompt: { instructions: string; input: string }) {
    const startedAt = Date.now();

    try {
      const response = await configuredClient().responses.parse({
        model: this.modelId,
        store: false,
        instructions: prompt.instructions,
        input: prompt.input,
        text: {
          format: zodTextFormat(providerPlanOutputSchema, "maps_plan_tomorrow_v1"),
        },
      });

      if (!response.output_parsed) throw new PlanningProviderError("structured_output_invalid");

      return {
        output: normalizeProviderPlanOutput(response.output_parsed),
        provider: this.id,
        providerModelId: response.model ?? this.modelId,
        latencyMs: Date.now() - startedAt,
        usage: {
          inputTokens: response.usage?.input_tokens ?? null,
          outputTokens: response.usage?.output_tokens ?? null,
          totalTokens: response.usage?.total_tokens ?? null,
        },
      };
    } catch (error) {
      throw safeProviderError(error);
    }
  }

  generatePlan(request: GeneratePlanRequest) {
    return this.generateStructuredPlan(
      buildPlanTomorrowPrompt(request.input, request.profile, request.timingCorrection),
    );
  }

  revisePlan(request: RevisePlanRequest) {
    return this.generateStructuredPlan(
      buildGuidedRevisionPrompt(
        request.input,
        request.sourceOutput,
        request.revision,
        request.profile,
        request.timingCorrection,
      ),
    );
  }
}
