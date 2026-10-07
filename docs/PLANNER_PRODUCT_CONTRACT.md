# Marked Minds Planner — V1 Product Contract

**Status:** Approved design target for future implementation  
**Phase:** 1B — documentation only  
**Last updated:** October 6, 2026

This document defines the product-facing V1 contract for Marked Minds Planner.
It is intentionally implementation-independent. Authentication, persistence,
AI providers, onboarding, and Plan Tomorrow are not implemented in Phase 1B.

The first future vertical slice remains:

> Account → onboarding → Plan Tomorrow → generate → save → reopen → revise

## Product principles

1. The individual teacher is the active V1 user.
2. Planning starts with real classroom conditions, not an idealized template.
3. Onboarding asks only for defaults that materially improve the first plan.
4. Teacher-entered natural language is preserved, but the application resolves
   it into a versioned structured contract before generation.
5. Plans and revisions must remain explainable: inputs, outputs, schema
   versions, prompt versions, and revision lineage are retained intentionally.
6. V1 does not intentionally collect student-identifying information.
7. Organization support must remain possible without building organization
   features prematurely.

## 1. V1 ownership model

### Recommended entities

- **Auth identity:** the sign-in identity issued by the future auth provider.
- **Profile:** application-level identity data for one authenticated user.
- **Teacher profile:** planning defaults and preferences for that profile.
- **Plan:** the stable container for one planning task and its revision history.
- **Plan revision:** one immutable input/output version of a plan.
- **Generation run:** metadata about one attempt to produce a revision.

### V1 relationships

```text
Auth identity 1 ── 1 Profile 1 ── 1 Teacher profile
                         │
                         └── 1 ── * Plan 1 ── * Plan revision
                                              │
                                              └── 0..1 Generation run
```

- Every V1 plan has one required `owner_user_id` referencing the authenticated
  user's profile.
- `created_by_user_id` is also recorded separately. In V1 it equals
  `owner_user_id`, but it preserves authorship when organization ownership is
  introduced later.
- Revisions inherit access through their plan. They do not repeat an
  independent owner field, avoiding ownership drift.
- Generation runs inherit access through their associated plan/revision and
  additionally record the requesting user for auditability.

### Explicit V1 exclusions

V1 has no school admins, district admins, organizations, teams, memberships,
roles, shared plans, organization switching, or organization-owned content.
These concepts must not appear in onboarding or authorization behavior.

### Future organization extension path

When organization collaboration becomes an approved product requirement:

1. Add `organizations`, `memberships`, and `workspaces` (or an equivalent
   tenant boundary) in a dedicated migration.
2. Create one personal workspace for each existing user.
3. Backfill existing plans into their owner's personal workspace.
4. Add `workspace_id` to plans and make authorization depend on workspace
   membership.
5. Keep `created_by_user_id` on plans and revisions for authorship/audit.
6. Only then introduce organization-owned workspaces and sharing rules.

Do not add nullable organization columns or polymorphic owner types in V1.
They would create unused states and weaker foreign-key guarantees. The stable
plan/revision IDs and centralized ownership on `plans` make the later workspace
migration straightforward.

### Why this is appropriate for V1

- It gives the individual teacher the shortest, clearest authorization path.
- It avoids building a speculative multi-tenant product.
- It does not name plans or revisions as permanently "personal" entities.
- It preserves creator identity separately from ownership.
- It provides a deterministic migration path rather than premature nullable
  organization fields.

## 2. Teacher profile contract

The teacher profile supplies defaults, not permanent restrictions. Every
profile-derived value used by Plan Tomorrow remains editable in that workflow.

### Field classification

| Field | Type | Classification | Contract |
|---|---|---|---|
| `display_name` | string, 1–80 chars | Derived/defaulted | Seed from auth identity when available; teacher may edit. Must have an effective value before onboarding completes. |
| `role` | enum + optional custom label | Required | One of `classroom_teacher`, `special_area_teacher`, `specialist`, `other`. `other` requires a custom label of at most 80 chars. |
| `subject_areas` | string array | Required | 1–5 teacher-selected or custom content areas; each at most 80 chars. Supports multi-subject teachers. |
| `grade_levels` | string array | Required | 1–8 grade-band values. Use stable codes such as `pre_k`, `k`, `1`…`12`, `adult_other`; labels remain presentation concerns. |
| `typical_class_duration_minutes` | integer | Required | 10–240 minutes. Becomes the default duration, never a fixed limit. |
| `typical_class_size` | integer | Optional | 1–100. Useful for grouping and materials, but may be omitted to keep onboarding light. |
| `common_materials` | string array | Optional | Up to 20 entries, each at most 100 chars. UI should offer common choices plus custom entries. |
| `plan_detail_preference` | enum | Derived/defaulted | `concise`, `balanced`, or `detailed`; default `balanced`. |
| `transition_cleanup_preference` | enum | Derived/defaulted | `needs_buffer`, `standard`, or `minimal`; default `standard`. It informs pacing, not a judgment about classroom management. |
| `low_prep_preference` | enum | Derived/defaulted | `prefer_low_prep` or `neutral`; default `neutral`. |
| `movement_preference` | enum | Derived/defaulted | `encourage`, `neutral`, or `minimize`; default `neutral`. |
| `differentiation_preference` | enum | Derived/defaulted | `always_include` or `when_relevant`; default `when_relevant`. |
| `teaching_context_notes` | string | Optional | At most 1,000 chars. Must show the student-data helper text defined in the privacy contract. |

