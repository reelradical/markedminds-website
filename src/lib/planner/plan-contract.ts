export const PLAN_TOMORROW_INPUT_SCHEMA_VERSION = "plan_tomorrow_input.v1";
export const GENERATED_PLAN_OUTPUT_SCHEMA_VERSION = "generated_plan_output.v1";
export const PLAN_TOMORROW_PROMPT_VERSION = "plan_tomorrow_prompt.v1";
export const PLANNER_MODEL_ALIAS = "planner-primary";

export const accessOptions = [
  { value: "unknown", label: "Not specified" },
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "none", label: "Not available" },
] as const;

export type AccessLevel = (typeof accessOptions)[number]["value"];
export type ValueProvenance = "user" | "profile" | "system";

export type PlanTomorrowInputV1 = {
  workflow: "plan_tomorrow";
  topic: string;
  subject_area: string;
  grade_levels: string[];
  duration_minutes: number;
  class_size?: number;
  objective?: string;
  available_materials: string[];
  student_needs?: string;
  constraints: {
    copy_access: AccessLevel;
    technology_access: AccessLevel;
    prep_time_minutes?: number;
    transition_minutes?: number;
    cleanup_minutes?: number;
    space_constraints?: string;
    must_avoid: string[];
    other?: string;
  };
  additional_notes?: string;
};

export type PlanTomorrowProvenanceV1 = {
  topic: ValueProvenance;
  subject_area: ValueProvenance;
  grade_levels: ValueProvenance;
  duration_minutes: ValueProvenance;
  class_size: ValueProvenance;
  objective: ValueProvenance;
  available_materials: ValueProvenance;
  student_needs: ValueProvenance;
  constraints: {
    copy_access: ValueProvenance;
    technology_access: ValueProvenance;
    prep_time_minutes: ValueProvenance;
    transition_minutes: ValueProvenance;
    cleanup_minutes: ValueProvenance;
    space_constraints: ValueProvenance;
    must_avoid: ValueProvenance;
    other: ValueProvenance;
  };
  additional_notes: ValueProvenance;
};

export type PlanTomorrowInputSnapshotV1 = {
  input: PlanTomorrowInputV1;
  provenance: PlanTomorrowProvenanceV1;
};

export type GeneratedPlanOutputV1 = {
  title: string;
  goal: string;
  before_students_arrive: Array<{
    sequence: number;
    task: string;
    estimated_minutes?: number;
    essential: boolean;
  }>;
  materials: Array<{
    item: string;
    quantity_or_setup?: string;
    required: boolean;
    notes?: string;
  }>;
  lesson_flow: Array<{
    sequence: number;
    duration_minutes: number;
    activity_title: string;
    teacher_action: string;
    student_action: string;
    notes?: string;
    transition_guidance?: string;
  }>;
  teacher_moves: Array<{
    move: string;
    purpose?: string;
    during_flow_sequence?: number;
  }>;
  differentiation: {
    access_supports: string[];
    additional_challenge: string[];
    grouping_or_participation?: string[];
  };
  checks_for_understanding: Array<{
    during_flow_sequence: number;
    method: string;
    look_for: string;
    response_if_not_yet?: string;
  }>;
  if_things_go_sideways: Array<{
    likely_issue: string;
    signal?: string;
    response: string;
    time_adjustment?: string;
  }>;
  what_you_need_for_tomorrow: string[];
};

export type PlanTomorrowField =
  | "topic"
  | "subjectArea"
  | "gradeLevels"
  | "durationMinutes"
  | "classSize"
  | "objective"
  | "availableMaterials"
  | "studentNeeds"
  | "constraints"
  | "additionalNotes";

export type PlanTomorrowActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<PlanTomorrowField, string>>;
};

export const initialPlanTomorrowActionState: PlanTomorrowActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export type PlanTomorrowFormDefaults = {
  subjectArea: string;
  gradeLevels: string[];
  durationMinutes: number;
  classSize: number | null;
  availableMaterials: string[];
};
