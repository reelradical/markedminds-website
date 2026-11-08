import type {
  CreatorLessonInputSnapshotV1,
  CreatorLessonOutputV1,
} from "@/lib/planner/creator-lesson-contract";
import { creatorTeachingApproachValues } from "@/lib/planner/creator-lesson-contract";
import {
  CreatorLessonOutputValidationError,
  assembleProviderCreatorLessonOutput,
  creatorLessonDuration,
  providerCreatorLessonContentSchema,
  validateCreatorLessonAgainstInput,
} from "@/lib/planner/creator-lesson-schema";
import {
  buildCreatorTimingBudget,
  creatorTimingBudgetTotal,
  CREATOR_MAX_DURATION_MINUTES,
  CREATOR_MIN_DURATION_MINUTES,
  type CreatorTimingBudget,
} from "@/lib/planner/creator-timing-budget";
import {
  buildCreatorLessonPrompt,
  buildCreatorRevisionPrompt,
} from "@/server/planning/prompts/creator-lesson-v1";

function snapshot({
  priorKnowledge,
  durationMinutes,
}: {
  priorKnowledge: string;
  durationMinutes: number;
}): CreatorLessonInputSnapshotV1 {
  return {
    input: {
      workflow: "creator_lesson",
      planning_context: "adult_creator",
      subject: "Practical generative AI",
      topic_or_working_title: "Build and evaluate a reusable prompt",
      audience: "Independent consultants who want reliable AI-assisted drafting without becoming prompt engineers.",
      prior_knowledge: priorKnowledge,
      learner_goal: "Produce more reliable first drafts and recognize when an output needs revision.",
      learning_outcome: "Build and evaluate a reusable prompt using context, constraints, and a clear success check.",
      duration_minutes: durationMinutes,
      teaching_approach: "explanation_and_demonstration",
      delivery_format: "youtube_asynchronous",
      source_notes: "Use a three-part prompt structure: context, constraints, and success check.",
      tools_version_context: "Generic AI chat interface; verify current interface labels before recording.",
      materials_resources: ["Sample client brief", "Before-and-after prompt example"],
    },
    provenance: {
      planning_context: "system",
      subject: "user",
      topic_or_working_title: "user",
      audience: "user",
      prior_knowledge: "user",
      learner_goal: "user",
      learning_outcome: "user",
      duration_minutes: "user",
      teaching_approach: "user",
      delivery_format: "system",
      source_notes: "user",
      tools_version_context: "user",
      materials_resources: "user",
      additional_notes: "system",
    },
  };
}

