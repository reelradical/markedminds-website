# MAPS private beta

**Target cohort:** 5–10 classroom and special-area teachers

**Status:** Outreach prepared; production hostname and deployment must pass
before invitations are sent

**Last updated:** October 11, 2026

## Release gates

Do not send invitations until all of these pass on the production hostname:

- `https://maps.markedminds.com` resolves and serves the MAPS application
- Google OAuth returns through
  `https://maps.markedminds.com/auth/callback`
- production has the required Supabase public variables and the server-only
  planning OpenAI key
- one real account completes sign-in, profile loading, generation, saving,
  reopening, guided revision, history reopening, sign-out, and sign-in again
- a second account cannot read or revise the first account's plans
- Planner and auth pages remain free of marketing analytics, navigation, and
  footer components
- the guided-revision migration is present in the production Supabase project

## Cohort shape

Recruit for useful variation rather than ten similar users:

- 2–3 elementary classroom teachers
- 2–3 middle- or high-school classroom teachers
- 2–3 special-area teachers, ideally including art, music, or PE
- up to 2 specialists, interventionists, or teachers working across grade bands

Use professional contact information only. Do not collect student information
in the recruitment tracker.

## Invitation email

**Subject:** Private beta invitation: MAPS by Marked Minds

Hi [First name],

I’m inviting a small group of teachers to test MAPS by Marked Minds, a planning
tool built around the class you actually have—not an idealized classroom.

The beta currently lets you:

- save your usual teaching context
- generate a constraint-aware Plan Tomorrow lesson
- reopen saved plans
- request a focused revision without losing the original version

I’d like you to try it with one real lesson you expect to teach. The full test
should take about 15–20 minutes.

Please describe student needs only at the group level. Do not enter student
names, IDs, diagnoses, medical information, or language copied from an IEP or
504 plan.

Private beta link: [PRODUCTION MAPS URL]

Afterward, reply with what felt useful, what felt unrealistic, and the first
thing you would change. Honest criticism is more useful than encouragement at
this stage.

Thank you,

Dani

Marked Minds

## Teacher test script

1. Sign in with Google and complete the short teaching profile.
2. Choose **Plan Tomorrow** and enter one lesson you genuinely need.
3. Include real constraints such as time, class size, materials, transitions,
   cleanup, space, energy, or aggregate learner needs.
4. Generate and save the plan.
5. Open it from **Saved Plans**.
6. Use **Revise this plan** for the mismatch that matters most.
7. Open the original and revised versions from revision history.
8. Sign out and back in, then confirm the plan and revision remain available.

## Feedback questions

Keep the first beta interview or reply focused:

1. Would you actually teach this plan tomorrow? Why or why not?
2. What did MAPS understand about your class that a generic lesson generator
   usually misses?
3. What part of the plan was unrealistic, unnecessary, or developmentally off?
4. Did **Teach this now** give you enough to run the lesson at a glance?
5. Did the required versus optional prep split feel accurate?
6. Did guided revision fix the issue you selected without damaging the rest of
   the plan?
7. What did you still have to rewrite yourself?
8. What planning problem should MAPS solve next?

## Internal beta tracker

Track only the minimum operational information:

| Field | Purpose |
| --- | --- |
| Teacher name | Recruitment and follow-up |
| Professional email | Invitation and support |
| Role / subject / grade band | Cohort coverage |
| Invited date | Outreach status |
| Activated date | Funnel check |
| First plan completed | Core workflow check |
| Guided revision completed | Phase 1F workflow check |
| Follow-up completed | Feedback status |
| Key friction | Product learning |
| Requested next capability | Phase prioritization |

Do not copy plan content, student descriptions, OAuth data, or provider payloads
into the tracker.

## Initial success signals

For the first 5–10 teachers, prioritize qualitative evidence over vanity
metrics:

- at least 5 teachers complete a saved plan
- at least 4 reopen that plan later
- at least 3 create and compare a guided revision
- no cross-account access, privacy, or data-loss incident
- most participants describe at least one constraint MAPS handled correctly
- the strongest repeated unmet need determines the next product slice

Do not add Planner analytics solely for this beta. Use direct follow-up and
owner-scoped operational records already required by the product.
