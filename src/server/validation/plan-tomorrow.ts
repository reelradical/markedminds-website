import "server-only";

import { z } from "zod";

import type {
  PlanTomorrowField,
  PlanTomorrowFormDefaults,
  PlanTomorrowInputSnapshotV1,
  ValueProvenance,
} from "@/lib/planner/plan-contract";
import { gradeLevelOptions } from "@/lib/planner/profile-options";

const accessLevelSchema = z.enum(["unknown", "available", "limited", "none"]);
const valueProvenanceSchema = z.enum(["user", "profile", "system"]);
const shortText = (maximum: number) => z.string().trim().max(maximum);

const planTomorrowInputSchema = z.object({
  workflow: z.literal("plan_tomorrow"),
  topic: shortText(500).min(1),
  subject_area: shortText(80).min(1),
  grade_levels: z.array(z.enum(gradeLevelOptions)).min(1).max(8),
  duration_minutes: z.number().int().min(10).max(240),
  class_size: z.number().int().min(1).max(100).optional(),
  objective: shortText(1000).min(1).optional(),
  available_materials: z.array(shortText(100).min(1)).max(20),
  student_needs: shortText(1500).min(1).optional(),
  constraints: z.object({
    copy_access: accessLevelSchema,
    technology_access: accessLevelSchema,
    prep_time_minutes: z.number().int().min(0).max(120).optional(),
    transition_minutes: z.number().int().min(0).max(30).optional(),
    cleanup_minutes: z.number().int().min(0).max(30).optional(),
    space_constraints: shortText(500).min(1).optional(),
    must_avoid: z.array(shortText(160).min(1)).max(10),
    other: shortText(1000).min(1).optional(),
  }),
  additional_notes: shortText(1500).min(1).optional(),
});

