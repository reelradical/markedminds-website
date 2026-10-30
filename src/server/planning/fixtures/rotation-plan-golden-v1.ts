import "server-only";

import {
  ROTATION_PLAN_TEMPLATE_VERSION,
  rotationPlanTemplateV1,
  type RotationPlanGrade,
  type RotationPlanGradeOutputV1,
  type RotationPlanInputSnapshotV1,
  type RotationPlanOutputV1,
} from "@/lib/planner/rotation-plan-contract";

const standards: Record<RotationPlanGrade, string[]> = {
  K: ["TEST-K-STANDARD — replace with a verified teacher-supplied standard before live generation"],
  "1": ["TEST-1-STANDARD — replace with a verified teacher-supplied standard before live generation"],
  "2": ["TEST-2-STANDARD — replace with a verified teacher-supplied standard before live generation"],
  "3": ["TEST-3-STANDARD — replace with a verified teacher-supplied standard before live generation"],
  "4": ["TEST-4-STANDARD — replace with a verified teacher-supplied standard before live generation"],
  "5": ["TEST-5-STANDARD — replace with a verified teacher-supplied standard before live generation"],
};

type GradeFixture = {
  target: string;
  criteria: string;
  vocabulary: string[];
  differentiation: string;
  assessment: string;
  writing: string;
  engageTeacher: string;
  engageStudent: string;
  focusTeacher: string;
  focusStudent: string;
  exploreTeacher: string;
  exploreStudent: string;
  reflectTeacher: string;
  reflectStudent: string;
};

