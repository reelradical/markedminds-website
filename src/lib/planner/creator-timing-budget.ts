import {
  creatorTeachingApproachValues,
  type CreatorLessonBeatKind,
  type CreatorTeachingApproach,
} from "@/lib/planner/creator-lesson-contract";

export const CREATOR_TIMING_BUDGET_VERSION = "creator_timing_budget.v1";
export const CREATOR_MIN_DURATION_MINUTES = 8;
export const CREATOR_MAX_DURATION_MINUTES = 180;

type TimedBeat = {
  sequence: number;
  kind: CreatorLessonBeatKind;
  duration_minutes: number;
};

export type CreatorTimingBudget = {
  version: typeof CREATOR_TIMING_BUDGET_VERSION;
  requested_total_minutes: number;
  opening_hook_minutes: number;
  lesson_beats: TimedBeat[];
  pause_and_try_minutes: number | null;
  self_check_minutes: number;
  recap_minutes: number;
};

const beatWeights: Record<CreatorLessonBeatKind, number> = {
  explanation: 3,
  demonstration: 5,
  example: 2,
  guided_practice: 4,
  transition: 1,
};

function requiredBeats(approach: CreatorTeachingApproach): CreatorLessonBeatKind[] {
  if (approach === "explanation") return ["explanation", "example"];
  if (approach === "guided_tutorial" || approach === "guided_build_along") {
    return ["explanation", "demonstration", "guided_practice"];
  }
  return ["explanation", "demonstration"];
}

function additionalBeats(approach: CreatorTeachingApproach): CreatorLessonBeatKind[] {
  if (approach === "explanation") return ["example", "explanation", "guided_practice"];
  if (approach === "guided_tutorial" || approach === "guided_build_along") {
    return ["example", "guided_practice", "demonstration"];
  }
  return ["example", "guided_practice", "demonstration"];
}

function pauseIsAppropriate(minutes: number, approach: CreatorTeachingApproach) {
  if (approach === "guided_tutorial" || approach === "guided_build_along") return true;
  if (approach === "explanation") return minutes >= 18;
  return minutes >= 12;
}

function allocateBeatMinutes(total: number, kinds: CreatorLessonBeatKind[]) {
  if (total < kinds.length) throw new RangeError("Creator timing budget has too many beats for its duration.");

  // Give each beat one minute, then distribute the remainder proportionally.
  // Integer remainders keep the allocation stable across runtimes.
  const remainder = total - kinds.length;
  const weightTotal = kinds.reduce((sum, kind) => sum + beatWeights[kind], 0);
  const additions = kinds.map((kind) => Math.floor((remainder * beatWeights[kind]) / weightTotal));
  let minutesLeft = remainder - additions.reduce((sum, value) => sum + value, 0);
  const priority = kinds.map((kind, index) => ({
    index,
    remainder: (remainder * beatWeights[kind]) % weightTotal,
  })).sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (const { index } of priority) {
    if (minutesLeft === 0) break;
    additions[index] += 1;
    minutesLeft -= 1;
  }

  return kinds.map((kind, index) => ({
    sequence: index + 1,
    kind,
    duration_minutes: 1 + additions[index],
  }));
}

export function creatorTimingBudgetTotal(budget: CreatorTimingBudget) {
  return budget.opening_hook_minutes
    + budget.lesson_beats.reduce((sum, beat) => sum + beat.duration_minutes, 0)
    + (budget.pause_and_try_minutes ?? 0)
    + budget.self_check_minutes
    + budget.recap_minutes;
}

export function buildCreatorTimingBudget({
  requestedMinutes,
  teachingApproach,
}: {
  requestedMinutes: number;
  teachingApproach: CreatorTeachingApproach;
}): CreatorTimingBudget {
  if (
    !Number.isInteger(requestedMinutes)
    || requestedMinutes < CREATOR_MIN_DURATION_MINUTES
    || requestedMinutes > CREATOR_MAX_DURATION_MINUTES
    || !creatorTeachingApproachValues.includes(teachingApproach)
  ) {
    throw new RangeError("Creator duration or teaching approach is outside the supported range.");
  }

  const opening = requestedMinutes >= 16 ? 2 : 1;
  const selfCheck = requestedMinutes >= 25 ? 3 : requestedMinutes >= 16 ? 2 : 1;
  const recap = requestedMinutes >= 25 ? 3 : requestedMinutes >= 9 ? 2 : 1;
  const pause = pauseIsAppropriate(requestedMinutes, teachingApproach)
    ? requestedMinutes >= 25 ? 3 : requestedMinutes >= 16 ? 2 : 1
    : null;

  const kinds = requiredBeats(teachingApproach);
  const additionalCount = Math.min(
    20 - kinds.length,
    (requestedMinutes >= 18 ? 1 : 0)
      + (requestedMinutes >= 25 ? 1 : 0)
      + Math.floor(Math.max(0, requestedMinutes - 25) / 8),
  );
  const extraKinds = additionalBeats(teachingApproach);
  for (let index = 0; index < additionalCount; index += 1) {
    kinds.push(extraKinds[index % extraKinds.length]);
  }

  const beatMinutes = requestedMinutes - opening - selfCheck - recap - (pause ?? 0);
  const budget: CreatorTimingBudget = {
    version: CREATOR_TIMING_BUDGET_VERSION,
    requested_total_minutes: requestedMinutes,
    opening_hook_minutes: opening,
    lesson_beats: allocateBeatMinutes(beatMinutes, kinds),
    pause_and_try_minutes: pause,
    self_check_minutes: selfCheck,
    recap_minutes: recap,
  };

  if (creatorTimingBudgetTotal(budget) !== requestedMinutes) {
    throw new RangeError("Creator timing budget does not match the requested duration.");
  }
  return budget;
}
