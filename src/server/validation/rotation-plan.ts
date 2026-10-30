import "server-only";

import { z } from "zod";

import type { ValueProvenance } from "@/lib/planner/plan-contract";
import {
  ROTATION_PLAN_TEMPLATE_VERSION,
  initialRotationPlanActionState,
  rotationPlanGrades,
  rotationPlanTemplateV1,
  type RotationPlanActionState,
  type RotationPlanField,
  type RotationPlanFormDefaults,
  type RotationPlanInputSnapshotV1,
} from "@/lib/planner/rotation-plan-contract";

const accessLevelSchema = z.enum(["unknown", "available", "limited", "none"]);
const valueProvenanceSchema = z.enum(["user", "profile", "system"]);
const shortText = (maximum: number) => z.string().trim().max(maximum);

const standardsByGradeSchema = z.object({
  K: z.array(shortText(500).min(1)).max(20).optional(),
  "1": z.array(shortText(500).min(1)).max(20).optional(),
  "2": z.array(shortText(500).min(1)).max(20).optional(),
  "3": z.array(shortText(500).min(1)).max(20).optional(),
  "4": z.array(shortText(500).min(1)).max(20).optional(),
  "5": z.array(shortText(500).min(1)).max(20).optional(),
}).strict();

const rotationPlanInputSchema = z.object({
  workflow: z.literal("rotation_plan_template"),
  template_version: z.literal(ROTATION_PLAN_TEMPLATE_VERSION),
  school: shortText(200).min(1),
  teacher: shortText(200).min(1),
  content: shortText(200).min(1),
  rotation_date_range: shortText(200).min(1),
  grades: z.array(z.enum(rotationPlanGrades)).min(1).max(rotationPlanGrades.length),
  topic_unit_concept: shortText(1000).min(1),
  shared_objective: shortText(1500).min(1).optional(),
  standards_by_grade: standardsByGradeSchema,
  available_materials: z.array(shortText(200).min(1)).max(30),
  aggregate_learner_needs: shortText(1500).min(1).optional(),
  duration_minutes: z.number().int().min(20).max(120),
  class_size: z.number().int().min(1).max(100).optional(),
  constraints: z.object({
    copy_access: accessLevelSchema,
    technology_access: accessLevelSchema,
    prep_time_minutes: z.number().int().min(0).max(120).optional(),
    transition_minutes: z.number().int().min(0).max(30).optional(),
    cleanup_minutes: z.number().int().min(0).max(30).optional(),
    space_constraints: shortText(500).min(1).optional(),
    must_avoid: z.array(shortText(160).min(1)).max(10),
    other: shortText(1000).min(1).optional(),
  }).strict(),
  additional_notes: shortText(1500).min(1).optional(),
  references: z.object({
    compliance_template: z.object({
      template_id: z.literal(rotationPlanTemplateV1.id),
      template_version: z.literal(ROTATION_PLAN_TEMPLATE_VERSION),
    }).strict(),
    instructional_references: z.tuple([]),
    teacher_created_sources: z.tuple([]),
  }).strict(),
}).strict();

