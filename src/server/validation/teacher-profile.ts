import "server-only";

import type { ProfileField } from "@/lib/planner/profile-action-state";
import {
  differentiationOptions,
  gradeLevelOptions,
  lowPrepOptions,
  movementOptions,
  planDetailOptions,
  subjectAreaOptions,
  teacherRoleOptions,
  transitionCleanupOptions,
  type TeacherProfileInput,
} from "@/lib/planner/profile-options";

export class ProfileValidationError extends Error {
  constructor(public readonly fieldErrors: Partial<Record<ProfileField, string>>) {
    super("Profile details are invalid.");
    this.name = "ProfileValidationError";
  }
}

function allowedValues<const T extends readonly { value: string }[]>(options: T) {
  return new Set(options.map(({ value }) => value));
}

const roles = allowedValues(teacherRoleOptions);
const subjects = allowedValues(subjectAreaOptions);
const grades = new Set<string>(gradeLevelOptions);
const planDetails = allowedValues(planDetailOptions);
const transitionCleanup = allowedValues(transitionCleanupOptions);
const lowPrep = allowedValues(lowPrepOptions);
const movement = allowedValues(movementOptions);
const differentiation = allowedValues(differentiationOptions);

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function selected(formData: FormData, name: string) {
  return [...new Set(formData.getAll(name).filter((value): value is string => typeof value === "string"))];
}

function optionalInteger(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

export function parseTeacherProfileForm(formData: FormData): TeacherProfileInput {
  const displayName = text(formData, "display_name");
  const role = text(formData, "role");
  const subjectAreas = selected(formData, "subject_areas");
  const gradeLevels = selected(formData, "grade_levels");
  const duration = optionalInteger(text(formData, "typical_class_duration_minutes"));
  const classSize = optionalInteger(text(formData, "typical_class_size"));
  const materials = [...new Set(text(formData, "common_materials").split(",").map((item) => item.trim()).filter(Boolean))];
  const notes = text(formData, "teaching_context_notes");
  const planDetail = text(formData, "plan_detail_preference") || "balanced";
  const transition = text(formData, "transition_cleanup_preference") || "standard";
  const prep = text(formData, "low_prep_preference") || "neutral";
  const movementValue = text(formData, "movement_preference") || "neutral";
  const differentiationValue = text(formData, "differentiation_preference") || "when_relevant";
  const errors: Partial<Record<ProfileField, string>> = {};

  if (!displayName || displayName.length > 80) errors.displayName = "Enter a display name of 80 characters or fewer.";
  if (!roles.has(role)) errors.role = "Choose a teaching role.";
  if (subjectAreas.length < 1 || subjectAreas.length > 5 || subjectAreas.some((value) => !subjects.has(value))) {
    errors.subjectAreas = "Choose between one and five subject areas.";
  }
  if (gradeLevels.length < 1 || gradeLevels.some((value) => !grades.has(value))) {
    errors.gradeLevels = "Choose at least one grade level.";
  }
  if (duration === null || !Number.isInteger(duration) || duration < 10 || duration > 240) {
    errors.typicalClassDurationMinutes = "Enter a class duration between 10 and 240 minutes.";
  }
  if (classSize !== null && (!Number.isInteger(classSize) || classSize < 1 || classSize > 100)) {
    errors.typicalClassSize = "Enter a class size between 1 and 100, or leave it blank.";
  }
  if (materials.length > 20 || materials.some((item) => item.length > 80)) {
    errors.commonMaterials = "Use no more than 20 materials, with 80 characters or fewer per item.";
  }
  if (notes.length > 1000) errors.teachingContextNotes = "Keep teaching-context notes to 1,000 characters or fewer.";
  if (
    !planDetails.has(planDetail) ||
    !transitionCleanup.has(transition) ||
    !lowPrep.has(prep) ||
    !movement.has(movementValue) ||
    !differentiation.has(differentiationValue)
  ) {
    errors.preferences = "Choose valid planning preferences.";
  }

  if (Object.keys(errors).length) throw new ProfileValidationError(errors);

  return {
    displayName,
    role: role as TeacherProfileInput["role"],
    subjectAreas: subjectAreas as TeacherProfileInput["subjectAreas"],
    gradeLevels: gradeLevels as TeacherProfileInput["gradeLevels"],
    typicalClassDurationMinutes: duration as number,
    typicalClassSize: classSize,
    commonMaterials: materials,
    teachingContextNotes: notes || null,
    planDetailPreference: planDetail as TeacherProfileInput["planDetailPreference"],
    transitionCleanupPreference: transition as TeacherProfileInput["transitionCleanupPreference"],
    lowPrepPreference: prep as TeacherProfileInput["lowPrepPreference"],
    movementPreference: movementValue as TeacherProfileInput["movementPreference"],
    differentiationPreference: differentiationValue as TeacherProfileInput["differentiationPreference"],
  };
}
