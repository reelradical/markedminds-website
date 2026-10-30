import { z } from "zod";

import {
  rotationPlanGrades,
  rotationPlanPhases,
  rotationPlanRequiredFields,
  type RotationPlanGradeCompleteness,
  type RotationPlanInputSnapshotV1,
  type RotationPlanOutputV1,
} from "@/lib/planner/rotation-plan-contract";

const boundedText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalProviderText = (maximum: number) => boundedText(maximum).nullable();
const gradeSchema = z.enum(rotationPlanGrades);
const phaseSchema = z.enum(rotationPlanPhases);

const providerGradePlanSchema = z.object({
  grade: gradeSchema,
  standards: z.array(boundedText(500)).max(20),
  learning_targets: z.array(boundedText(500)).min(1).max(12),
  success_criteria: z.array(boundedText(500)).min(1).max(12),
  instructional_resources_materials: z.array(boundedText(500)).min(1).max(30),
  academic_vocabulary: z.array(boundedText(160)).min(1).max(30),
  differentiation: z.array(boundedText(1000)).min(1).max(20),
  assessment_strategies: z.array(boundedText(1000)).min(1).max(20),
  writing_strategies: z.array(boundedText(1000)).min(1).max(12),
  phases: z.array(z.object({
    phase: phaseSchema,
    duration_minutes: z.number().int().min(1).max(240),
    teacher_actions: z.array(boundedText(1500)).min(1).max(12),
    student_actions: z.array(boundedText(1500)).min(1).max(12),
    transition_or_cleanup: optionalProviderText(1000),
  }).strict()).length(rotationPlanPhases.length),
}).strict();

export const providerRotationPlanOutputSchema = z.object({
  title: boundedText(160),
  shared_rotation_concept: boundedText(1200),
  header: z.object({
    school: boundedText(200),
    teacher: boundedText(200),
    content: boundedText(200),
    rotation_date_range: boundedText(200),
  }).strict(),
  grade_plans: z.array(providerGradePlanSchema).min(1).max(rotationPlanGrades.length),
}).strict();

const canonicalRotationPlanOutputSchema: z.ZodType<RotationPlanOutputV1> = z.object({
  title: boundedText(160),
  shared_rotation_concept: boundedText(1200),
  header: z.object({
    school: boundedText(200),
    teacher: boundedText(200),
    content: boundedText(200),
    rotation_date_range: boundedText(200),
  }).strict(),
  grade_plans: z.array(z.object({
    grade: gradeSchema,
    standards: z.array(boundedText(500)).max(20),
    learning_targets: z.array(boundedText(500)).min(1).max(12),
    success_criteria: z.array(boundedText(500)).min(1).max(12),
    instructional_resources_materials: z.array(boundedText(500)).min(1).max(30),
    academic_vocabulary: z.array(boundedText(160)).min(1).max(30),
    differentiation: z.array(boundedText(1000)).min(1).max(20),
    assessment_strategies: z.array(boundedText(1000)).min(1).max(20),
    writing_strategies: z.array(boundedText(1000)).min(1).max(12),
    phases: z.array(z.object({
      phase: phaseSchema,
      duration_minutes: z.number().int().min(1).max(240),
      teacher_actions: z.array(boundedText(1500)).min(1).max(12),
      student_actions: z.array(boundedText(1500)).min(1).max(12),
      transition_or_cleanup: boundedText(1000).optional(),
    }).strict()).length(rotationPlanPhases.length),
  }).strict()).min(1).max(rotationPlanGrades.length),
}).strict();