function fixtureOutput(
  input: CreatorLessonInputSnapshotV1,
  depth: "beginner" | "experienced",
): CreatorLessonOutputV1 {
  const duration = input.input.duration_minutes;
  const opening = duration >= 20 ? 2 : 1;
  const pause = duration >= 15 ? 2 : 1;
  const selfCheck = 1;
  const recap = duration >= 12 ? 2 : 1;
  const availableForBeats = duration - opening - pause - selfCheck - recap;
  const first = Math.max(1, Math.floor(availableForBeats * 0.28));
  const second = Math.max(1, Math.floor(availableForBeats * 0.42));
  const third = availableForBeats - first - second;

  return {
    title: depth === "beginner" ? "A Reliable Prompt You Can Reuse" : "Prompt Reliability: Tradeoffs and Evaluation",
    learning_outcome: input.input.learning_outcome,
    prerequisites: depth === "beginner"
      ? ["Can open and use a basic AI chat interface."]
      : ["Already writes multi-part prompts and can compare two model responses."],
    materials_tools: [
      { item: "Sample client brief", purpose: "Provides one stable task for the demonstration.", required: true },
      { item: "Before-and-after prompt", purpose: "Makes the effect of each prompt part visible.", required: true },
    ],
    opening_hook: {
      duration_minutes: opening,
      teaching_move: depth === "beginner"
        ? "Show an unreliable one-line request and name the frustration of rewriting the result."
        : "Compare two plausible outputs and ask which evaluation criterion exposes the more useful draft.",
      learner_need_connection: "The viewer wants a repeatable way to improve first drafts without relying on lucky wording.",
    },
    lesson_beats: [
      {
        sequence: 1,
        kind: "explanation",
        title: depth === "beginner" ? "Build the three-part mental model" : "Define the evaluation boundary",
        duration_minutes: first,
        educator_action: depth === "beginner"
          ? "Explain context, constraints, and success check in plain language with one sentence for each."
          : "Distinguish task context, hard constraints, and evaluation criteria, including where criteria conflict.",
        learner_action: depth === "beginner" ? "Identify each part in a color-coded example." : "Predict which constraint will create the strongest tradeoff.",
        learning_purpose: depth === "beginner" ? "Establish a low-assumption prompt structure." : "Make prompt quality testable rather than stylistic.",
      },
      {
        sequence: 2,
        kind: "demonstration",
        title: "Build and test the prompt",
        duration_minutes: second,
        educator_action: depth === "beginner"
          ? "Add one prompt part at a time and point out the visible change in the response."
          : "Run the same brief through two constraint sets and compare failure modes against the rubric.",
        learner_action: "Notice which change improves the output and which introduces a new limitation.",
        learning_purpose: "Reveal the decisions behind the workflow rather than presenting clicks as instruction.",
      },
      {
        sequence: 3,
        kind: "example",
        title: depth === "beginner" ? "Diagnose one weak result" : "Handle an edge case",
        duration_minutes: third,
        educator_action: depth === "beginner"
          ? "Use the success check to name one mismatch and revise one prompt line."
          : "Show how an over-constrained prompt can pass the rubric while producing a less useful result, then revise the criterion.",
        learner_action: depth === "beginner" ? "Choose the prompt part that needs revision." : "Decide which tradeoff to preserve and justify it.",
        learning_purpose: depth === "beginner" ? "Practice a simple diagnostic move." : "Apply judgment where rules conflict.",
      },
    ],
    likely_confusions: [{
      misconception_or_confusion: "A longer prompt is automatically a better prompt.",
      response: "Keep only context and constraints that change the result, then use the success check to evaluate usefulness.",
    }],
    pause_and_try: {
      duration_minutes: pause,
      activity: "Pause and rewrite one real request using context, constraints, and a success check.",
      success_signal: "The revised prompt makes the intended output and the way to judge it explicit.",
    },
    self_check: {
      duration_minutes: selfCheck,
      prompt: "Can you point to the context, constraints, and success check in your prompt and explain what each changes?",
      look_for: "All three parts are identifiable and the success check can be used on the resulting output.",
    },
    recap: {
      duration_minutes: recap,
      key_points: ["Context frames the task.", "Constraints protect what matters.", "A success check makes revision possible."],
    },
    next_learning_step: "Test the structure on a second task and revise the success check when the output passes technically but is not useful.",
    recording_preparation_notes: {
      must_prepare: ["Use one de-identified sample brief and capture a stable before-and-after example."],
      optional_preparation: ["Add a simple three-part visual label for the prompt."],
      filming_notes: ["Verify interface labels and remove account or client details before screen recording."],
    },
    claims_resources_to_verify: [{
      claim_or_resource: "Current AI chat interface labels shown in the demonstration.",
      reason: "version_sensitive",
      verification_action: "Open the recording account immediately before filming and confirm every visible label and control.",
    }],
  };
}

export const creatorLessonGoldenFixtures = {
  beginner: {
    input: snapshot({
      priorKnowledge: "Has used an AI chat interface once or twice and can write a one-sentence request.",
      durationMinutes: 12,
    }),
  },
  experienced: {
    input: snapshot({
      priorKnowledge: "Uses several AI tools weekly, already writes multi-part prompts, and wants stronger evaluation criteria and edge-case handling.",
      durationMinutes: 18,
    }),
  },
  short: {
    input: snapshot({
      priorKnowledge: "Has used an AI chat interface once or twice and can write a one-sentence request.",
      durationMinutes: 8,
    }),
  },
  extended: {
    input: snapshot({
      priorKnowledge: "Has used an AI chat interface once or twice and can write a one-sentence request.",
      durationMinutes: 25,
    }),
  },
} as const;

