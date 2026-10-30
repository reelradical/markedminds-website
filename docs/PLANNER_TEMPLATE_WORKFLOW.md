# MAPS Template-Aware Planning — K–5 Visual Art Rotation V1

## Scope

This checkpoint supports one known county-style K–5 Visual Art rotation-plan
format. It does not ingest arbitrary Word, PDF, image, or district documents.

Teacher route: `/planner/plans/new/template`

Saved-plan route: `/planner/plans/[planId]/template`

Authenticated DOCX route: `/planner/plans/[planId]/template/export`

## Three-layer architecture

### 1. Template contract

`rotation_plan_template.v1` is a versioned application contract—not a Word
table. It defines:

- header fields: School, Teacher, Content, and Class Rotation Date Range;
- supported grades: Kindergarten through Grade 5;
- required per-grade instructional fields;
- required Engage, Focus, Explore and Apply, and Reflect phases;
- Teacher Actions and Student Actions for every phase; and
- the completeness conditions required before export.

The contract lives in
`src/lib/planner/rotation-plan-contract.ts`. A future template version should
be additive and explicit rather than silently changing stored V1 snapshots.

### 2. Structured lesson output

`rotation_plan_output.v1` stores one shared rotation concept and one complete,
developmentally distinct plan per selected grade. Strict validation requires:

- the output grades to match the selected grades exactly and in order;
- teacher-entered header values to be reproduced exactly;
- teacher-supplied standards to be reproduced exactly and never supplemented;
- all required instructional fields to contain usable content;
- all four lesson phases to appear in the required order;
- phase timing for every grade to equal the requested duration; and
- grade plans not to be identical clones.

MAPS learning-quality rules continue to apply: developmental specificity,
learner agency, authentic creativity, realistic preparation and pacing,
actionable formative assessment, access without reduced rigor, meaningful
integration, transitions, and cleanup.

### 3. Renderer/export layer

The DOCX renderer consumes only validated structured output. It creates:

- a county-format header table;
- one clearly separated section per grade;
- the required per-grade field labels; and
- a phase table containing duration, Teacher Actions, and Student Actions.

The renderer never asks the model to reason about Word rows, merged cells, or
document layout.

## Standards safety

MAPS has no verified standards dataset in this checkpoint. It must not rely on
model memory for standards codes or alignment.

- The teacher may enter standards separately for each selected grade.
- Each non-empty line becomes one standards item.
- The provider must return those items exactly and in the same order.
- Post-generation validation rejects altered, added, or removed standards.
- Missing standards are represented by an empty array—not a placeholder or an
  invented standard.
- A plan with missing standards may be saved and reviewed, but DOCX export is
  blocked until every selected grade has at least one teacher-verified
  standard.

The structural golden fixture uses conspicuous `TEST-*` standards solely to
exercise exact round-tripping and export. They are not instructional standards
and must never be used for a live teacher plan.

## Persistence decision

Template-aware plans reuse the existing owner-scoped model:

- `plans` remains the plan container;
- `plan_revisions` remains the immutable input/output snapshot history; and
- `generation_runs` remains operational generation metadata.

`plans.workflow_type = 'rotation_plan_template'` distinguishes the workflow.
The input, output, prompt, and template versions are stored explicitly. No
parallel planning tables are introduced, and existing RLS policies remain
unchanged.

The initial checkpoint creates only an initial immutable revision. Guided
revision remains a Plan Tomorrow capability and is not silently enabled for a
different output contract.

## Reference and ingestion boundary

The input contract reserves three distinct future resource categories:

1. **Required template/compliance document** — defines fields, organization,
   and completeness requirements. It does not provide instructional claims.
2. **Instructional reference** — a curriculum, standards, artwork, article, or
   other source that may inform lesson content and must carry provenance.
3. **Teacher-created source material** — teacher-owned notes, examples, or
   lesson materials that may inform the plan without becoming the compliance
   template.

V1 stores empty reference lists and a fixed compliance-template identifier.
It does not upload, parse, OCR, embed, index, or retrieve arbitrary files.

## Privacy and analytics

Template planning uses the existing MAPS privacy screening and authenticated,
owner-scoped DAL. Teachers are instructed to describe learner needs in
aggregate and not enter names, IDs, diagnoses, medical information, or copied
IEP/504 text. MAPS pages continue to exclude marketing analytics, Clarity, and
session replay.

## Structural golden scenario

The first non-provider fixture covers:

- K–5 Visual Art;
- a 45-minute rotation;
- color, pattern, printmaking, collage, and visual storytelling;
- all six grade plans;
- all required county-template fields;
- teacher and student actions in every phase;
- exactly 45 minutes per grade;
- visible developmental progression from K through Grade 5; and
- DOCX package generation and document-text inspection.

A paid provider run is a separate approval gate. Before that run, replace all
fixture-only standards with verified teacher-supplied standards.

## Migration status

`202610250001_maps_rotation_plan_workflow.sql` is drafted and dry-runs cleanly.
It expands the existing workflow constraint and adds an authenticated,
owner-scoped atomic finalization function. It must not be applied without
explicit approval.