const gradeFixtures: Record<RotationPlanGrade, GradeFixture> = {
  K: {
    target: "I can repeat colors and shapes to make a pattern that tells something about my imagined place.",
    criteria: "I know I am successful when I can point to my repeated pattern and name one choice I made.",
    vocabulary: ["color", "shape", "repeat", "pattern", "print"],
    differentiation: "Offer large printing shapes, limited paint choices, and oral pointing prompts while preserving the expectation that every learner chooses and repeats a visual idea.",
    assessment: "During printing, ask each learner to point to the part that repeats; model one additional repeat when the sequence is not yet visible.",
    writing: "Learners dictate or complete the oral stem “My pattern shows…” while the teacher records key words when needed.",
    engageTeacher: "Lead a quick find-and-point hunt for repeating colors and shapes in two artworks.",
    engageStudent: "Point, clap, or name what repeats and predict what might come next.",
    focusTeacher: "Model one safe print, a simple AB repeat, and choosing a color for a feeling or place.",
    focusStudent: "Air-print the repeat and choose two shapes or colors for an original place pattern.",
    exploreTeacher: "Support printing and collage stations, prompting learners to repeat rather than scatter forms.",
    exploreStudent: "Print a repeating sequence, add torn collage shapes, and decide what kind of place the pattern suggests.",
    reflectTeacher: "Invite partner pointing and record a few dictated pattern stories.",
    reflectStudent: "Point to the repeat and tell a partner what the pattern shows.",
  },
  "1": {
    target: "I can organize printed and collaged shapes into a pattern with a beginning, middle, and end.",
    criteria: "I know I am successful when I can trace my pattern, explain the rule, and describe the place it represents.",
    vocabulary: ["pattern rule", "print", "collage", "beginning", "ending"],
    differentiation: "Provide movable shape pieces for rehearsing pattern rules and sentence frames for explanation without choosing the rule for the learner.",
    assessment: "Ask learners to trace the pattern rule before gluing; if the rule changes unintentionally, have them rearrange two loose pieces and explain the correction.",
    writing: "Learners label the pattern rule with letters or color words and complete “This place feels ___ because…”.",
    engageTeacher: "Reveal a printed pattern one section at a time and ask learners to predict the next visual event.",
    engageStudent: "Predict, justify, and revise a guess as more of the pattern appears.",
    focusTeacher: "Demonstrate planning an ABC pattern with printing and saving collage for one story detail.",
    focusStudent: "Arrange loose shapes to test a pattern rule before selecting printing colors.",
    exploreTeacher: "Conference briefly about pattern clarity and how the collage detail changes the imagined setting.",
    exploreStudent: "Print the tested rule, add one purposeful collage detail, and revise any unclear repeat.",
    reflectTeacher: "Use a pair-share prompt focused on evidence rather than preference.",
    reflectStudent: "Trace the pattern for a partner and explain one setting clue.",
  },
  "2": {
    target: "I can combine repeated printed motifs and collage details to show a visual story sequence.",
    criteria: "I know I am successful when I can identify the repeated motif and explain how the sequence changes across the artwork.",
    vocabulary: ["motif", "sequence", "foreground", "background", "visual story"],
    differentiation: "Offer a three-part planning strip and pre-cut neutral shapes while keeping motif design, sequence, and story decisions with the learner.",
    assessment: "At the midpoint, learners identify motif, sequence, and one change; redirect additions that do not clarify the visual story.",
    writing: "Learners write three brief captions—first, next, and finally—that correspond to visible changes rather than retelling an unrelated story.",
    engageTeacher: "Show three cropped sections of an artwork and ask how repetition can connect moments.",
    engageStudent: "Order the sections and cite a repeated visual clue that supports the sequence.",
    focusTeacher: "Model designing one motif and varying placement or color to signal change over time.",
    focusStudent: "Sketch a three-part visual sequence and mark where the motif repeats or changes.",
    exploreTeacher: "Prompt attention to foreground/background and pause for a midpoint story check.",
    exploreStudent: "Print the motif across three moments, layer collage details, and revise for readable sequence.",
    reflectTeacher: "Facilitate a gallery partner read using evidence from the image.",
    reflectStudent: "Read a partner’s sequence, then compare the interpretation with the artist’s three captions.",
  },
  "3": {
    target: "I can vary color, pattern, and printed emphasis to communicate mood and change in a visual narrative.",
    criteria: "I know I am successful when I can connect at least two visual choices to the mood or turning point a viewer notices.",
    vocabulary: ["emphasis", "contrast", "mood", "turning point", "composition"],
    differentiation: "Use a mood-to-color/pattern planning matrix and optional composition frames while requiring learners to justify their own visual relationships.",
    assessment: "Conduct a stop-and-read: a peer names the apparent mood and focal change; the artist revises when evidence does not match intent.",
    writing: "Learners write a two-sentence artist note connecting one color choice and one pattern change to the narrative turning point.",
    engageTeacher: "Compare two compositions with different contrast and repetition, asking what mood evidence viewers notice.",
    engageStudent: "Annotate one visual clue in each composition and defend a mood interpretation.",
    focusTeacher: "Model shifting motif scale, density, or color to create emphasis without copying a reference artwork.",
    focusStudent: "Plan a beginning state and turning point using two intentional changes in motif or color.",
    exploreTeacher: "Run a midpoint peer read and coach revisions based on the gap between intention and visible evidence.",
    exploreStudent: "Print, collage, test the focal change with a peer, and revise contrast or placement.",
    reflectTeacher: "Invite evidence-based notices before artists reveal intention.",
    reflectStudent: "Interpret a peer’s mood and turning point, then share the artist note and one revision.",
  },
  "4": {
    target: "I can organize repeated and contrasting visual symbols to communicate a layered story about place or identity.",
    criteria: "I know I am successful when I can explain how hierarchy, repetition, and material choices guide more than one interpretation.",
    vocabulary: ["symbol", "hierarchy", "contrast", "layering", "interpretation"],
    differentiation: "Provide symbol-development questions and optional thumbnail formats while preserving complexity, interpretive openness, and independent composition decisions.",
    assessment: "Use a silent peer annotation to identify visual hierarchy and inferred meaning; artists revise when the intended relationship has no visible support.",
    writing: "Learners draft a concise curatorial label naming a central question, two symbolic choices, and an interpretation they want viewers to consider.",
    engageTeacher: "Facilitate a notice/infer discussion about how repeated symbols can hold personal or community meaning without assuming one correct reading.",
    engageStudent: "Generate multiple interpretations and identify the evidence supporting each one.",
    focusTeacher: "Model thumbnailing two hierarchies and testing which arrangement strengthens a chosen relationship.",
    focusStudent: "Develop original symbols, compare two thumbnails, and select a hierarchy with a stated reason.",
    exploreTeacher: "Coach print/collage layering and use silent annotations to surface unintended readings.",
    exploreStudent: "Build the selected composition, collect peer interpretations, and revise hierarchy or contrast.",
    reflectTeacher: "Structure a short critique around intention, evidence, and interpretive possibility.",
    reflectStudent: "Present the curatorial label, cite a peer reading, and explain one revision that clarified or productively complicated meaning.",
  },
  "5": {
    target: "I can develop and revise a print-and-collage visual narrative that uses pattern, symbolism, and composition to communicate a point of view.",
    criteria: "I know I am successful when I can defend how my visual system, pacing, and revision choices shape the viewer’s experience and point of view.",
    vocabulary: ["point of view", "visual system", "pacing", "symbolism", "revision"],
    differentiation: "Offer critique roles, planning checkpoints, and alternate hand-tool techniques while maintaining the same expectations for intentional point of view and evidence-based revision.",
    assessment: "Use a protocol in which peers identify point of view, cite three visual signals, and pose one question; artists select and document a consequential revision.",
    writing: "Learners write a short process statement that identifies the intended point of view, analyzes three visual choices, and explains why they accepted or rejected critique feedback.",
    engageTeacher: "Present two visual narratives with contrasting points of view and facilitate analysis of framing, recurrence, and omission.",
    engageStudent: "Compare the narratives and argue how composition positions the viewer.",
    focusTeacher: "Model building a motif system and mapping visual pacing across a sequence before selecting production techniques.",
    focusStudent: "Define a point of view, develop a motif system, and map where repetition, interruption, and collage layers will occur.",
    exploreTeacher: "Facilitate a timed critique checkpoint and press for revisions that change meaning rather than merely decorate.",
    exploreStudent: "Produce the narrative, gather evidence-based critique, and complete one documented structural revision.",
    reflectTeacher: "Lead a critique connecting process decisions to viewer experience and unresolved questions.",
    reflectStudent: "Defend the visual system and revision, then name one question the finished work intentionally leaves open.",
  },
};

