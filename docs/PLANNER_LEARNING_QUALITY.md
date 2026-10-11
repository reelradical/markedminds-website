# MAPS Learning Quality Layer

**Status:** Implemented quality contract

**Version:** `learning_quality.v1`

**Prompt integration:** `plan_tomorrow_prompt.v2`
**Last updated:** October 11, 2026

MAPS should be more than a well-formatted lesson generator. Its quality layer
defines what the product means by a useful, responsible learning plan and gives
future planning modes a shared standard. The rules apply selectively by
context; they are not ten extra headings that every plan must manufacture.

## Non-negotiables

1. **Learning evidence before activities.** Every major activity builds toward,
   practices, or demonstrates the stated goal. Completion is not treated as
   evidence of learning.
2. **Developmental specificity.** Language, abstraction, independence, pacing,
   motor demand, and reflection fit the named learners. Broad spans such as
   K–5 require meaningful grade-band expectations, not one task with simpler
   wording for younger students.
3. **Access without diminished rigor.** Plans vary entry points,
   representation, participation, and response while protecting the central
   intellectual goal.
4. **Consequential learner agency.** When feasible, students make at least one
   decision that changes their approach, representation, question, strategy,
   interpretation, or revision. Decorative choice does not qualify.
5. **Purposeful play and active learning.** Play, movement, making, rehearsal,
   and inquiry belong when they advance the goal and produce evidence—not as
   engagement theater.
6. **Authentic creativity and cultural integrity.** Artists, authors,
   scientists, cultures, and historical figures are sources for observation,
   context, ideas, and questions. They are not identities or styles for
   students to copy unless reproduction is itself the explicit learning goal.
7. **Meaningful integration only.** A cross-curricular connection must deepen
   what students notice, reason about, create, or communicate in the primary
   subject. MAPS should omit decorative writing, arithmetic, art, or SEL
   add-ons.
8. **Actionable formative assessment.** Checks gather observable evidence from
   the learners who matter, identify likely misunderstandings, and tell the
   teacher what to do next.
9. **Prep must earn its place.** Required setup must fit the stated preparation
   budget and have clear learning payoff. Convenience and enrichment are marked
   optional when the lesson can succeed without them.
10. **Designed for live teaching.** Plans are scannable, fit the real class
    period, include transitions and cleanup, and offer feasible contingencies
    for the stated people, space, materials, and energy.

These rules supplement—not replace—the existing privacy, timing, structured
output, and constraint contracts.

## Framework and SME influences

The layer synthesizes established work; it does not claim endorsement,
certification, or formal affiliation with any person or organization.

- **CAST Universal Design for Learning Guidelines 3.0:** learner agency,
  barrier reduction, and multiple routes for engagement, representation, and
  action/expression inform access without lowered rigor.
  <https://udlguidelines.cast.org/more/downloads/>
- **NAEYC Developmentally Appropriate Practice:** meaningful, active learning
  through play, exploration, and inquiry informs early-childhood and primary
  developmental fit. <https://www.naeyc.org/resources/position-statements/dap/principles>
- **National Academies, _How People Learn II_:** prior knowledge, motivation,
  culture, context, and transfer inform the focus on learners rather than a
  context-free activity template.
  <https://nap.nationalacademies.org/catalog/24783/how-people-learn-ii-learners-contexts-and-cultures>
- **Institute of Education Sciences / What Works Clearinghouse:** connecting
  concrete and abstract representations, active retrieval, and deep
  explanatory questions inform purposeful cognitive work and assessment.
  <https://ies.ed.gov/ncee/wwc/PracticeGuide/1>
- **PBLWorks Gold Standard PBL:** authenticity, inquiry, student voice and
  choice, reflection, critique, and revision inform consequential agency. MAPS
  does not force every one-period lesson to become a project.
  <https://www.pblworks.org/gold-standard/pbl-project-design>
- **Harvard Project Zero, Agency by Design:** looking closely, exploring
  complexity, finding opportunity, and maker empowerment inform active making
  and learner agency. <https://www.pz.harvard.edu/projects/agency-by-design>
- **Harvard Project Zero, Artful Thinking:** using art to strengthen thinking
  and create rich curricular connections informs the rule that arts
  integration must deepen learning rather than decorate it.
  <https://www.pz.harvard.edu/resources/works-of-art-are-good-things-to-think-about>
- **National Core Arts Standards:** Creating,
  Performing/Presenting/Producing, Responding, and Connecting inform authentic
  artistic process rather than style imitation.
  <https://www.nationalartsstandards.org/content/conceptual-framework>
- **Wiggins and McTighe, Understanding by Design:** backward design and
  alignment among desired learning, evidence, and experience inform the
  “learning evidence before activities” rule.
- **John Dewey and contemporary maker-/inquiry-centered practice:** purposeful
  experience, reflection, and learning through doing inform the play and
  agency rules without treating activity alone as learning.

## Product behavior

- The quality layer is composed into the server-side prompt. Provider SDKs and
  credentials remain outside UI code.
- Prompt version `plan_tomorrow_prompt.v2` identifies generations made with
  `learning_quality.v1`; older saved revisions remain immutable and render
  without migration.
- The output schema remains `generated_plan_output.v1`. Grade-band adaptations
  may appear in lesson notes and differentiation rather than requiring a schema
  migration.
- The detail page derives a compact **Teach this now** view from the validated
  lesson flow and divides preparation into **Must do** and **Nice if you have
  time** using existing structured fields.
- Cross-curricular content is omitted when it would not deepen the primary
  objective. Its absence is not a quality failure.

## Evaluation contract

MAPS quality is evaluated on ten dimensions using the frozen synthetic cases
in `evals/maps/plan-tomorrow-scenarios.json`:

1. goal alignment
2. developmental specificity
3. cognitive demand and learner agency
4. purposeful play or creativity
5. authentic cross-curricular connection
6. accessibility without lowered rigor
7. formative assessment usefulness
8. preparation efficiency
9. pacing and scanability
10. constraint and contingency awareness

Timing, privacy, invented required resources, explicit must-avoid violations,
and unsafe or inaccessible tasks are release gates rather than optional score
bonuses. Synthetic evaluation inputs must never be replaced with production
teacher content without a separate consent, de-identification, and governance
decision.
