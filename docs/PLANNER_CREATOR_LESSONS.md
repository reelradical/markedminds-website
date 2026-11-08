# MAPS Adult / Creator Lessons

## Scope

Creator Mode is a focused MAPS workflow for an independent educator teaching technology or AI to adults through asynchronous YouTube video. It produces an editable-through-revision, saved, reopenable, filmable lesson plan. It does not produce a full script or a content-marketing package.

The existing School / Classroom workflows remain separate and unchanged:

- Plan Tomorrow
- K–5 rotation template
- saved classroom plans and guided revisions

## Planning contexts

MAPS distinguishes two account onboarding contexts:

- `school_classroom`: requires the existing teacher profile and classroom defaults.
- `adult_creator`: requires only a display name. It does not create a teacher profile or ask for a school, grade, standards, class size, or student needs.

Existing accounts retain `school_classroom` through the database default. Planning context controls onboarding and workspace defaults; it does not change plan ownership or RLS access. A school-context educator may still create a creator lesson because context is selected per planning task.

Inside Creator Mode, these remain separate concepts:

- subject or domain
- topic or working video title
- intended adult audience
- delivery format (`youtube_asynchronous` in V1)
- teaching approach

Adults are never mapped to a school grade, and Creator Mode never invents standards.

## Routes

- `/planner/plans/new` — planning-context chooser
- `/planner/plans/new/creator` — new creator lesson
- `/planner/plans/[planId]/creator` — owner-scoped saved lesson and revision history

The saved-plan library routes each workflow to its own renderer. Creator routes remain under the existing authenticated `/planner` namespace.

## Persistence and ownership

Creator Mode reuses:

- `plans`
- `plan_revisions`
- `generation_runs`
- `plan_feedback`
- the authenticated Supabase server client
- existing owner-scoped RLS policies
- the existing immutable guided-revision finalizer

`plans.workflow_type` uses `creator_lesson`. Initial creator persistence uses the narrow `finalize_creator_lesson_generation(...)` RPC. It verifies `auth.uid()`, generation-run ownership, running state, initial-generation state, and exact creator prompt/input/output schema versions before writing atomically.

Creator Mode does not use a service-role key, privileged browser client, parallel plan table, or weakened RLS policy.

## Versioned contracts

- Input: `creator_lesson_input.v1`
- Output: `creator_lesson_output.v1`
- Initial prompt: `creator_lesson_prompt.v1`
- Revision input: `creator_lesson_revision_input.v1`
- Revision prompt: `creator_lesson_revision_prompt.v1`
- Adult-learning quality layer: `creator_learning_quality.v1`
- Deterministic timing policy: `creator_timing_budget.v1`

The input snapshot preserves the subject, topic, audience, prior knowledge, learner motivation, learning outcome, duration, teaching approach, delivery format, and optional source/tool/material context.

The output contract requires:

1. the creator-supplied learning outcome, preserved exactly
2. prerequisites
3. materials and tools
4. an opening hook tied to learner need
5. sequenced explanation, demonstration, example, practice, or transition beats
6. likely confusion and a corrective response
7. an optional pause-and-try activity
8. a diagnostic self-check
9. a recap
10. a next learning step
11. required, optional, and filming preparation notes
12. claims or resources that require verification

New Creator requests support 8–180 whole minutes. Before either generation or revision starts a provider call, MAPS assigns positive whole-minute slots from the requested duration and teaching approach. Guided approaches always include practice and a pause-and-try slot; shorter non-guided lessons omit the optional pause and use fewer lesson beats. Longer lessons add instructional beats and more time for practice and checking.

The provider supplies instructional content for the assigned slots. Its response schema contains no duration, sequence, or beat-kind fields. MAPS assembles the versioned `creator_lesson_output.v1` snapshot using the precomputed slot values; it does not change model-chosen durations after generation because the model never chooses them. The existing exact-total and instructional-structure validators remain required before persistence. A failed output is never saved and does not trigger an automatic second paid call.

Existing V1 output snapshots retain the same stored shape. The stored-input reader remains compatible with earlier 5–7-minute snapshots, while new requests start at eight minutes so every teaching approach can fit its required phases.

## Technology and AI claim safety

The prompt and renderer make these boundaries explicit:

- supplied source notes are context, not proof of live verification
- MAPS must not invent citations, URLs, product capabilities, prices, or version details
- MAPS must not imply browsing, live verification, or current product testing occurred
- version-sensitive, price-sensitive, capability-sensitive, source-dependent, and otherwise current claims must be listed under “Verify before recording” with a concrete verification action

An empty verification list is permitted only when the lesson genuinely contains no current or source-dependent claim. The saved-plan page still reminds the educator to review against source material.

## Guided revisions

Creator revisions use the existing immutable revision model and owner-scoped `finalize_guided_plan_revision(...)` RPC. Creator-specific revision intents are:

- Adjust depth
- Improve pacing
- Clarify explanation
- Strengthen practice
- Simplify preparation

A revision is a complete replacement plan attached to its parent revision. Earlier versions remain reopenable. A failed revision leaves every saved version unchanged.

## Export

Creator Mode uses browser Print / Save as PDF. No export dependency was added. The document title follows:

`[Lesson title] — MAPS Creator Lesson`

Planner navigation, revision controls, and feedback controls are hidden in print output.

## Synthetic validation scenarios

Until a beta creator supplies a real topic, experience level, and duration, use only synthetic scenarios:

1. Beginner, 12 minutes: “How to structure a useful AI prompt,” for nonprofit staff who have used a chat interface once or twice. Explanation + demonstration.
2. Experienced, 18 minutes: “Evaluate LLM output with a repeatable rubric,” for consultants already using multiple AI tools weekly. Guided tutorial.
3. Duration contrast: run the same beginner prompt lesson at 8 and 25 minutes and compare the number, depth, and timing of beats.
4. Current-claim safety: include a clearly version-sensitive interface note and confirm it appears under “Verify before recording” without invented sourcing.

Structural validation can use fixtures without invoking a paid provider. Any real provider generation requires separate approval.

## Explicit exclusions

Creator Mode does not add thumbnail generation, SEO, channel analytics, monetization, social posts, automatic publishing, YouTube integration, a full-script generator, or a general creator platform.
