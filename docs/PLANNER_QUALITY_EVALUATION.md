# MAPS Plan Tomorrow quality evaluation

**Checkpoint:** `3e53495` (`feat: add MAPS phase 1E Plan Tomorrow generation`)

**Evaluation date:** October 11, 2026

**Scenario set:** `evals/maps/plan-tomorrow-scenarios.json`
**Status:** Quality-layer candidate evaluated; named-vendor runs pending

## What was tested

The frozen set covers ten synthetic classroom situations:

1. K–5 visual art across grade bands
2. Kindergarten story sequencing through purposeful play
3. Grade 2 phonics with mixed readiness
4. Grade 3 fractions with scarce manipulatives
5. Grade 5 erosion without lab supplies
6. Grade 6 river civilizations with meaningful integration
7. Grade 7 evidence-based argument without devices
8. Grade 4 music with limited instruments
9. Grade 8 PE in a shared gym
10. High-school biology without a lab setup

Every candidate was evaluated against the same request and ten-dimension
rubric. Generation used the production model and structured output contract.
The evaluation used a separately prompted model grader with vendor/model labels
removed. Model grading supports consistency but does not replace teacher review.

## Comparison boundary

This run includes MAPS and a generic-model control. It does **not** include
generated outputs from MagicSchool, Eduaide, Brisk, or Diffit because their
planning tools require an authorized interactive account or product-specific
workflow. Public marketing pages are not a valid substitute for actual output.
The same frozen scenarios and protocol in `evals/maps/README.md` are ready for a
named-vendor bake-off when authorized accounts and exported outputs are
available.

## Results

| Candidate | Mean score | Timing retries | Interpretation |
| --- | ---: | ---: | --- |
| MAPS at `3e53495` | 44.0 / 50 | 5 / 10 | Strong constraint handling; weaker differentiation in agency, play, and integration |
| Generic-model control | 42.8 / 50 | Not repaired | Useful comparison, but not a named competitor and not production-equivalent |
| MAPS with `learning_quality.v1` | 43.8 / 50 | 1 / 10 | Comparable overall quality; clearer improvement in formative assessment and first-draft timing reliability |

Dimension-level MAPS comparison:

| Dimension | MVP checkpoint | Quality layer | Change |
| --- | ---: | ---: | ---: |
| Goal alignment | 5.0 | 5.0 | 0.0 |
| Developmental specificity | 4.6 | 4.4 | -0.2 |
| Cognitive demand and agency | 4.0 | 4.0 | 0.0 |
| Purposeful play or creativity | 3.4 | 3.3 | -0.1 |
| Authentic cross-curricular connection | 3.0 | 3.0 | 0.0 |
| Accessibility without lowered rigor | 4.9 | 4.8 | -0.1 |
| Formative assessment usefulness | 4.3 | 4.6 | +0.3 |
| Preparation efficiency | 5.0 | 5.0 | 0.0 |
| Pacing and scanability | 4.8 | 4.7 | -0.1 |
| Constraint and contingency awareness | 5.0 | 5.0 | 0.0 |

The cross-curricular score is intentionally neutral when no authentic
connection is warranted. MAPS should not inflate this score with decorative
integration.

## Reliability and cost observation

In the retained ten-scenario quality-layer run, one first draft missed the
requested duration by more than the production tolerance and used the existing
timing-correction retry. All ten ultimately met the production duration gate.
Observed end-to-end generation latency, including that retry, ranged from 10.9
to 25.3 seconds, with a 13.4-second median.

The ten generated plans—including one generation retry—used 16,585 input
tokens and 24,618 output tokens. At the
[standard GPT-5.4 mini rates](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
documented on October 11, 2026, that generation portion was approximately
$0.123 total, or $0.0123 per saved candidate in this run. The separate
model-grading cost is an evaluation expense, not a production plan cost.

Costs are directional: prompt caching, model pricing, response length, and
retry frequency can change them. Recheck official pricing before forecasting.

## Independent product score

**Current product assessment: 7.8 / 10.**

This score is deliberately lower than the model grader's 43.8/50. The product
can produce a usable plan tomorrow, protects real constraints unusually well,
and now presents a practical execution snapshot and prep split. It is not yet
consistently specific enough across broad grade spans, its student agency is
often bounded by teacher-selected choices, and exact-duration reliability
still depends too often on a second generation call.

Strengths:

- realistic constraint and contingency handling
- preparation proportional to the stated budget
- strong access supports without routinely lowering the goal
- actionable formative checks
- a scannable execution layer derived from the validated plan

Open quality gaps:

- the K–5 case improved but still used “older students” instead of explicit
  K–1, 2–3, and 4–5 expectations
- agency is often limited to choosing among teacher-provided options
- authentic integration is correctly restrained but not yet especially strong
  when the scenario calls for it
- the kindergarten case assigned an individual drawing task to three shared
  sheets, so the material quantity and evidence method did not fully agree
- the Grade 2 case compressed an exit check and cleanup for 25 students into
  one minute
- generation still relies on a retry when the first draft misses the timing
  gate

A stricter silent-preflight experiment was rejected. It raised the model score
to 44.2/50, but five of ten cases needed timing repair and one K–5 plan still
failed the production duration gate after retry. A small rubric gain does not
justify worse production reliability.

## Phase 1F recommendation

Phase 1F should be **Teacher Review and Guided Revision**, not a standalone
“Cut to 30 Min” action.

The evidence shows that teachers need to correct the particular mismatch in a
generated plan without re-entering the entire request. The first revision mode
should let a teacher add a short direction and choose one structured intent:

- fit this more specifically to my learners or grade band
- make the pacing, transition, and cleanup more realistic
- reduce required prep or materials
- strengthen evidence of learning
- increase meaningful student choice

“Cut to 30 Min” can later be one duration-specific revision intent, but it is
too narrow to be the product's next core capability.

The revision must create an immutable child revision, retain the original,
reapply privacy and duration gates, identify its prompt/quality versions, and
let the teacher reopen both versions. Phase 1F acceptance should include the
same frozen scenario set plus teacher review of whether the requested change
was made without damaging the rest of the plan.

Before or within that slice, reduce unnecessary timing retries and add an
explicit acceptance check for named grade bands when a request spans four or
more grade levels. Do not add billing, organizations, or unrelated planning
modes to Phase 1F.