### Deferred fields

Do not collect these in V1 onboarding:

- school, district, department, team, or administrator
- school address, room number, or daily bell schedule
- named classes, rosters, or student records
- student demographics or individual accommodation records
- standards framework preference
- grading-system integrations
- organization role or membership
- billing profile

### Lightweight onboarding sequence

A future onboarding UI should group the required contract into no more than
three short steps:

1. **What and who you teach:** display name, role, subjects, grades.
2. **Your usual classroom:** typical duration, optional class size/materials.
3. **How you like to plan:** compact preference controls plus optional notes.

Defaults must be preselected where classified as derived/defaulted. Optional
fields must be clearly skippable.

## 3. Plan Tomorrow input contract

### Canonical input shape

```ts
type PlanTomorrowInputV1 = {
  workflow: "plan_tomorrow";
  topic: string;
  subject_area: string;
  grade_levels: string[];
  duration_minutes: number;
  class_size?: number;
  objective?: string;
  available_materials: string[];
  student_needs?: string;
  constraints: {
    copy_access: "unknown" | "available" | "limited" | "none";
    technology_access: "unknown" | "available" | "limited" | "none";
    prep_time_minutes?: number;
    transition_minutes?: number;
    cleanup_minutes?: number;
    space_constraints?: string;
    must_avoid: string[];
    other?: string;
  };
  additional_notes?: string;
};
```

`workflow` is system-assigned. It is not an editable form field and cannot be
changed on an existing plan. Choosing another workflow creates another plan.

### Field rules

| Field | Required | Type and reasonable limit | Default behavior | Profile default | Editable after generation |
|---|---|---|---|---|---|
| `topic` | Yes | string, 1–500 chars | No default; trim surrounding whitespace | No | Yes |
| `subject_area` | Yes, effective | string, 1–80 chars | Use sole profile subject; otherwise teacher selects | Yes | Yes |
| `grade_levels` | Yes, effective | string array, 1–8 stable codes | Use profile grades | Yes | Yes |
| `duration_minutes` | Yes, effective | integer, 10–240 | Use typical class duration | Yes | Yes |
| `class_size` | No | integer, 1–100 | Use profile size when present; otherwise omit | Yes | Yes |
| `objective` | No | string, max 1,000 chars | Omit when unknown; topic still supplies intent | No | Yes |
| `available_materials` | No | array, max 20 items; each max 100 chars | Use common profile materials; empty means no materials were specified, not that none exist | Yes | Yes |
| `student_needs` | No | natural-language string, max 1,500 chars | Omit when blank | No | Yes, subject to privacy screening |
| `constraints.copy_access` | Yes | enum | `unknown` | No | Yes |
| `constraints.technology_access` | Yes | enum | `unknown` | No | Yes |
| `constraints.prep_time_minutes` | No | integer, 0–120 | If low-prep profile preference is active and no value is supplied, generation treats prep burden as low without inventing an exact number | Preference only | Yes |
| `constraints.transition_minutes` | No | integer, 0–30 | Resolve from explicit input; otherwise use a documented system default based on profile transition preference | Preference only | Yes |
| `constraints.cleanup_minutes` | No | integer, 0–30 | Resolve like transition time | Preference only | Yes |
| `constraints.space_constraints` | No | string, max 500 chars | Omit when blank | No | Yes |
| `constraints.must_avoid` | No | string array, max 10; each max 160 chars | Empty array | No | Yes |
| `constraints.other` | No | natural-language string, max 1,000 chars | Omit when blank | No | Yes |
| `additional_notes` | No | natural-language string, max 1,500 chars | Omit when blank | No | Yes |

### Natural language and normalization

- The UI may present textareas, quick picks, and chips while still producing
  the structured shape above.
- Preserve the teacher's accepted text in the immutable revision input
  snapshot; do not silently rewrite their meaning.
- Normalize whitespace, enum values, grade codes, and duplicate list entries.
- Resolve profile and system defaults before generation.
- Store default provenance alongside the input snapshot as system metadata,
  using `user`, `profile`, or `system` per defaultable field. This metadata is
  not part of the teacher-authored input.
