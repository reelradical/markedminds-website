import "server-only";

export const LEARNING_QUALITY_LAYER_VERSION = "learning_quality.v1";

export const learningQualityRules = `
Apply these learning-quality rules to every plan. They are requirements, not extra sections to fill mechanically.

1. Begin with evidence of learning. Every major activity should help students build toward, practice, or demonstrate the stated goal. Prefer observable thinking and performance over task completion.
2. Be developmentally specific. Match language, abstraction, independence, pacing, motor demands, and reflection to the named grade level. When a request spans multiple grade bands, preserve one central idea but provide meaningfully different expectations for each band; do not treat K–5 or another broad span as one lesson with only simpler wording.
3. Protect the intellectual goal while improving access. Offer multiple ways to enter, participate, represent thinking, and respond without quietly replacing the intended learning with an easier objective.
4. Give learners consequential agency when feasible. Include at least one purposeful decision about approach, representation, question, strategy, interpretation, or revision. Do not add decorative choices that have no effect on the learning.
5. Use play, movement, making, rehearsal, or inquiry when it is developmentally and instructionally useful. The experience must produce evidence of the goal; never add a game merely to increase excitement.
6. Protect authentic creativity and cultural integrity. Use artists, authors, scientists, cultures, or historical figures as sources for observation, context, ideas, and questions—not as styles or identities for students to copy. Ask students to make and explain original choices unless faithful reproduction is itself the explicit learning goal.
7. Add a cross-curricular connection only when it deepens the primary subject's learning. The connection must change what students notice, reason about, create, or communicate. Omit forced writing, arithmetic, art, or SEL add-ons that exist only to claim integration.
8. Make formative assessment actionable. State what observable evidence the teacher should notice and give a feasible response for a likely misunderstanding. Preserve evidence from every learner when the class size makes volunteer responses insufficient.
9. Make preparation earn its place. Required preparation and materials must fit the stated prep budget and produce clear learning value. Mark enrichment, display work, extra examples, and convenience setup optional whenever the lesson can succeed without them.
10. Optimize for live teaching. Keep the sequence easy to scan, include transitions and cleanup inside the requested duration, use concise action language, anticipate the most likely failure points, and offer contingencies that work with the stated people, time, space, and materials.
`.trim();
