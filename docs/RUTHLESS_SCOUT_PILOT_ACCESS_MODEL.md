# Ruthless Scout: Pilot Access Model and Candidate Path

Written as part of Phase 0A (Pilot Trust and Access Readiness), implementing
the findings in `docs/RUTHLESS_SCOUT_PRODUCT_AND_BRAND_AUDIT.md`. Covers the
marketing-side access model and the documented candidate journey. For the
pilot application's authorization refactor and opportunity
provenance/verification system, see `AUTHORIZATION_AND_PROVENANCE.md` in the
`ruthless-scout` repository — this document does not repeat that content.

## Ratified product direction (as given)

1. The current ChatGPT Sites pilot remains complimentary and invite-only.
2. ChatGPT sign-in may be required during the pilot, but the marketing page
   must disclose it clearly.
3. Ruthless Scout's eventual paid product must support standalone
   authentication without requiring a ChatGPT account.
4. The $147 offer is not active until access, provenance, candidate
   protection, and pilot evidence requirements are satisfied.
5. The pilot and future production product are related stages — not
   necessarily the same final hosting or authentication architecture.

## The documented candidate path (current, pilot phase)

1. Request or receive an invitation — today, by submitting the founding-pilot
   form at `/ruthless-scout#founding-pilot` (`src/components/ruthless-scout/founding-pilot-form.tsx`).
2. Receive access instructions — Marked Minds reviews the submission and, if
   selected, replies with an invitation containing ChatGPT sign-in
   instructions (no payment link, no Square link — the pilot is
   complimentary).
3. Sign in — through ChatGPT (`/signin-with-chatgpt` on the pilot app),
   since that is the pilot's only authentication path today.
4. Review privacy/consent language — the pilot's intake screen presents its
   own consent checkbox before any data is collected
   (`app/scout-board.tsx`'s `PilotIntake`/`ProfileForm`).
5. Complete intake — set compensation, location, travel, and values gates.
6. Receive profile-tightening suggestions — the owner may propose tightened
   wording for the candidate's own fields.
7. Approve suggested changes — nothing changes without the candidate's
   explicit approval; the candidate can also edit any suggestion before
   accepting, or decline and keep their original wording.
8. Begin scouting — once intake (and any pending profile review) is
   complete, opportunities become visible in the candidate's private queue.

## What changed on the marketing site, and why

| Location | Before | After | Why |
|---|---|---|---|
| `src/app/ruthless-scout/page.tsx` hero trust badges | "No ChatGPT account required" | `ruthlessScout.accessModel.short` ("ChatGPT sign-in required — no paid subscription") + a full disclosure sentence beneath the badges | The prior claim was false for how the pilot actually works (`docs/RUTHLESS_SCOUT_PRODUCT_AND_BRAND_AUDIT.md` §1, §9) — this was the top-priority finding in that audit. |
| `src/lib/data/ruthless-scout.ts` FAQ: "Do I need ChatGPT or an OpenAI account?" | "No... You only need an email address" | Accurate description: yes for the pilot, no paid subscription, standalone auth planned for the paid product | Same reason — directly contradicted the real auth flow. |
| `src/lib/data/ruthless-scout.ts` FAQ: "What happens after I apply?" | "...you receive a secure Square payment link and the full transition intake" | Describes the real invite + ChatGPT sign-in path; states the pilot is complimentary | No payment mechanism is connected to the current pilot; the prior copy promised something the product doesn't do. |
| `src/app/ruthless-scout/page.tsx` founding-pilot pricing card | "$147 one time" displayed as an active price | "Complimentary," with the $147 figure reframed as the anticipated future standalone-product price, not a current charge | Ratified direction #4 — the $147 offer is not active. |
| `src/components/ruthless-scout/founding-pilot-form.tsx` success message and footer note | Promised a "secure Square payment link" | Describes the real invite + ChatGPT sign-in outcome; states no payment is requested | Same reason — removes a payment-to-access promise the application cannot currently fulfill. |
| `src/lib/data/ruthless-scout.ts` | `foundingPrice: 147` used as an active price | Renamed to `futurePrice` with an explaining comment | Keeps the number available for future-product positioning without it reading as a live charge. |

## Release blocker

**"No paid ChatGPT subscription is required" has not been technically
verified.** This claim is implemented verbatim as given, but whether a
genuine free-tier ChatGPT account can actually sign in to and use the
Sites-hosted pilot is a platform-level behavior — nothing in either
codebase can confirm it. This must be verified by actually attempting
pilot sign-in with a real free-tier account before the pilot opens beyond
invitees already known to have ChatGPT access, and before this claim is
relied upon publicly at scale. Tracked as a formal release blocker in
`RUTHLESS_SCOUT_PRODUCT_AND_BRAND_AUDIT.md` §9 and in the `ruthless-scout`
repo's `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` pre-flight checklist.

## Other open items

- Whether the "For the Dream Deferred community" framing and founder-story
  section should change alongside this access-model update is a separate,
  not-yet-decided brand question (already flagged in
  `RUTHLESS_SCOUT_PRODUCT_AND_BRAND_AUDIT.md` §11) and was intentionally
  left untouched in this pass.