- If a teacher changes any input after generation, generating again creates a
  new revision. It never mutates the prior revision.

## 4. Generated plan output contract

### Canonical output shape

```ts
type GeneratedPlanOutputV1 = {
  title: string;
  goal: string;
  before_students_arrive: Array<{
    sequence: number;
    task: string;
    estimated_minutes?: number;
    essential: boolean;
  }>;
  materials: Array<{
    item: string;
    quantity_or_setup?: string;
    required: boolean;
    notes?: string;
  }>;
  lesson_flow: Array<{
    sequence: number;
    duration_minutes: number;
    activity_title: string;
    teacher_action: string;
    student_action: string;
    notes?: string;
    transition_guidance?: string;
  }>;
  teacher_moves: Array<{
    move: string;
    purpose?: string;
    during_flow_sequence?: number;
  }>;
  differentiation: {
    access_supports: string[];
    additional_challenge: string[];
    grouping_or_participation?: string[];
  };
  checks_for_understanding: Array<{
    during_flow_sequence: number;
    method: string;
    look_for: string;
    response_if_not_yet?: string;
  }>;
  if_things_go_sideways: Array<{
    likely_issue: string;
    signal?: string;
    response: string;
    time_adjustment?: string;
  }>;
  what_you_need_for_tomorrow: string[];
};
```

### Required and optional fields

| Field | Requirement | Validation notes |
|---|---|---|
| `title` | Required | 1–160 chars |
| `goal` | Required | 1–1,000 chars; teacher-facing outcome language |
| `before_students_arrive` | Required array, may be empty | Each task is ordered; estimates are optional and do not count toward lesson-flow duration |
| `materials` | Required array, may be empty | Must distinguish required from optional items and stay consistent with available materials/constraints |
| `lesson_flow` | Required, at least one step | Sequences must be unique and contiguous from 1; every duration is a positive integer |
| `teacher_moves` | Required, at least one item | A move may reference a valid lesson-flow sequence |
| `differentiation` | Required object | `access_supports` and `additional_challenge` are required arrays and may be empty only when the output explicitly has no applicable suggestion; never identify a student |
| `checks_for_understanding` | Required, at least one item | Every item references a valid lesson-flow sequence |
| `if_things_go_sideways` | Required, at least one item | Focus on likely failure points and feasible contingencies |
| `what_you_need_for_tomorrow` | Required array, may be empty | Contains only follow-up needs not already required before this lesson |
| Item-level fields marked `?` | Optional | Omit rather than generating filler text |

### Time invariant

The sum of every `lesson_flow[].duration_minutes` must equal the resolved
`duration_minutes` from the revision's input snapshot exactly.

```text
sum(lesson_flow.duration_minutes) = input.duration_minutes
```

Transition and cleanup time that occur during the class must appear as explicit
lesson-flow steps or be included in the duration of a step with clear guidance.
Prep before students arrive does not count toward class duration. An output that
fails the time invariant is invalid and must not be presented or saved as a
successful plan revision.

## 5. Revision model

### Core semantics

- A **plan** is the stable container and URL identity.
- A **plan revision** is immutable after creation.
- The original revision has `parent_revision_id = null`.
- Every later revision records the exact selected source revision as its parent.
- `plans.current_revision_id` points to the version shown by default.
- Creating a valid revision and advancing the current pointer must be atomic.
- A failed or cancelled generation run creates no successful revision and does
  not change the current pointer.
- Revision numbers are monotonically increasing within a plan. They communicate
  creation order, while `parent_revision_id` communicates lineage.

### Revision sources

Use a stable enum:

- `initial_generation`
- `regeneration`
- `quick_action`
- `manual_edit` (future)
- `format_transform` (future)

Each revision stores immutable normalized input and output snapshots plus their
schema versions. It may reference the generation run that produced it.

### Quick-action behavior

Future quick actions—Cut to 30 Min, Make Easier, Make Harder, No Copies, Less
Prep, Fewer Materials, Differentiate, Substitute Version, and Admin Format—must:

1. Operate on the revision the teacher explicitly selected, which may not be
   the current revision.
2. Record that selected revision as `parent_revision_id`.
3. Store a stable `action_key`, not only a display label.
4. Create a new immutable input/output snapshot.
5. Advance `current_revision_id` only after the new revision validates and
   persists successfully.
6. Leave the parent and all other history unchanged.

Branching revision history is therefore valid. V1 UI may display a simple
chronological history first, but the data contract must preserve actual lineage.

## Contract versioning

The first implemented schemas should use explicit identifiers rather than an
unqualified number:

- Input schema: `plan_tomorrow_input.v1`
- Output schema: `generated_plan_output.v1`
- Prompt template: an independently versioned identifier such as
  `plan_tomorrow_prompt.v1`

Never change the meaning of a released schema identifier. Add a new version and
write an explicit migration/adapter when the contract evolves.