function expectDurationRejection(
  output: CreatorLessonOutputV1,
  input: CreatorLessonInputSnapshotV1,
) {
  try {
    validateCreatorLessonAgainstInput(output, input);
  } catch (error) {
    if (
      error instanceof CreatorLessonOutputValidationError
      && error.reasons.some((reason) => reason.includes("Lesson timing must total exactly"))
    ) return;
    throw error;
  }
  throw new Error("Creator duration validation accepted a mismatched total.");
}

function validateTimingPrompt(input: CreatorLessonInputSnapshotV1) {
  const requestedMinutes = input.input.duration_minutes;
  const budget = buildCreatorTimingBudget({
    requestedMinutes,
    teachingApproach: input.input.teaching_approach,
  });
  const prompt = buildCreatorLessonPrompt(input, budget);
  const payload = JSON.parse(prompt.input) as {
    fixed_timing_budget?: CreatorTimingBudget;
  };
  if (!prompt.instructions.includes(`FIXED LESSON SLOTS — ${requestedMinutes} minutes total`)) {
    throw new Error("Creator prompt omitted its assigned total.");
  }
  if (JSON.stringify(payload.fixed_timing_budget) !== JSON.stringify(budget)) {
    throw new Error("Creator prompt changed or omitted an assigned timing slot.");
  }

  const sourceOutput = fixtureOutput(input, "beginner");
  const revision = buildCreatorRevisionPrompt(input, sourceOutput, { intent: "improve_pacing" }, budget);
  const revisionPayload = JSON.parse(revision.input) as { fixed_timing_budget?: CreatorTimingBudget };
  if (JSON.stringify(revisionPayload.fixed_timing_budget) !== JSON.stringify(budget)) {
    throw new Error("Creator revision prompt changed or omitted an assigned timing slot.");
  }
}

function validateTimingBudgetFixtures() {
  let cases = 0;
  for (const teachingApproach of creatorTeachingApproachValues) {
    for (let requestedMinutes = CREATOR_MIN_DURATION_MINUTES; requestedMinutes <= CREATOR_MAX_DURATION_MINUTES; requestedMinutes += 1) {
      const budget = buildCreatorTimingBudget({ requestedMinutes, teachingApproach });
      const allMinutes = [
        budget.opening_hook_minutes,
        ...budget.lesson_beats.map((beat) => beat.duration_minutes),
        budget.self_check_minutes,
        budget.recap_minutes,
        ...(budget.pause_and_try_minutes === null ? [] : [budget.pause_and_try_minutes]),
      ];
      if (creatorTimingBudgetTotal(budget) !== requestedMinutes || allMinutes.some((minutes) => minutes < 1)) {
        throw new Error(`Invalid Creator timing budget for ${teachingApproach} at ${requestedMinutes} minutes.`);
      }
      if (budget.lesson_beats.length > 20 || budget.lesson_beats.some((beat, index) => beat.sequence !== index + 1)) {
        throw new Error("Creator timing budget contains too many or unordered lesson beats.");
      }
      if (
        (teachingApproach === "guided_tutorial" || teachingApproach === "guided_build_along")
        && (budget.pause_and_try_minutes === null || !budget.lesson_beats.some((beat) => beat.kind === "guided_practice"))
      ) {
        throw new Error("Guided Creator budget omitted practice.");
      }
      cases += 1;
    }
  }

  const expectedExamples = [
    { minutes: 8, parts: [1, 2, 3, null, 1, 1] },
    { minutes: 12, parts: [1, 3, 4, 1, 1, 2] },
    { minutes: 18, parts: [2, 3, 5, 2, 2, 2, 2] },
    { minutes: 25, parts: [2, 3, 5, 2, 4, 3, 3, 3] },
  ];
  for (const example of expectedExamples) {
    const budget = buildCreatorTimingBudget({
      requestedMinutes: example.minutes,
      teachingApproach: "explanation_and_demonstration",
    });
    const parts = [
      budget.opening_hook_minutes,
      ...budget.lesson_beats.map((beat) => beat.duration_minutes),
      budget.pause_and_try_minutes,
      budget.self_check_minutes,
      budget.recap_minutes,
    ];
    if (JSON.stringify(parts) !== JSON.stringify(example.parts)) {
      throw new Error(`Creator ${example.minutes}-minute allocation changed unexpectedly.`);
    }
  }

  const short = buildCreatorTimingBudget({ requestedMinutes: 8, teachingApproach: "guided_tutorial" });
  const long = buildCreatorTimingBudget({ requestedMinutes: 25, teachingApproach: "guided_tutorial" });
  if (short.lesson_beats.length >= long.lesson_beats.length || short.pause_and_try_minutes === null) {
    throw new Error("Creator short lessons did not reduce scope or guided practice disappeared.");
  }
  return cases;
}

