export const teacherRoleOptions = [
  { value: "elementary_teacher", label: "Elementary Teacher" },
  { value: "middle_school_teacher", label: "Middle School Teacher" },
  { value: "high_school_teacher", label: "High School Teacher" },
  { value: "special_area", label: "Special Area / Specials" },
  { value: "intervention", label: "Intervention" },
  { value: "special_education", label: "Special Education" },
  { value: "other", label: "Other" },
] as const;

export const subjectAreaOptions = [
  { value: "general_elementary", label: "General Elementary" },
  { value: "math", label: "Math" },
  { value: "ela", label: "ELA" },
  { value: "science", label: "Science" },
  { value: "social_studies", label: "Social Studies" },
  { value: "visual_arts", label: "Visual Arts" },
  { value: "music", label: "Music" },
  { value: "pe", label: "PE" },
  { value: "stem", label: "STEM" },
  { value: "other", label: "Other" },
] as const;

export const gradeLevelOptions = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export const planDetailOptions = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
] as const;

export const transitionCleanupOptions = [
  { value: "standard", label: "Standard awareness" },
  { value: "extra_attention", label: "Give transitions and cleanup extra attention" },
] as const;

export const lowPrepOptions = [
  { value: "neutral", label: "No default" },
  { value: "prefer", label: "Prefer lower-prep approaches" },
] as const;

export const movementOptions = [
  { value: "neutral", label: "No default" },
  { value: "encourage", label: "Surface movement opportunities" },
  { value: "limit", label: "Keep movement limited" },
] as const;

export const differentiationOptions = [
  { value: "when_relevant", label: "When relevant" },
  { value: "always_surface_options", label: "Always surface options" },
  { value: "minimal", label: "Only when requested" },
] as const;

export type TeacherRole = (typeof teacherRoleOptions)[number]["value"];
export type SubjectArea = (typeof subjectAreaOptions)[number]["value"];
export type GradeLevel = (typeof gradeLevelOptions)[number];
export type PlanDetailPreference = (typeof planDetailOptions)[number]["value"];
export type TransitionCleanupPreference = (typeof transitionCleanupOptions)[number]["value"];
export type LowPrepPreference = (typeof lowPrepOptions)[number]["value"];
export type MovementPreference = (typeof movementOptions)[number]["value"];
export type DifferentiationPreference = (typeof differentiationOptions)[number]["value"];

export type TeacherProfileInput = {
  displayName: string;
  role: TeacherRole;
  subjectAreas: SubjectArea[];
  gradeLevels: GradeLevel[];
  typicalClassDurationMinutes: number;
  typicalClassSize: number | null;
  commonMaterials: string[];
  teachingContextNotes: string | null;
  planDetailPreference: PlanDetailPreference;
  transitionCleanupPreference: TransitionCleanupPreference;
  lowPrepPreference: LowPrepPreference;
  movementPreference: MovementPreference;
  differentiationPreference: DifferentiationPreference;
};

export const defaultTeacherProfileInput: TeacherProfileInput = {
  displayName: "",
  role: "elementary_teacher",
  subjectAreas: [],
  gradeLevels: [],
  typicalClassDurationMinutes: 45,
  typicalClassSize: null,
  commonMaterials: [],
  teachingContextNotes: null,
  planDetailPreference: "balanced",
  transitionCleanupPreference: "standard",
  lowPrepPreference: "neutral",
  movementPreference: "neutral",
  differentiationPreference: "when_relevant",
};
