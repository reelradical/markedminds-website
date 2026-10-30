import type { AccessLevel, ValueProvenance } from "@/lib/planner/plan-contract";

export const ROTATION_PLAN_TEMPLATE_VERSION = "rotation_plan_template.v1";
export const ROTATION_PLAN_INPUT_SCHEMA_VERSION = "rotation_plan_input.v1";
export const ROTATION_PLAN_OUTPUT_SCHEMA_VERSION = "rotation_plan_output.v1";
export const ROTATION_PLAN_PROMPT_VERSION = "rotation_plan_prompt.v1";

export const rotationPlanGrades = ["K", "1", "2", "3", "4", "5"] as const;
export type RotationPlanGrade = (typeof rotationPlanGrades)[number];

export const rotationPlanPhases = ["engage", "focus", "explore_apply", "reflect"] as const;
export type RotationPlanPhase = (typeof rotationPlanPhases)[number];

export const rotationPlanRequiredFields = [
  "standards",
  "learning_targets",
  "success_criteria",
  "instructional_resources_materials",
  "academic_vocabulary",
  "differentiation",
  "assessment_strategies",
  "writing_strategies",
  "engage",
  "focus",
  "explore_apply",
  "reflect",
] as const;

export type RotationPlanRequiredField = (typeof rotationPlanRequiredFields)[number];

export const rotationPlanTemplateV1 = {
  id: "county_k5_visual_art_rotation",
  version: ROTATION_PLAN_TEMPLATE_VERSION,
  label: "K–5 Visual Art rotation plan",
  headerFields: ["school", "teacher", "content", "rotation_date_range"] as const,
  supportedGrades: rotationPlanGrades,
  requiredPerGradeFields: rotationPlanRequiredFields,
  requiredPhases: rotationPlanPhases,
  phaseRequirements: ["duration_minutes", "teacher_actions", "student_actions"] as const,
  resourceSlots: {
    complianceTemplate: "required_template_compliance_document",
    instructionalReferences: "instructional_reference",
    teacherCreatedSources: "teacher_created_source_material",
  },
} as const;

export type RotationPlanInputV1 = {
  workflow: "rotation_plan_template";
  template_version: typeof ROTATION_PLAN_TEMPLATE_VERSION;
  school: string;
  teacher: string;
  content: string;
  rotation_date_range: string;
  grades: RotationPlanGrade[];
  topic_unit_concept: string;
  shared_objective?: string;
  standards_by_grade: Partial<Record<RotationPlanGrade, string[]>>;
  available_materials: string[];
  aggregate_learner_needs?: string;
  duration_minutes: number;
  class_size?: number;
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
  references: {
    compliance_template: {
      template_id: typeof rotationPlanTemplateV1.id;
      template_version: typeof ROTATION_PLAN_TEMPLATE_VERSION;
    };
    instructional_references: [];
    teacher_created_sources: [];
  };
};

export type RotationPlanInputSnapshotV1 = {
  input: RotationPlanInputV1;
  provenance: {
    school: ValueProvenance;
    teacher: ValueProvenance;
    content: ValueProvenance;
    rotation_date_range: ValueProvenance;
    grades: ValueProvenance;
    topic_unit_concept: ValueProvenance;
    shared_objective: ValueProvenance;
    standards_by_grade: ValueProvenance;
    available_materials: ValueProvenance;
    aggregate_learner_needs: ValueProvenance;
    duration_minutes: ValueProvenance;
    class_size: ValueProvenance;
    constraints: ValueProvenance;
    additional_notes: ValueProvenance;
    references: "system";
  };
};

export type RotationPlanPhaseOutputV1 = {
  phase: RotationPlanPhase;
  duration_minutes: number;
  teacher_actions: string[];
  student_actions: string[];
  transition_or_cleanup?: string;
};

export type RotationPlanGradeOutputV1 = {
  grade: RotationPlanGrade;
  standards: string[];
  learning_targets: string[];
  success_criteria: string[];
  instructional_resources_materials: string[];
  academic_vocabulary: string[];
  differentiation: string[];
  assessment_strategies: string[];
  writing_strategies: string[];
  phases: RotationPlanPhaseOutputV1[];
};

export type RotationPlanOutputV1 = {
  title: string;
  shared_rotation_concept: string;
  header: {
    school: string;
    teacher: string;
    content: string;
    rotation_date_range: string;
  };
  grade_plans: RotationPlanGradeOutputV1[];
};

export type RotationPlanCompletenessItem = {
  field: RotationPlanRequiredField;
  label: string;
  complete: boolean;
};

export type RotationPlanGradeCompleteness = {
  grade: RotationPlanGrade;
  complete: boolean;
  items: RotationPlanCompletenessItem[];
};

export type RotationPlanFormDefaults = {
  teacher: string;
  content: string;
  grades: RotationPlanGrade[];
  durationMinutes: number;
  classSize: number | null;
  availableMaterials: string[];
};

export type RotationPlanField =
  | "school"
  | "teacher"
  | "content"
  | "rotationDateRange"
  | "grades"
  | "topicUnitConcept"
  | "sharedObjective"
  | "standards"
  | "availableMaterials"
  | "aggregateLearnerNeeds"
  | "durationMinutes"
  | "classSize"
  | "constraints"
  | "additionalNotes";

export type RotationPlanActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<RotationPlanField, string>>;
};

export const initialRotationPlanActionState: RotationPlanActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
