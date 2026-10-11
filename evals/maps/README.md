# MAPS Plan Tomorrow evaluation set

`plan-tomorrow-scenarios.json` is the frozen Phase 1E/quality-layer evaluation
set. It contains ten synthetic classroom scenarios spanning elementary,
secondary, and special-area teaching. It contains no production teacher or
student data.

## Comparison protocol

1. Use the scenario's `input` as the teacher request and its `profile` as the
   teacher preferences. Do not add unstated resources or context.
2. Generate one plan per scenario with each system under comparison.
3. Preserve the first response. If the system has a documented automatic
   timing repair, preserve both the original and repaired response and report
   the retry.
4. Remove vendor and model names before review.
5. Score every response on the ten-dimension rubric in
   `docs/PLANNER_LEARNING_QUALITY.md`, from 1 (materially poor) to 5
   (excellent).
6. Review critical failures separately from the aggregate score: unsafe or
   inaccessible activity, invented required resources, impossible timing,
   explicit must-avoid violations, flattened broad-grade expectations, and
   assessment unrelated to the objective.
7. Use at least one experienced teacher review before making a release
   decision. A model grader is a consistency aid, not the final authority.

## Named competitor runs

Run the same frozen inputs through a competitor only with an authorized account
and within that product's terms. Record the product, feature, date, settings,
and any manual transformations needed to fit the input. If the platform does
not accept all constraints, record that limitation rather than silently
dropping fields.

Do not represent a generic-model control as a named competitor. Public feature
pages are useful for product-positioning research but are not evidence of
generated-plan quality.