function gradePlan(grade: RotationPlanGrade): RotationPlanGradeOutputV1 {
  const fixture = gradeFixtures[grade];
  return {
    grade,
    standards: standards[grade],
    learning_targets: [fixture.target],
    success_criteria: [fixture.criteria],
    instructional_resources_materials: ["Washable printing ink or tempera", "Foam printing plates or found-shape stampers", "Drawing paper", "Collage paper scraps", "Glue sticks", "Pencils and washable markers"],
    academic_vocabulary: fixture.vocabulary,
    differentiation: [fixture.differentiation],
    assessment_strategies: [fixture.assessment],
    writing_strategies: [fixture.writing],
    phases: [
      { phase: "engage", duration_minutes: 5, teacher_actions: [fixture.engageTeacher], student_actions: [fixture.engageStudent] },
      { phase: "focus", duration_minutes: 8, teacher_actions: [fixture.focusTeacher], student_actions: [fixture.focusStudent], transition_or_cleanup: "Move from demonstration to prepared table stations in one minute using assigned material roles." },
      { phase: "explore_apply", duration_minutes: 25, teacher_actions: [fixture.exploreTeacher], student_actions: [fixture.exploreStudent], transition_or_cleanup: "Reserve the final four minutes for capped ink, returned tools, scrap sorting, and artwork placement on the drying rack." },
      { phase: "reflect", duration_minutes: 7, teacher_actions: [fixture.reflectTeacher], student_actions: [fixture.reflectStudent] },
    ],
  };
}

export const rotationPlanGoldenInput: RotationPlanInputSnapshotV1 = {
  input: {
    workflow: "rotation_plan_template",
    template_version: ROTATION_PLAN_TEMPLATE_VERSION,
    school: "MAPS Structural Test School",
    teacher: "MAPS Structural Test Teacher",
    content: "Visual Art",
    rotation_date_range: "October 26–30, 2026",
    grades: ["K", "1", "2", "3", "4", "5"],
    topic_unit_concept: "Color, pattern, printmaking, collage, and visual storytelling",
    shared_objective: "Learners use repeated visual elements and layered materials to communicate an original idea or story with increasing intentionality across grade levels.",
    standards_by_grade: standards,
    available_materials: ["Washable printing ink or tempera", "Foam printing plates", "Paper", "Collage scraps", "Glue sticks", "Markers"],
    aggregate_learner_needs: "Some learners benefit from visual sequencing, material-choice limits, oral rehearsal, and alternate fine-motor tools.",
    duration_minutes: 45,
    class_size: 26,
    constraints: {
      copy_access: "limited",
      technology_access: "none",
      prep_time_minutes: 25,
      transition_minutes: 2,
      cleanup_minutes: 4,
      space_constraints: "Shared tables and one drying rack.",
      must_avoid: ["Artist-style imitation", "Individual student information"],
      other: "Materials must reset quickly between back-to-back grade rotations.",
    },
    additional_notes: "Keep the common concept visible while making developmental differences obvious.",
    references: {
      compliance_template: {
        template_id: rotationPlanTemplateV1.id,
        template_version: ROTATION_PLAN_TEMPLATE_VERSION,
      },
      instructional_references: [],
      teacher_created_sources: [],
    },
  },
  provenance: {
    school: "user",
    teacher: "user",
    content: "user",
    rotation_date_range: "user",
    grades: "user",
    topic_unit_concept: "user",
    shared_objective: "user",
    standards_by_grade: "user",
    available_materials: "user",
    aggregate_learner_needs: "user",
    duration_minutes: "user",
    class_size: "user",
    constraints: "user",
    additional_notes: "user",
    references: "system",
  },
};

export const rotationPlanGoldenOutput: RotationPlanOutputV1 = {
  title: "Printed Stories: Pattern, Place, and Point of View",
  shared_rotation_concept: "Across K–5, learners investigate how repeated color, pattern, printed motifs, collage layers, and visual sequence can communicate an original story. Expectations progress from recognizing and making a repeat to constructing and revising a visual system that communicates point of view.",
  header: {
    school: rotationPlanGoldenInput.input.school,
    teacher: rotationPlanGoldenInput.input.teacher,
    content: rotationPlanGoldenInput.input.content,
    rotation_date_range: rotationPlanGoldenInput.input.rotation_date_range,
  },
  grade_plans: rotationPlanGoldenInput.input.grades.map(gradePlan),
};