export class PlanTomorrowValidationError extends Error {
  constructor(public readonly fieldErrors: Partial<Record<PlanTomorrowField, string>>) {
    super("Plan Tomorrow input is invalid.");
    this.name = "PlanTomorrowValidationError";
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function list(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function selected(formData: FormData, name: string) {
  return [...new Set(formData.getAll(name).filter((value): value is string => typeof value === "string"))];
}

function optionalInteger(value: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function optionalText(value: string) {
  return value || undefined;
}

function sourceForValue(matchesProfile: boolean, hasValue: boolean): ValueProvenance {
  if (!hasValue) return "system";
  return matchesProfile ? "profile" : "user";
}

export function parsePlanTomorrowForm(
  formData: FormData,
  profileDefaults: PlanTomorrowFormDefaults,
): PlanTomorrowInputSnapshotV1 {
  const topic = text(formData, "topic");
  const subjectArea = text(formData, "subject_area");
  const gradeLevels = selected(formData, "grade_levels");
  const durationMinutes = optionalInteger(text(formData, "duration_minutes"));
  const classSize = optionalInteger(text(formData, "class_size"));
  const objective = optionalText(text(formData, "objective"));
  const availableMaterials = list(text(formData, "available_materials"));
  const studentNeeds = optionalText(text(formData, "student_needs"));
  const copyAccess = text(formData, "copy_access") || "unknown";
  const technologyAccess = text(formData, "technology_access") || "unknown";
  const prepTime = optionalInteger(text(formData, "prep_time_minutes"));
  const transitionTime = optionalInteger(text(formData, "transition_minutes"));
  const cleanupTime = optionalInteger(text(formData, "cleanup_minutes"));
  const spaceConstraints = optionalText(text(formData, "space_constraints"));
  const mustAvoid = list(text(formData, "must_avoid"));
  const otherConstraints = optionalText(text(formData, "other_constraints"));
  const additionalNotes = optionalText(text(formData, "additional_notes"));

  const parsed = planTomorrowInputSchema.safeParse({
    workflow: "plan_tomorrow",
    topic,
    subject_area: subjectArea,
    grade_levels: gradeLevels,
    duration_minutes: durationMinutes,
    class_size: classSize,
    objective,
    available_materials: availableMaterials,
    student_needs: studentNeeds,
    constraints: {
      copy_access: copyAccess,
      technology_access: technologyAccess,
      prep_time_minutes: prepTime,
      transition_minutes: transitionTime,
      cleanup_minutes: cleanupTime,
      space_constraints: spaceConstraints,
      must_avoid: mustAvoid,
      other: otherConstraints,
    },
    additional_notes: additionalNotes,
  });

  if (!parsed.success) {
    const errors: Partial<Record<PlanTomorrowField, string>> = {};
    for (const issue of parsed.error.issues) {
      const root = issue.path[0];
      const field: PlanTomorrowField =
        root === "subject_area" ? "subjectArea" :
          root === "grade_levels" ? "gradeLevels" :
            root === "duration_minutes" ? "durationMinutes" :
              root === "class_size" ? "classSize" :
                root === "available_materials" ? "availableMaterials" :
                  root === "student_needs" ? "studentNeeds" :
                    root === "additional_notes" ? "additionalNotes" :
                      root === "constraints" ? "constraints" :
                        root === "objective" ? "objective" : "topic";
      errors[field] ??= field === "constraints"
        ? "Review the constraint values and limits."
        : "Review this field and its length or value.";
    }
    throw new PlanTomorrowValidationError(errors);
  }

  const input = parsed.data;
  const sameGrades =
    input.grade_levels.length === profileDefaults.gradeLevels.length &&
    input.grade_levels.every((grade) => profileDefaults.gradeLevels.includes(grade));
  const sameMaterials =
    input.available_materials.length === profileDefaults.availableMaterials.length &&
    input.available_materials.every((material) => profileDefaults.availableMaterials.includes(material));

  return {
    input,
    provenance: {
      topic: "user",
      subject_area: sourceForValue(input.subject_area === profileDefaults.subjectArea, true),
      grade_levels: sourceForValue(sameGrades, true),
      duration_minutes: sourceForValue(input.duration_minutes === profileDefaults.durationMinutes, true),
      class_size: sourceForValue(input.class_size === profileDefaults.classSize, input.class_size !== undefined),
      objective: sourceForValue(false, Boolean(input.objective)),
      available_materials: sourceForValue(sameMaterials, input.available_materials.length > 0),
      student_needs: sourceForValue(false, Boolean(input.student_needs)),
      constraints: {
        copy_access: input.constraints.copy_access === "unknown" ? "system" : "user",
        technology_access: input.constraints.technology_access === "unknown" ? "system" : "user",
        prep_time_minutes: sourceForValue(false, input.constraints.prep_time_minutes !== undefined),
        transition_minutes: sourceForValue(false, input.constraints.transition_minutes !== undefined),
        cleanup_minutes: sourceForValue(false, input.constraints.cleanup_minutes !== undefined),
        space_constraints: sourceForValue(false, Boolean(input.constraints.space_constraints)),
        must_avoid: sourceForValue(false, input.constraints.must_avoid.length > 0),
        other: sourceForValue(false, Boolean(input.constraints.other)),
      },
      additional_notes: sourceForValue(false, Boolean(input.additional_notes)),
    },
  };
}

export function parseStoredInputSnapshot(value: unknown) {
  const snapshotSchema = z.object({
    input: planTomorrowInputSchema,
    provenance: z.object({
      topic: valueProvenanceSchema,
      subject_area: valueProvenanceSchema,
      grade_levels: valueProvenanceSchema,
      duration_minutes: valueProvenanceSchema,
      class_size: valueProvenanceSchema,
      objective: valueProvenanceSchema,
      available_materials: valueProvenanceSchema,
      student_needs: valueProvenanceSchema,
      constraints: z.object({
        copy_access: valueProvenanceSchema,
        technology_access: valueProvenanceSchema,
        prep_time_minutes: valueProvenanceSchema,
        transition_minutes: valueProvenanceSchema,
        cleanup_minutes: valueProvenanceSchema,
        space_constraints: valueProvenanceSchema,
        must_avoid: valueProvenanceSchema,
        other: valueProvenanceSchema,
      }).strict(),
      additional_notes: valueProvenanceSchema,
    }).strict(),
  }).strict();
  return snapshotSchema.parse(value) as PlanTomorrowInputSnapshotV1;
}