function validateProviderAssembly(input: CreatorLessonInputSnapshotV1) {
  const budget = buildCreatorTimingBudget({
    requestedMinutes: input.input.duration_minutes,
    teachingApproach: input.input.teaching_approach,
  });
  const source = fixtureOutput(input, "beginner");
  const content = {
    title: source.title,
    learning_outcome: source.learning_outcome,
    prerequisites: source.prerequisites,
    materials_tools: source.materials_tools.map((item) => ({ ...item, purpose: item.purpose ?? null })),
    opening_hook: {
      teaching_move: source.opening_hook.teaching_move,
      learner_need_connection: source.opening_hook.learner_need_connection,
    },
    lesson_beats: budget.lesson_beats.map((beat, index) => {
      const example = source.lesson_beats[index % source.lesson_beats.length];
      return {
        title: `${example.title} ${beat.sequence}`,
        educator_action: example.educator_action,
        learner_action: example.learner_action,
        learning_purpose: example.learning_purpose,
      };
    }),
    likely_confusions: source.likely_confusions,
    pause_and_try: budget.pause_and_try_minutes === null ? null : {
      activity: source.pause_and_try!.activity,
      success_signal: source.pause_and_try!.success_signal,
    },
    self_check: { prompt: source.self_check.prompt, look_for: source.self_check.look_for },
    recap: { key_points: source.recap.key_points },
    next_learning_step: source.next_learning_step,
    recording_preparation_notes: source.recording_preparation_notes,
    claims_resources_to_verify: source.claims_resources_to_verify,
  };
  const providerSchema = providerCreatorLessonContentSchema(budget.lesson_beats.length);
  const parsed = providerSchema.parse(content);
  const assembled = assembleProviderCreatorLessonOutput(parsed, budget);
  validateCreatorLessonAgainstInput(assembled, input);

  if (assembled.lesson_beats.some((beat, index) => beat.duration_minutes !== budget.lesson_beats[index].duration_minutes)) {
    throw new Error("Creator assembly changed an assigned lesson-beat duration.");
  }
  if (providerSchema.safeParse({ ...content, lesson_beats: content.lesson_beats.slice(1) }).success) {
    throw new Error("Creator provider schema accepted a missing beat.");
  }
  if (providerSchema.safeParse({ ...content, opening_hook: { ...content.opening_hook, duration_minutes: 99 } }).success) {
    throw new Error("Creator provider schema accepted a model-chosen duration.");
  }
  if (budget.pause_and_try_minutes === null) {
    try {
      assembleProviderCreatorLessonOutput({ ...parsed, pause_and_try: {
        activity: "Unexpected activity",
        success_signal: "Unexpected success signal",
      } }, budget);
    } catch (error) {
      if (error instanceof CreatorLessonOutputValidationError) return;
      throw error;
    }
    throw new Error("Creator assembly accepted an unbudgeted pause-and-try activity.");
  }
}