export class RotationPlanValidationError extends Error {
  constructor(public readonly fieldErrors: Partial<Record<RotationPlanField, string>>) {
    super("Rotation plan input is invalid.");
    this.name = "RotationPlanValidationError";
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function list(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function lines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function selectedGrades(formData: FormData) {
  const selected = new Set(formData.getAll("grades").filter((value): value is string => typeof value === "string"));
  return rotationPlanGrades.filter((grade) => selected.has(grade));
}

function optionalInteger(value: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function optionalText(value: string) {
  return value || undefined;
}

function source(matchesProfile: boolean, hasValue: boolean): ValueProvenance {
  if (!hasValue) return "system";
  return matchesProfile ? "profile" : "user";
}

function mapIssueToField(root: PropertyKey | undefined): RotationPlanField {
  if (root === "rotation_date_range") return "rotationDateRange";
  if (root === "topic_unit_concept") return "topicUnitConcept";
  if (root === "shared_objective") return "sharedObjective";
  if (root === "standards_by_grade") return "standards";
  if (root === "available_materials") return "availableMaterials";
  if (root === "aggregate_learner_needs") return "aggregateLearnerNeeds";
  if (root === "duration_minutes") return "durationMinutes";
  if (root === "class_size") return "classSize";
  if (root === "constraints") return "constraints";
  if (root === "additional_notes") return "additionalNotes";
  if (root === "grades") return "grades";
  if (root === "teacher") return "teacher";
  if (root === "content") return "content";
  return "school";
}

export function parseRotationPlanForm(
  formData: FormData,
  defaults: RotationPlanFormDefaults,
): RotationPlanInputSnapshotV1 {
  const grades = selectedGrades(formData);
  const standardsByGrade = Object.fromEntries(
    grades.flatMap((grade) => {
      const standards = lines(text(formData, `standards_${grade}`));
      return standards.length ? [[grade, standards]] : [];
    }),
  );
  const availableMaterials = list(text(formData, "available_materials"));
  const parsed = rotationPlanInputSchema.safeParse({
    workflow: "rotation_plan_template",
    template_version: ROTATION_PLAN_TEMPLATE_VERSION,
    school: text(formData, "school"),
    teacher: text(formData, "teacher"),
    content: text(formData, "content"),
    rotation_date_range: text(formData, "rotation_date_range"),
    grades,
    topic_unit_concept: text(formData, "topic_unit_concept"),
    shared_objective: optionalText(text(formData, "shared_objective")),
    standards_by_grade: standardsByGrade,
    available_materials: availableMaterials,
    aggregate_learner_needs: optionalText(text(formData, "aggregate_learner_needs")),
    duration_minutes: optionalInteger(text(formData, "duration_minutes")),
    class_size: optionalInteger(text(formData, "class_size")),
    constraints: {
      copy_access: text(formData, "copy_access") || "unknown",
      technology_access: text(formData, "technology_access") || "unknown",
      prep_time_minutes: optionalInteger(text(formData, "prep_time_minutes")),
      transition_minutes: optionalInteger(text(formData, "transition_minutes")),
      cleanup_minutes: optionalInteger(text(formData, "cleanup_minutes")),
      space_constraints: optionalText(text(formData, "space_constraints")),
      must_avoid: list(text(formData, "must_avoid")),
      other: optionalText(text(formData, "other_constraints")),
    },
    additional_notes: optionalText(text(formData, "additional_notes")),
    references: {
      compliance_template: {
        template_id: rotationPlanTemplateV1.id,
        template_version: ROTATION_PLAN_TEMPLATE_VERSION,
      },
      instructional_references: [],
      teacher_created_sources: [],
    },
  });

  if (!parsed.success) {
    const fieldErrors: RotationPlanActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = mapIssueToField(issue.path[0]);
      fieldErrors[field] ??= "Review this field and its length or value.";
    }
    throw new RotationPlanValidationError(fieldErrors);
  }

  const input = parsed.data;
  const sameGrades = input.grades.length === defaults.grades.length
    && input.grades.every((grade) => defaults.grades.includes(grade));
  const sameMaterials = input.available_materials.length === defaults.availableMaterials.length
    && input.available_materials.every((material) => defaults.availableMaterials.includes(material));

  return {
    input,
    provenance: {
      school: "user",
      teacher: source(input.teacher === defaults.teacher, true),
      content: source(input.content === defaults.content, true),
      rotation_date_range: "user",
      grades: source(sameGrades, true),
      topic_unit_concept: "user",
      shared_objective: source(false, Boolean(input.shared_objective)),
      standards_by_grade: source(false, Object.keys(input.standards_by_grade).length > 0),
      available_materials: source(sameMaterials, input.available_materials.length > 0),
      aggregate_learner_needs: source(false, Boolean(input.aggregate_learner_needs)),
      duration_minutes: source(input.duration_minutes === defaults.durationMinutes, true),
      class_size: source(input.class_size === defaults.classSize, input.class_size !== undefined),
      constraints: "user",
      additional_notes: source(false, Boolean(input.additional_notes)),
      references: "system",
    },
  };
}

export function parseStoredRotationPlanInput(value: unknown) {
  const snapshotSchema = z.object({
    input: rotationPlanInputSchema,
    provenance: z.object({
      school: valueProvenanceSchema,
      teacher: valueProvenanceSchema,
      content: valueProvenanceSchema,
      rotation_date_range: valueProvenanceSchema,
      grades: valueProvenanceSchema,
      topic_unit_concept: valueProvenanceSchema,
      shared_objective: valueProvenanceSchema,
      standards_by_grade: valueProvenanceSchema,
      available_materials: valueProvenanceSchema,
      aggregate_learner_needs: valueProvenanceSchema,
      duration_minutes: valueProvenanceSchema,
      class_size: valueProvenanceSchema,
      constraints: valueProvenanceSchema,
      additional_notes: valueProvenanceSchema,
      references: z.literal("system"),
    }).strict(),
  }).strict();
  return snapshotSchema.parse(value) as RotationPlanInputSnapshotV1;
}

export { initialRotationPlanActionState };