function sameStringList(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export class RotationPlanOutputValidationError extends Error {
  constructor(public readonly reasons: string[]) {
    super("The rotation plan output does not satisfy its template contract.");
    this.name = "RotationPlanOutputValidationError";
  }
}

export function normalizeProviderRotationPlanOutput(
  value: z.infer<typeof providerRotationPlanOutputSchema>,
): RotationPlanOutputV1 {
  return canonicalRotationPlanOutputSchema.parse({
    ...value,
    grade_plans: value.grade_plans.map((gradePlan) => ({
      ...gradePlan,
      phases: gradePlan.phases.map((phase) => ({
        ...phase,
        transition_or_cleanup: phase.transition_or_cleanup ?? undefined,
      })),
    })),
  });
}

export function validateRotationPlanAgainstInput(
  output: RotationPlanOutputV1,
  snapshot: RotationPlanInputSnapshotV1,
) {
  const reasons: string[] = [];
  const input = snapshot.input;

  if (
    output.header.school !== input.school
    || output.header.teacher !== input.teacher
    || output.header.content !== input.content
    || output.header.rotation_date_range !== input.rotation_date_range
  ) {
    reasons.push("Header values must match the teacher request exactly.");
  }

  const outputGrades = output.grade_plans.map((gradePlan) => gradePlan.grade);
  if (!sameStringList(outputGrades, input.grades)) {
    reasons.push("Output grades must match the selected grades in order.");
  }

  const contentFingerprints = new Set<string>();
  for (const grade of input.grades) {
    const gradePlan = output.grade_plans.find((candidate) => candidate.grade === grade);
    if (!gradePlan) continue;

    const suppliedStandards = input.standards_by_grade[grade] ?? [];
    if (!sameStringList(gradePlan.standards, suppliedStandards)) {
      reasons.push(`Grade ${grade} standards must reproduce teacher-supplied standards exactly.`);
    }

    const phases = gradePlan.phases.map((phase) => phase.phase);
    if (!sameStringList(phases, [...rotationPlanPhases])) {
      reasons.push(`Grade ${grade} must use the required lesson phases in order.`);
    }

    const totalMinutes = gradePlan.phases.reduce((total, phase) => total + phase.duration_minutes, 0);
    if (totalMinutes !== input.duration_minutes) {
      reasons.push(`Grade ${grade} phase timing must total ${input.duration_minutes} minutes.`);
    }

    const fingerprint = JSON.stringify({
      learning_targets: gradePlan.learning_targets,
      success_criteria: gradePlan.success_criteria,
      instructional_resources_materials: gradePlan.instructional_resources_materials,
      academic_vocabulary: gradePlan.academic_vocabulary,
      differentiation: gradePlan.differentiation,
      assessment_strategies: gradePlan.assessment_strategies,
      writing_strategies: gradePlan.writing_strategies,
      phases: gradePlan.phases,
    });
    if (contentFingerprints.has(fingerprint)) {
      reasons.push("Grade-level plans must be developmentally distinct rather than cloned.");
    }
    contentFingerprints.add(fingerprint);
  }

  if (reasons.length) throw new RotationPlanOutputValidationError(reasons);
  return output;
}

const completenessLabels: Record<(typeof rotationPlanRequiredFields)[number], string> = {
  standards: "Standards",
  learning_targets: "Learning targets",
  success_criteria: "Success criteria",
  instructional_resources_materials: "Materials",
  academic_vocabulary: "Vocabulary",
  differentiation: "Differentiation",
  assessment_strategies: "Assessment",
  writing_strategies: "Writing strategy",
  engage: "Engage",
  focus: "Focus",
  explore_apply: "Explore and Apply",
  reflect: "Reflect",
};

export function rotationPlanCompleteness(output: RotationPlanOutputV1): RotationPlanGradeCompleteness[] {
  return output.grade_plans.map((gradePlan) => {
    const phaseMap = new Map(gradePlan.phases.map((phase) => [phase.phase, phase]));
    const values = {
      standards: gradePlan.standards,
      learning_targets: gradePlan.learning_targets,
      success_criteria: gradePlan.success_criteria,
      instructional_resources_materials: gradePlan.instructional_resources_materials,
      academic_vocabulary: gradePlan.academic_vocabulary,
      differentiation: gradePlan.differentiation,
      assessment_strategies: gradePlan.assessment_strategies,
      writing_strategies: gradePlan.writing_strategies,
      engage: phaseMap.get("engage")?.teacher_actions ?? [],
      focus: phaseMap.get("focus")?.teacher_actions ?? [],
      explore_apply: phaseMap.get("explore_apply")?.teacher_actions ?? [],
      reflect: phaseMap.get("reflect")?.teacher_actions ?? [],
    };
    const items = rotationPlanRequiredFields.map((field) => ({
      field,
      label: completenessLabels[field],
      complete: values[field].length > 0,
    }));
    return { grade: gradePlan.grade, complete: items.every((item) => item.complete), items };
  });
}

export function isRotationPlanExportable(output: RotationPlanOutputV1) {
  const completeness = rotationPlanCompleteness(output);
  return completeness.length > 0 && completeness.every((grade) => grade.complete);
}

export function parseStoredRotationPlanOutput(value: unknown) {
  return canonicalRotationPlanOutputSchema.parse(value);
}

export function rotationPlanOutputText(output: RotationPlanOutputV1) {
  return [
    output.title,
    output.shared_rotation_concept,
    output.header.school,
    output.header.teacher,
    output.header.content,
    output.header.rotation_date_range,
    ...output.grade_plans.flatMap((gradePlan) => [
      ...gradePlan.standards,
      ...gradePlan.learning_targets,
      ...gradePlan.success_criteria,
      ...gradePlan.instructional_resources_materials,
      ...gradePlan.academic_vocabulary,
      ...gradePlan.differentiation,
      ...gradePlan.assessment_strategies,
      ...gradePlan.writing_strategies,
      ...gradePlan.phases.flatMap((phase) => [
        ...phase.teacher_actions,
        ...phase.student_actions,
        phase.transition_or_cleanup,
      ]),
    ]),
  ].filter((value): value is string => Boolean(value));
}