export function validateCreatorLessonGoldenFixtures() {
  const timingBudgetCases = validateTimingBudgetFixtures();
  const beginner = fixtureOutput(creatorLessonGoldenFixtures.beginner.input, "beginner");
  const experienced = fixtureOutput(creatorLessonGoldenFixtures.experienced.input, "experienced");
  const short = fixtureOutput(creatorLessonGoldenFixtures.short.input, "beginner");
  const extended = fixtureOutput(creatorLessonGoldenFixtures.extended.input, "beginner");

  validateCreatorLessonAgainstInput(beginner, creatorLessonGoldenFixtures.beginner.input);
  validateCreatorLessonAgainstInput(experienced, creatorLessonGoldenFixtures.experienced.input);
  validateCreatorLessonAgainstInput(short, creatorLessonGoldenFixtures.short.input);
  validateCreatorLessonAgainstInput(extended, creatorLessonGoldenFixtures.extended.input);

  Object.values(creatorLessonGoldenFixtures).forEach(({ input }) => validateTimingPrompt(input));
  validateProviderAssembly(creatorLessonGoldenFixtures.beginner.input);
  validateProviderAssembly(creatorLessonGoldenFixtures.short.input);

  const withoutPause = structuredClone(short);
  const pauseMinutes = withoutPause.pause_and_try?.duration_minutes ?? 0;
  withoutPause.pause_and_try = null;
  withoutPause.lesson_beats.at(-1)!.duration_minutes += pauseMinutes;
  validateCreatorLessonAgainstInput(withoutPause, creatorLessonGoldenFixtures.short.input);

  const tooLong = structuredClone(beginner);
  tooLong.recap.duration_minutes += 1;
  expectDurationRejection(tooLong, creatorLessonGoldenFixtures.beginner.input);

  const tooShort = structuredClone(beginner);
  tooShort.lesson_beats.at(-1)!.duration_minutes -= 1;
  expectDurationRejection(tooShort, creatorLessonGoldenFixtures.beginner.input);

  const serializedInput = JSON.stringify(creatorLessonGoldenFixtures.beginner.input.input);
  const forbiddenSchoolFields = ["school", "grade_levels", "standards", "student_needs"];
  if (forbiddenSchoolFields.some((field) => serializedInput.includes(`\"${field}\"`))) {
    throw new Error("Creator fixture contains a school-only field.");
  }
  if (beginner.lesson_beats[0].educator_action === experienced.lesson_beats[0].educator_action) {
    throw new Error("Prior knowledge did not change instructional depth.");
  }
  if (creatorLessonDuration(short) !== 8 || creatorLessonDuration(extended) !== 25) {
    throw new Error("Duration fixtures do not preserve requested pacing.");
  }
  if (!beginner.pause_and_try || !beginner.lesson_beats.some((beat) => beat.kind === "demonstration")) {
    throw new Error("Required explanation, demonstration, or practice structure is missing.");
  }
  if (!beginner.claims_resources_to_verify.length) {
    throw new Error("Version-sensitive claim verification is missing.");
  }

  return {
    scenarios: 4,
    beginnerMinutes: creatorLessonDuration(beginner),
    experiencedMinutes: creatorLessonDuration(experienced),
    shortMinutes: creatorLessonDuration(short),
    extendedMinutes: creatorLessonDuration(extended),
    priorKnowledgeChangesDepth: true,
    schoolFieldsAbsent: true,
    verificationFlagPresent: true,
    timingPromptsChecked: 4,
    timingBudgetCases,
    providerAssemblyCases: 2,
    pauseSemanticsChecked: true,
    mismatchedTotalsRejected: true,
  };
}
