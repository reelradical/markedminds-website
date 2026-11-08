import type { ValueProvenance } from "@/lib/planner/plan-contract";

export const CREATOR_LESSON_INPUT_SCHEMA_VERSION = "creator_lesson_input.v1";
export const CREATOR_LESSON_OUTPUT_SCHEMA_VERSION = "creator_lesson_output.v1";
export const CREATOR_LESSON_PROMPT_VERSION = "creator_lesson_prompt.v1";
export const CREATOR_REVISION_INPUT_SCHEMA_VERSION = "creator_lesson_revision_input.v1";
export const CREATOR_REVISION_PROMPT_VERSION = "creator_lesson_revision_prompt.v1";

export const creatorTeachingApproachValues = [
  "explanation",
  "demonstration",
  "guided_tutorial",
  "explanation_and_demonstration",
  "guided_build_along",
] as const;

export const creatorTeachingApproaches = [
  {
    value: "explanation",
    label: "Explanation",
    description: "Build a clear mental model with carefully sequenced examples.",
  },
  {
    value: "demonstration",
    label: "Demonstration",
    description: "Show the process while explaining the decisions that matter.",
  },
  {
    value: "guided_tutorial",
    label: "Guided tutorial",
    description: "Walk viewers through a practical process step by step.",
  },
  {
    value: "explanation_and_demonstration",
    label: "Explanation + demonstration",
    description: "Connect the underlying idea to a concrete demonstration.",
  },
  {
    value: "guided_build_along",
    label: "Guided build-along",
    description: "Help viewers make something alongside the lesson.",
  },
] as const;

export type CreatorTeachingApproach = (typeof creatorTeachingApproachValues)[number];
export type CreatorDeliveryFormat = "youtube_asynchronous";

export const creatorRevisionIntents = [
  {
    value: "adjust_depth",
    label: "Adjust depth",
    description: "Better match the audience's prior knowledge and needed technical depth.",
  },
  {
    value: "improve_pacing",
    label: "Improve pacing",
    description: "Make the explanation, demonstration, practice, and recap fit the video time.",
  },
  {
    value: "clarify_explanation",
    label: "Clarify explanation",
    description: "Strengthen the mental model, examples, and transitions between ideas.",
  },
  {
    value: "strengthen_practice",
    label: "Strengthen practice",
    description: "Improve the pause-and-try activity and self-check without turning it into homework.",
  },
  {
    value: "simplify_preparation",
    label: "Simplify preparation",
    description: "Reduce recording setup or materials without weakening the learning outcome.",
  },
] as const;

export type CreatorRevisionIntent = (typeof creatorRevisionIntents)[number]["value"];

export type CreatorLessonInputV1 = {
  workflow: "creator_lesson";
  planning_context: "adult_creator";
  subject: string;
  topic_or_working_title: string;
  audience: string;
  prior_knowledge: string;
  learner_goal: string;
  learning_outcome: string;
  duration_minutes: number;
  teaching_approach: CreatorTeachingApproach;
  delivery_format: CreatorDeliveryFormat;
  source_notes?: string;
  tools_version_context?: string;
  materials_resources: string[];
  additional_notes?: string;
};

export type CreatorLessonInputSnapshotV1 = {
  input: CreatorLessonInputV1;
  provenance: {
    planning_context: "system";
    subject: ValueProvenance;
    topic_or_working_title: ValueProvenance;
    audience: ValueProvenance;
    prior_knowledge: ValueProvenance;
    learner_goal: ValueProvenance;
    learning_outcome: ValueProvenance;
    duration_minutes: ValueProvenance;
    teaching_approach: ValueProvenance;
    delivery_format: "system";
    source_notes: ValueProvenance;
    tools_version_context: ValueProvenance;
    materials_resources: ValueProvenance;
    additional_notes: ValueProvenance;
  };
};

export type CreatorLessonBeatKind =
  | "explanation"
  | "demonstration"
  | "example"
  | "guided_practice"
  | "transition";

export type CreatorLessonOutputV1 = {
  title: string;
  learning_outcome: string;
  prerequisites: string[];
  materials_tools: Array<{
    item: string;
    purpose?: string;
    required: boolean;
  }>;
  opening_hook: {
    duration_minutes: number;
    teaching_move: string;
    learner_need_connection: string;
  };
  lesson_beats: Array<{
    sequence: number;
    kind: CreatorLessonBeatKind;
    title: string;
    duration_minutes: number;
    educator_action: string;
    learner_action: string;
    learning_purpose: string;
  }>;
  likely_confusions: Array<{
    misconception_or_confusion: string;
    response: string;
  }>;
  pause_and_try: {
    duration_minutes: number;
    activity: string;
    success_signal: string;
  } | null;
  self_check: {
    duration_minutes: number;
    prompt: string;
    look_for: string;
  };
  recap: {
    duration_minutes: number;
    key_points: string[];
  };
  next_learning_step: string;
  recording_preparation_notes: {
    must_prepare: string[];
    optional_preparation: string[];
    filming_notes: string[];
  };
  claims_resources_to_verify: Array<{
    claim_or_resource: string;
    reason: "version_sensitive" | "price_sensitive" | "capability_sensitive" | "current_information" | "source_needed";
    verification_action: string;
  }>;
};

export type CreatorRevisionRequestV1 = {
  intent: CreatorRevisionIntent;
  creator_direction?: string;
};

export type CreatorRevisionInputSnapshotV1 = {
  source_input: CreatorLessonInputSnapshotV1;
  revision_request: CreatorRevisionRequestV1;
};

export type CreatorLessonField =
  | "subject"
  | "topicOrWorkingTitle"
  | "audience"
  | "priorKnowledge"
  | "learnerGoal"
  | "learningOutcome"
  | "durationMinutes"
  | "teachingApproach"
  | "sourceNotes"
  | "toolsVersionContext"
  | "materialsResources"
  | "additionalNotes";

export type CreatorLessonActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<CreatorLessonField, string>>;
};

export const initialCreatorLessonActionState: CreatorLessonActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export type CreatorRevisionActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<"intent" | "creatorDirection", string>>;
};

export const initialCreatorRevisionActionState: CreatorRevisionActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
