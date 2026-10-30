import "server-only";

import {
  rotationPlanGrades,
  type RotationPlanFormDefaults,
  type RotationPlanGrade,
} from "@/lib/planner/rotation-plan-contract";
import type { CurrentProfileBundle } from "@/server/dal/profiles";

export function rotationPlanDefaultsFromProfile(
  bundle: CurrentProfileBundle & { profile: NonNullable<CurrentProfileBundle["profile"]>; teacherProfile: NonNullable<CurrentProfileBundle["teacherProfile"]> },
): RotationPlanFormDefaults {
  const profileGrades = bundle.teacherProfile.gradeLevels.filter(
    (grade): grade is RotationPlanGrade => rotationPlanGrades.some((supported) => supported === grade),
  );

  return {
    teacher: bundle.profile.displayName ?? "",
    content: bundle.teacherProfile.subjectAreas.length === 1
      ? bundle.teacherProfile.subjectAreas[0].replaceAll("_", " ")
      : "Visual Art",
    grades: profileGrades.length ? profileGrades : [...rotationPlanGrades],
    durationMinutes: bundle.teacherProfile.typicalClassDurationMinutes,
    classSize: bundle.teacherProfile.typicalClassSize,
    availableMaterials: bundle.teacherProfile.commonMaterials,
  };
}
