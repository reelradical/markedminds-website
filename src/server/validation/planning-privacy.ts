import "server-only";

import type { PlanTomorrowField, PlanTomorrowInputV1 } from "@/lib/planner/plan-contract";

const privacyMessage =
  "This may include information that identifies a student. Remove names, IDs, diagnoses, medical details, and text copied from an IEP or 504 plan. Describe the need at a group level, then try again.";

const obviousSensitivePatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:student|pupil|learner)\s*(?:id|number|no\.?|#)\s*[:#-]?\s*[A-Z0-9-]{3,}\b/i,
  /\b(?:IEP|504)\b/i,
  /\b(?:diagnos(?:is|ed)|medication|medical record|health plan)\b/i,
];

function appearsSensitive(value: string | undefined) {
  return Boolean(value && obviousSensitivePatterns.some((pattern) => pattern.test(value)));
}

export function screenPlanTomorrowInput(input: PlanTomorrowInputV1) {
  const fieldErrors: Partial<Record<PlanTomorrowField, string>> = {};
  const fields: Array<[PlanTomorrowField, string | undefined]> = [
    ["topic", input.topic],
    ["objective", input.objective],
    ["studentNeeds", input.student_needs],
    ["constraints", input.constraints.space_constraints],
    ["constraints", input.constraints.other],
    ["additionalNotes", input.additional_notes],
    ["constraints", input.constraints.must_avoid.join(" ")],
  ];

  for (const [field, value] of fields) {
    if (appearsSensitive(value)) fieldErrors[field] = privacyMessage;
  }

  return fieldErrors;
}

export function containsObviousSensitiveText(values: string[]) {
  return values.some(appearsSensitive);
}

export function guidedRevisionPrivacyError(value: string | undefined) {
  return appearsSensitive(value) ? privacyMessage : null;
}
