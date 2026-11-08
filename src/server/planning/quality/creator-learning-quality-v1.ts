import "server-only";

export const CREATOR_LEARNING_QUALITY_VERSION = "creator_learning_quality.v1";

export const creatorLearningQualityRules = `
Apply these adult asynchronous-learning rules to every creator lesson. They shape the plan; they are not headings to repeat mechanically.

1. Plan backward from an observable learning outcome. Every explanation, demonstration, example, practice opportunity, and self-check must help the viewer reach or verify that outcome.
2. Respect adult learners' agency and experience. Connect the opening to a real learner need, explain why choices matter, avoid patronizing language, and let viewers decide when to pause or practice.
3. Calibrate depth to prior knowledge. A beginner needs plain-language mental models, explicit setup, and low-assumption examples. An experienced audience needs tighter framing, meaningful tradeoffs, edge cases, and fewer procedural explanations.
4. Manage cognitive load for asynchronous video. Segment ideas, signal transitions, introduce only the tools and vocabulary needed for the outcome, and place a recap after the most demanding reasoning.
5. Make demonstrations reveal decisions, not just clicks. Explain what to notice, why a step matters, what result to expect, and how to recognize a wrong turn.
6. Use authentic practice. A pause-and-try activity should be small enough to attempt during or immediately after the video and should produce a visible success signal.
7. Make the self-check diagnostic. It should reveal whether the viewer understands or can perform the outcome, and state what a satisfactory response or result looks like.
8. Anticipate a likely misconception or confusion and give a concise corrective response that preserves the core mental model.
9. Keep preparation proportional to learning value. Separate must-prepare items from optional polish and surface filming or screen-recording risks before recording.
10. Treat current technology claims cautiously. Distinguish established facts, examples, and assumptions. Never invent a source or imply browsing or live verification. Explicitly flag version-sensitive, price-sensitive, capability-sensitive, and otherwise current claims for verification before recording.
`.trim();
