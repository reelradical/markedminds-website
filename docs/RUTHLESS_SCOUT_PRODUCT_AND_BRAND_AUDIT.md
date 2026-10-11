# Ruthless Scout: Product and Brand Audit

**Status:** Planning and analysis only. No production code, styles, routes, tokens, or data were modified to produce this document, and none should be changed as a result of it without a separate, explicit go-ahead. Nothing was deployed, no production D1 was touched, and nothing in the live Sites pilot was altered.

**Location note:** This document lives in `markedminds-website` (alongside `BRAND_FAMILY_SYSTEM.md` and `BRAND_GUIDE.md`) because it audits the brand-family relationship as much as the product, and because the two repos it covers don't have a shared home of their own. If a durable Ruthless Scout-specific docs folder is established later, this should move with it.

**Repositories reviewed:**
- `/Users/danicummings/Projects/Development/ruthless-scout` — the authenticated pilot application (imported baseline, commit `f3a9f30`)
- `/Users/danicummings/Projects/Development/markedminds-website` — the public marketing site

**Files actually read to produce this document:** `app/page.tsx`, `app/scout-board.tsx`, `app/globals.css`, `app/chatgpt-auth.ts`, `lib/scout-identity.ts`, `db/schema.ts`, all nine `app/api/**/route.ts` files, `app/mcp/route.ts`, `public/brand/ruthless-radar-lime.webp`, `docs/LIVE_PILOT_HANDOFF.md`, `docs/SECURITY_AND_DATA_BOUNDARIES.md` (pilot repo); `src/app/ruthless-scout/page.tsx`, `src/lib/data/ruthless-scout.ts`, `src/components/ruthless-scout/founding-pilot-form.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/button.tsx`, `src/components/academy/academy-badge.tsx`, `src/components/planner/planner-navigation.tsx`, `docs/BRAND_FAMILY_SYSTEM.md`, `docs/BRAND_GUIDE.md` (website repo).

---

## 1. Executive assessment

### What is working

- **The pilot app already has a real, distinctive visual instinct**, not a blank slate. `app/globals.css` (specifically the block marked `/* Ruthless Scout visual system: editorial intelligence, not generic SaaS. */`) already implements a dark, lime-and-cyan, radar/data-forward identity — acid lime `#b8ff26`, cyan accents, a restrained orange family-marker stripe on the brand mark, monospace data labels, condensed display type, and the actual `ruthless-radar-lime.webp` scanning-radar asset as a hero background. This is further along than `BRAND_FAMILY_SYSTEM.md` assumed when it said "nothing currently implemented" — that assessment was correct for the *public marketing page* but not for the *pilot app*, which this audit is the first document to actually inspect.
- **The product's consent and approval model is genuinely good.** Candidate profile edits proposed by the owner require explicit candidate approval before taking effect (`profileSuggestions` table, side-by-side original/suggested comparison UI in the review dialog). Staged opportunities stay invisible until a candidate's profile is approved. The owner's own profile is explicitly excluded from the candidate list. These are real privacy-respecting design decisions already in place, not gaps.
- **The product's own disclaimers are consistent and honest** on both surfaces: the pilot's footer ("Decision support—not a promise of interviews or employment"), the intake consent checkbox, and the marketing page's FAQ disclaimer all converge on the same message — this is not an employment guarantee.
- **The "kill rule" / gates framing is a strong, differentiated product idea** and reads as confident rather than gimmicky in the actual app UI.

### What feels inconsistent

- **Two different cyan values are live in the same app at the same time**: `#14cde0` (touches only `.metric.cyan` and `.lane` text color — a later override) versus `#3dd9eb` (used everywhere else: `.pilot-chip`, `.approval-banner`, `.reviewer-note`, `.admin-review` active borders, `.touch-context`, `.pilot-promise`, `.intake-card-head span`, `.candidate-heading span`, `.review-queue-button`). This reads as an incomplete find-and-replace, not an intentional two-tone system.
- **Two different limes**: the native checkbox `accent-color` is still hardcoded to the old shadcn default `#c9ff3d`, while every other "lime" element in the app (buttons, brand mark, metric borders, score numbers, status dots) uses the actual shipped `#b8ff26`. The consent checkbox — arguably the single most legally/ethically important control on the intake form — renders in the wrong green.
- **Three different oranges, none matching Marked Minds' own canonical orange**: `#ff7a00` (brand-mark stripe), `#ff9c45`/`#ff9d31` (two near-identical "hold"/warning tones), and `#ffb05f` (human-touch button). None of these is `#ff7700` or `#e56600` — the actual confirmed Marked Minds Signature Orange tokens in `src/app/globals.css`. Right now, Ruthless Scout's "family marker" orange is an independently-invented orange that happens to be in the same family of hues, not a deliberate reuse of the parent brand's color.
- **Two near-identical near-blacks**: `--background:#090f14` (root CSS variable, still referenced by shadcn-derived utilities) versus `#070a0c` (the `body` background set later in the override section). Visually almost imperceptible, but it's evidence of the same "partial migration" pattern as the cyan/lime duplication.
- **Two different reds**: shadcn's default `--destructive:#ff6b56` versus the override's `#ff5e4c` (kill-rule, reject status, `.metric.red`).

### What makes the pilot and marketing page feel disconnected

This is the most important finding in this document, and it is a **product/conversion problem, not just a visual one**:

The public marketing page (`src/app/ruthless-scout/page.tsx`) explicitly promises, twice — once in the hero's trust-badge row ("No ChatGPT account required") and once in its own FAQ ("No. Ruthless Scout is delivered through Marked Minds. You only need an email address to join the founding pilot") — that a ChatGPT/OpenAI account is not required.

The actual pilot application's *only* authentication mechanism is ChatGPT-based: `app/page.tsx` calls `requireChatGPTUser("/")`, which redirects unauthenticated visitors to `/signin-with-chatgpt`, reading identity from `oai-authenticated-user-id`/`oai-authenticated-user-email` headers that only exist because the app is hosted as a ChatGPT Sites project (`ruthless-scout-dani.reelradical.chatgpt.site`). There is no email/password path, no magic link, nothing else. The founding-pilot intake form (`founding-pilot-form.tsx`) and its success message ("Selected participants receive a secure Square payment link before work begins") never mention ChatGPT at all, and neither codebase contains any visible handoff instructions telling an accepted applicant that they will need to sign in through ChatGPT to actually use the product they just paid for.

In short: **the thing the marketing page sells is not, today, obtainable the way the marketing page describes obtaining it.** This is independent of visual branding and should be treated as more urgent than the color/typography work below.

Beyond that specific contradiction, the two surfaces simply look like two different products: the marketing page is warm, orange, rounded, editorial, daylight; the pilot is cold, lime/cyan, square-cornered, monospace, nocturnal. A visitor who reads the marketing page and then (hypothetically) reaches the real app would not recognize it as the same thing.

### The five highest-priority problems

1. **The "no ChatGPT account required" claim is false for how the product actually works today.** This is a trust and functionality blocker, not a polish item (Section 9, Section 10 Phase 0).
2. **No documented or visible handoff path** from "selected + paid via Square" to "signed in and using the actual app." Candidates may not know what to do after paying.
3. **The marketing page has zero visual relationship to the actual product.** Its "Opportunity Intelligence" preview panel is an orange-only mockup with hardcoded fake scores that doesn't resemble the real dark lime/cyan dashboard at all — it sets an expectation the product doesn't match.
4. **Authorization is entirely hardcoded-string-based and duplicated across five files** instead of importing the one already-existing canonical constant (`OWNER_EMAIL` in `lib/scout-identity.ts`), and the MCP tool surface (`app/mcp/route.ts`) re-implements authentication independently of the shared `chatgpt-auth.ts` helper used everywhere else.
5. **Nothing distinguishes a human-verified opportunity from an MCP/AI-inserted one**, yet the UI presents all opportunities with a "Verified {date}" badge and "WHY IT SURVIVED" framing that implies human judgment. Given the product's entire value proposition is credible, vetted intelligence, this is a real integrity gap, not a cosmetic one.

---

## 2. Two-surface audit

| Dimension | Public marketing page | Pilot application | Assessment |
|---|---|---|---|
| **Positioning** | "A Marked Minds Technology Product" — career-transition intelligence, framed around Dani Cummings' personal story and the Dream Deferred community specifically | "Career intelligence," framed generically around "your gates" — no reference to Dream Deferred, founder story, or Marked Minds beyond "BY MARKED MINDS" on the intake screen | Both legitimate, but scoped differently — marketing narrows to one community's origin story, the product itself reads as built for anyone. Worth an explicit decision (§11) on whether Dream Deferred-community framing is permanent or founding-cohort-only. |
| **Audience** | Adults with "real experience, real responsibilities" — educators, service members, caregivers, creatives, operators, community leaders, builders | Same implied audience, but delivered through a colder, data/terminal aesthetic more associated with analyst tools than a career-transition service for this audience | The product's visual register skews younger/more technical than the stated 30–59 audience; see §5. |
| **Typography** | Bricolage Grotesque (display) + Geist (body) — Marked Minds' only two licensed typefaces | Arial/Helvetica Neue (body + most display) + Georgia italic serif (for emphasized phrases like "fit your life.") — loaded via plain CSS, no webfonts, no relationship to Marked Minds' type system at all | Full divergence. The pilot's Georgia-serif emphasis treatment also conceptually overlaps with the editorial serif `BRAND_FAMILY_SYSTEM.md` earmarked specifically for Dream Deferred — a sibling-brand collision risk worth resolving before either brand commits to a serif. |
| **Color** | 100% Marked Minds core tokens — `bg-ink`, `text-brand-orange`, rounded-full orange buttons. Confirmed zero distinct Ruthless Scout color anywhere on the page. | Lime/cyan/orange/red system described above, with the internal inconsistencies described above | Opposite problems: marketing page has *no* independent identity; pilot has *too many slightly-wrong versions* of one. |
| **Imagery** | Founder portrait photo, a fabricated "Opportunity Intelligence" UI mockup with invented scores (94/91/88/82) | The real `ruthless-radar-lime.webp` radar-sweep asset as a hero background; no candidate photography; no founder presence at all | The marketing page's product mockup should be replaced with an honest representation of the real UI, or removed. |
| **Layout** | Standard Marked Minds marketing page pattern: alternating `bg-white`/`bg-mist` sections, rounded cards, generous whitespace | Dense, grid-based, sticky side panels, data-table-like opportunity cards, terminal-adjacent | Both are internally coherent layout systems; the gap is that neither acknowledges the other exists. |
| **Navigation** | Standard marketing nav (not reviewed in depth here; out of scope per the brief) | Single-page app shell — topbar with brand mark, account menu, owner-only admin buttons (Human touch, Candidate leads, Pilot reviews) | No shared navigation chrome is expected or desired between a marketing site and an authenticated app — not a problem. |
| **Copy density** | Long-form, narrative, persuasive (founder story, "why this exists" essay, FAQ) | Terse, imperative, almost telegraphic ("Make the call.", "The gates.", "THE KILL RULE") | Intentional and appropriate to each context — marketing needs to persuade, the product needs to be used quickly. Not a problem to fix, but worth naming as a deliberate register shift rather than an accident. |
| **Accessibility** | Standard semantic HTML, visible focus states inherited from the shared `Button`/`Input` components | Several concerns: lime-on-dark and cyan-on-dark combinations are used correctly as accents/borders/large text (not body copy), which is good, but the two competing lime/cyan values make it impossible to verify contrast ratios consistently since the "true" color isn't settled; the native checkbox's stray `#c9ff3d` accent-color has not been contrast-checked at all | Needs a real contrast audit once the color system is consolidated (§4) — cannot be done meaningfully against two different cyans and two different limes simultaneously. |
| **Trust** | Strong — founder transparency, explicit "not a job guarantee" disclaimers, honeypot spam field on the form | Strong in UI copy (privacy bar, export-your-data feature, consent language) but undermined structurally by the verification-badge gap in Problem #5 above | Trust signals exist on both surfaces but aren't reinforcing each other. |
| **Perceived value** | $147 one-time, 7-business-day turnaround, five verified opportunities, 30-minute debrief — clearly stated | No pricing, trial status, or turnaround context appears anywhere in the actual app (reasonable — it's post-purchase) | Fine as-is; the perceived-value question that matters is whether the *product* delivers what the *page* promises, which is a build-quality question, not a copy question. |
| **Conversion path** | Form → "we'll review within 2 business days" → email response → Square payment link → "full intake" | Starts at ChatGPT sign-in → `PilotIntake` gate-setting form → dashboard | **Broken link between the two**, as described above (Problem #1/#2). This is the single most important finding in this audit. |
| **Mobile usability** | Standard responsive Marked Minds marketing patterns (not separately audited in depth; no evidence of mobile-specific issues) | Explicit mobile breakpoints exist (`@media(max-width:650px)` rules throughout `globals.css`) covering topbar, hero, metrics, workspace, dialogs, and the intake grid — this is more mobile attention than many internal tools get, and is a genuine strength worth preserving | No major mobile red flags found in the CSS; real-device testing is still recommended before paid launch but nothing in the source suggests a broken mobile experience. |

---

## 3. Brand-family relationship

**What Ruthless Scout inherits from Marked Minds** (per the endorsed-brand model already established in `BRAND_FAMILY_SYSTEM.md` §2–§4):
- The "By Marked Minds" / "BY MARKED MINDS" endorsement lockup — already present verbatim on the pilot's intake screen (`app/scout-board.tsx`, `PilotIntake`'s header: `<b>RUTHLESS SCOUT</b><small>BY MARKED MINDS</small>`). This is the correct pattern and matches the precedent already proven by `PlannerBrand` in `planner-navigation.tsx` (bold product name + small muted "by Marked Minds" beneath it).
- Signature Orange as a restrained family marker, not a dominant color — the brand-mark stripe already gestures at this; it just needs to use the *actual* confirmed hex (`#ff7700`/`#e56600`) instead of the independently-invented `#ff7a00`.
- The underlying component/interaction grammar (shared shadcn primitives: Dialog, Sheet, Button, Input) is already the same *library* as the rest of the Marked Minds ecosystem uses (Radix-based), even though the pilot's own theme tokens currently override its visual presentation entirely. This is actually the correct endorsed-brand pattern — same bones, different skin — and should be named explicitly rather than treated as an accident.
- The disclaimer/consent voice (decision-support-not-a-guarantee language) is already consistent across both surfaces and should stay that way.

**What must remain distinctly Ruthless Scout:**
- The entire lime/cyan/dark visual world — this is correctly *not* shared with any other family member and should not be diluted toward Marked Minds' warm/orange/daylight marketing register.
- The radar/scanning imagery system (§6).
- The monospace, data-label typographic texture (`.eyebrow`, metric labels, score numbers) — this is a genuine point of differentiation from every other brand in the portfolio and should be preserved and formalized, not smoothed away.
- The Jameson/Scout mascot system (§7) — exclusive to this brand.
- Its distinct, non-marketing-pattern app shell layout (sticky rules panel, queue/workspace grid) — structurally unlike any marketing page and should stay that way.

**How Signature Orange functions as the family marker here:** restrained and occasional, not foundational — exactly as `BRAND_FAMILY_SYSTEM.md` §3 already establishes for the family generally. Concretely, in Ruthless Scout that should mean: the brand-mark stripe, and nothing else. It should not appear as a metric tone, a status color, or a UI accent anywhere else in the app — those roles belong to lime/cyan/amber/red. Right now the pilot's "hold" status tone and the brand-mark stripe are both in the orange family but are *different* oranges with no shared meaning; after consolidation, only the brand-mark stripe should carry actual Signature Orange, and the warning/hold tone should be a visibly distinct amber that reads as "status," not "family."

**Which components may be shared:** the underlying shadcn/Radix primitives (Dialog, Sheet, Button, Input, Textarea) — already effectively shared since both the website and the pilot are React/Tailwind-based, even across two separate repos. Sharing the *library choice* is reasonable; sharing *visual theming* is not, and isn't happening today, which is correct.

**Which typography, layouts, imagery, and interaction patterns should be independent:** typography (see §5 — Ruthless Scout should get its own typeface direction, not inherit Bricolage/Geist, and should not adopt the Georgia-serif-italic treatment given Dream Deferred's prior claim on editorial serif), layout (the dense data-dashboard grid should stay unlike any marketing page), imagery (radar/signal motifs, not lifestyle photography), and interaction patterns (the gates/queue/decision mechanics are Ruthless Scout-specific product mechanics, not a reusable Marked Minds pattern).

**On not becoming a reskinned Marked Minds page:** the real risk today is not that the *pilot* will drift toward looking like Marked Minds — its visual system is strong and specific. The real risk is the *opposite direction*: the marketing page currently looks exactly like a reskinned Marked Minds page with Ruthless Scout's name on it, and should be rebuilt to reflect the pilot's actual visual world (§10, Phase 1) rather than the other way around.

---

## 4. Ruthless Scout visual system

**Governing recommendation: formalize what the pilot has already built, rather than inventing a new system.** The existing "acid" lime/cyan/dark direction is good, on-strategy, and matches `BRAND_FAMILY_SYSTEM.md`'s rationale for lime (signal detection, radar, zero overlap with any sibling brand) and cyan (data/status, not dominant hue). The work needed is consolidation and reconciliation, not redesign.

| Role | Proposed value | Status | Usage | Prohibited |
|---|---|---|---|---|
| **Black/ink foundation** | `#070a0c` (consolidate — retire `#090f14`) | Provisional, requires approval | Page background, card backgrounds (`#0b1014`/`#0c1115`/`#0e1419` tonal variations are fine as a dark-elevation system) | Never use as text color on light surfaces; never let the public marketing page's `bg-ink` (`#0a0a0b`, a *different*, warmer near-black) bleed into Ruthless Scout surfaces interchangeably — they are close but not identical and mixing them will look like a mistake. |
| **Lime (primary)** | `#b8ff26` (consolidate — retire the stray `#c9ff3d` checkbox accent-color) | Provisional, requires approval | Primary buttons ("acid"), brand mark, score numbers, active filter state, status-apply indicators, rule markers | Never as body-text color on dark backgrounds at small sizes (insufficient reading comfort even at good contrast); never on white/light backgrounds without a contrast re-check; never as a background large enough to compete with Signature Orange's one sanctioned location (the brand-mark stripe). |
| **Cyan (secondary/data)** | `#3dd9eb` (consolidate — retire `#14cde0`, the minority value) | Provisional, requires approval — **this specific choice (keeping `#3dd9eb` over `#14cde0`) needs Dani's confirmation**, since `#14cde0` may represent a newer intended direction that just wasn't fully propagated | Lane tags, data labels, "ACTIVE" metric, pilot chip, informational banners (approval/reviewer notes), admin-only UI accents | Never as the dominant color of any hero/primary CTA — cyan signals "status/data," not "brand," per the existing rationale in `BRAND_FAMILY_SYSTEM.md` §6. |
| **Signature Orange (family endorsement)** | `#ff7700` / `#e56600` (adopt the *actual* confirmed Marked Minds tokens — retire the independently-invented `#ff7a00`) | Confirmed values exist already (`src/app/globals.css`); applying them here is a recommendation, not an invention | Brand-mark stripe only. Nowhere else. | Never as a status/metric tone (that role belongs to amber); never used interchangeably with the warning-amber family below — the two must read as visibly different oranges so the endorsement doesn't get diluted into "just another status color." |
| **Status amber (warning/hold — distinct from Signature Orange)** | Consolidate `#ff9c45`/`#ff9d31`/`#ffb05f` into one value, e.g. `#ff9c45` | Provisional, requires approval | "Hold"/"your call" metric tone, human-touch button, staging-rule warning state | Never let this be mistaken for or described as "the Marked Minds orange" — it is deliberately a different hue for exactly that reason. |
| **Destructive red** | Consolidate `#ff6b56`/`#ff5e4c` into one value, e.g. `#ff5e4c` | Provisional, requires approval | Reject status, kill-rule callout, destructive actions | No collision risk with any sibling brand — red is unclaimed elsewhere in the portfolio. |
| **White/off-white text** | `#eef3e8` (already consistent) | Confirmed, no change needed | Primary body text on dark surfaces | — |
| **Gray (muted/secondary text)** | `#91a0a7` family (already fairly consistent) | Confirmed, no change needed | Secondary labels, captions | — |

**Contrast concerns:**
- Lime `#b8ff26` on `#070a0c`: very high contrast, safe for large text/icons/borders (already how it's used).
- Cyan `#3dd9eb` on dark backgrounds: good contrast for small UI labels; should be re-verified once consolidated to a single value.
- The stray checkbox `accent-color:#c9ff3d` has never been contrast-checked against its `#0a1117` input background specifically — fix this as part of consolidation, not as a separate task.
- Status amber and destructive red both sit in a "medium contrast on dark" range that reads fine for short labels/icons but should not be used for body copy — current usage already respects this.

**Side-by-side collision risk with sibling brands** (cross-referencing `BRAND_FAMILY_SYSTEM.md` §6):

| Sibling brand | Their color direction | Collision risk with Ruthless Scout | Notes |
|---|---|---|---|
| MAPS by Marked Minds | Cobalt/clear blue, explicitly not teal | **Low**, provided MAPS lands on true blue, not teal — a muddy teal would sit too close to Ruthless Scout's cyan | Must be tested side-by-side once MAPS has a real hex, per the existing doc's own instruction. |
| Focus + FLEX Academy | Purple `#6b46c1` (protected, exclusive) | **None** — different color family entirely | — |
| Remnants Label | Cadet Blue (muted, grayer blue-teal direction, range `#4F7B86`–`#5E8C96`) | **Low-to-moderate** — Remnants' Cadet Blue is deliberately duller/grayer than Ruthless Scout's bright cyan, which should keep them apart, but this needs an actual side-by-side swatch comparison before either is finalized, since both occupy the general blue-green territory | This is exactly the three-way blue-family spacing problem `BRAND_FAMILY_SYSTEM.md` already flags — Ruthless Scout is one of the three colors that has to stay deliberately pushed apart from the other two. |
| Dream Deferred | Coral-led, electric blue/periwinkle accent | **None on primary color** (coral vs. lime is far apart); periwinkle and cyan are both blue-family but periwinkle leans violet, cyan leans green — should be fine but worth one visual check | — |
| Marked Minds (parent) | Signature Orange `#ff7700` primary | **None**, provided Ruthless Scout's status-amber is kept visibly distinct from Signature Orange as recommended above | This is the one relationship that matters most to get right, since it's not about avoiding collision but about preserving *meaning* — orange should mean "family," not "warning." |

---

## 5. Typography and layout direction

**Recommendation: Ruthless Scout should not inherit Bricolage Grotesque + Geist, and should not adopt Dream Deferred's editorial-serif direction.** It needs its own typographic identity, distinct from both.

The existing pilot already gestures at the right instinct with a condensed, uppercase, high-contrast display face (currently a system-font stand-in: `"Arial Narrow","Helvetica Neue",Arial,sans-serif`) paired with a humanist sans body. That instinct — condensed/geometric display, calm readable body — is correct for "intelligent, decisive, modern" without reading as either corporate-generic or as a design-school type specimen. Two concrete directions worth exploring (not yet chosen; needs a real type pass):

- A **grotesque/geometric sans with a genuine condensed or narrow weight** (not a system-font substitute) for display and data-label use — something with enough personality to read as deliberate rather than default, while staying legible at the small monospace-adjacent sizes the metric/eyebrow labels currently use.
- A **monospace or semi-monospace face for data-specific moments** (scores, metrics, "VERIFIED" timestamps) — this is already conceptually present via the CSS `font: 700 Xpx monospace` declarations scattered throughout `globals.css`, but it's riding on system monospace fonts rather than a chosen one. Formalizing this as a deliberate "data voice" (distinct from the "narrative voice" used in headlines and body copy) would sharpen the "exploratory/sophisticated" quality the brief asks for, and gives Ruthless Scout a typographic signature no sibling brand has claimed.

**Explicitly avoid:** the Georgia-serif-italic emphasis treatment currently used for phrases like "fit your life." — not because it's bad on its own, but because `BRAND_FAMILY_SYSTEM.md` §7/§9 already recommends an editorial serif specifically for Dream Deferred as *that* brand's signature move. If Ruthless Scout also adopts a serif accent, the two siblings lose a point of differentiation that currently costs nothing to preserve. Ruthless Scout's emphasis device should come from weight, color (lime), or a condensed treatment instead — not from switching type families mid-sentence.

**Layout direction:** the existing dense, grid-based, data-dashboard layout (sticky rules panel, metrics row, filterable queue) is appropriate for the target audience and the product's actual job (fast decision-making over structured information) and should be preserved as the model going forward, rather than softened toward a more conventional SaaS-dashboard look. The "visible joints" aesthetic already present in the CSS comment ("Purposeful play: modular parts, visible joints and restrained responsive motion") is a good design principle worth keeping as a stated direction rather than an incidental comment.

**On the 30–59 audience brief specifically:** the current terminal/radar aesthetic skews toward reading as a technical analyst tool, which risks feeling cold or intimidating to a 50-something career-changer who isn't necessarily tech-forward, even though the brief correctly wants "energetic without juvenile" and "premium without corporate-generic." The recommended fix is not to abandon the dark/data aesthetic, but to warm its *texture* — slightly more generous spacing, slightly less monospace-everywhere, and photography (see §6) that puts real adult faces into an otherwise abstract system, so the product doesn't read as built for 25-year-old data engineers.

---

## 6. Imagery system

- **Radar/scanning imagery**: the existing `ruthless-radar-lime.webp` asset (military-style radar sweep, lime beam, status blips in lime/cyan/orange/white/red) is strong, on-brand, and already in production use as the hero background on both the dashboard and intake screens. It should be treated as a reusable *system* (multiple crops/compositions of the same visual language), not a single hero image — e.g., smaller radar-blip motifs for empty states, loading screens, and card backgrounds, rather than commissioning unrelated new imagery.
- **Candidate-centered photography**: currently absent from the pilot entirely, and present only as the founder's own portrait on the marketing page. Given the §5 concern about the product reading as built for a younger/more technical audience than its stated 30–59 target, real (or realistic, consented) photography of people in that age range — in moments of consideration/decision rather than generic stock-photo "success" — would do more to warm the product than any typography change. This is a "before paid launch" nice-to-have, not a blocker.
- **Abstract signals, paths, gates, coordinates, evidence markers**: the radar asset already supplies coordinate/signal language. "Gates" (the product's core metaphor) has no visual treatment yet beyond the text label "THE GATES" — a simple line-icon or diagram system for the five gate types (compensation, place/mode, travel, lanes, values) would reinforce the product's central mechanic visually, not just verbally.
- **Restrained lime/cyan motion and status indicators**: the existing small animated signal-drift on the hero radar image (`@keyframes signal-drift`, already respecting `prefers-reduced-motion`) is a good, restrained example of exactly this — more of this kind of subtle motion (status dots, score reveals) is appropriate; anything louder would work against the "sophisticated" brief.

---

## 7. Jameson as Scout

Per `BRAND_FAMILY_SYSTEM.md` §8, Jameson does not exist anywhere in either codebase today — this section is genuinely greenfield, not a reconciliation.

**Jameson must:**
- Humanize the platform's coldest moments — onboarding, empty states, and the moment a candidate's gate-approval unlocks scouting — without ever appearing on the primary logo lockup or brand mark (which stays the geometric "Target" mark already in use).
- Never make the product appear pet-related. Concretely: no leash/collar/paw imagery, no "good boy" register in copy, no literal dog illustration used as a mascot in the conventional sense — if a canine motif is used at all, it should be abstracted toward "scout/tracker" (a disciplined, working-animal register, closer to a K-9 unit's professionalism than a pet) rather than cute/plush.
- Appear selectively, not persistently — a presence that shows up at specific trust-building moments, not a persistent chrome element competing with the lime/cyan data system for visual attention.

**Recommended initial set of mascot moments** (lowest-risk, highest-value first):
1. **Empty queue state** (`EmptyQueue` component, currently just a `Radar` icon + text) — a single small Jameson illustration/mark alongside "Your gates are set. Now we scout." This is the single best first placement: it's a moment that currently has zero personality and the lowest risk of feeling gimmicky.
2. **Onboarding/intake completion** — a brief appearance at the moment `PilotIntake` hands off to the main dashboard, reinforcing "your scout is now working" without adding friction.
3. **Human-touch queue empty state** (currently just a `Sparkles` icon) — "Your human touch queue is clear" is an ideal second placement, since it's already the most human-facing surface in the admin tooling.
4. **Loading screen** (`LoadingScreen`, currently just a pulsing `Target` icon + "Securing your private workspace…") — a candidate for a later phase once the core mark is established, not a first move.

**Prohibited uses:** primary navigation/brand mark, any surface implying Jameson makes decisions (score, fit, or approval outcomes must never appear to come "from" Jameson — they come from the product/the owner), any surface where literal cuteness would undercut the "ruthless"/decisive brand promise, and any placement dense enough to compete visually with the lime/cyan data system.

**What to explore later, not now:** an actual visual style for Jameson (illustrated mark vs. abstracted icon vs. typographic signature) is explicitly out of scope for this document — per `BRAND_FAMILY_SYSTEM.md`, this should come after the base lime/cyan identity is settled (§13 Phase 2's final step), not before.

---

## 8. Product experience

| Area | Evaluation | Copy guidance |
|---|---|---|
| **Candidate intake** (`PilotIntake`) | Clear three-step mental model ("Set the gates → Scout → Decide"), consent checkbox is explicit and well-worded | Keep as-is; this is one of the better-written parts of the product. |
| **Profile tightening and approval** | Strong design (see §1) — candidate sees original vs. suggested side-by-side, can edit before accepting, nothing changes without approval | No changes recommended; this is a strength to protect, not fix. |
| **Scouting status** | "SCOUTING UNLOCKED" vs. "APPROVAL REQUIRED" states are clear in the admin candidate-lead workspace | Fine as-is. |
| **Opportunity queue** | Dense but scannable; filter/search/decision actions are all one click | Could shorten "WHY IT SURVIVED" labels on mobile where space is tighter — not urgent. |
| **Scores** (fit/leverage) | Presented as bare numbers with no explanation of methodology anywhere in the UI | **Explanation is essential here, not optional** — a candidate paying $147 and seeing "Fit: 94" with zero stated methodology is a trust risk, especially once it's understood (§9) that nothing distinguishes human-scored from MCP-generated scores. |
| **Admin queue** (pilot reviews, candidate leads, human touch) | Functionally complete and well-separated by purpose | Fine as-is structurally; the touchpoint composer's sponsor-guardrail copy ("sponsorship never changes job rankings or fit scores") is good and should be preserved verbatim wherever sponsored content is introduced elsewhere. |
| **Human encouragement** | Genuinely good idea — personal, non-automated-feeling touchpoints flagged by the system but written by a human | No structural issues found; see §9 for the mental-health/financial-boundary gap around this specific feature. |
| **Blog/podcast/resource recommendations** | Delivered through the same human-touch mechanism (kind: "article"/"podcast"/"workshop"/"resource") — reasonable, no separate content system needed yet | Fine as-is at pilot scale. |
| **Partner and sponsor opportunities** | Guardrail copy exists in the UI (see above) but nothing in the data model (`db/schema.ts`) distinguishes a sponsored opportunity from an organic one | **Explanation is essential, and currently missing at the data layer** — this is as much a §9 integrity finding as a product-experience one. |

**Where copy should be shortened:** mobile opportunity cards' "WHY IT SURVIVED" / "WHAT COULD KILL IT" blocks, which can run long in free text with no length guidance given to whoever is writing them (currently just the owner, manually).

**Where explanation is essential:** fit/leverage score methodology (above), and the distinction between human-researched and MCP/AI-sourced opportunities — both are currently unexplained anywhere a candidate can see.

---

## 9. Security and product risks

| Finding | Classification | Evidence |
|---|---|---|
| **Marketing page promises no ChatGPT account is needed; the only real auth path requires one** | **Blocker** | `src/app/ruthless-scout/page.tsx` hero/FAQ copy vs. `app/chatgpt-auth.ts` + `app/page.tsx`'s `requireChatGPTUser`. |
| **No documented/visible handoff from "paid via Square" to "signed in and using the app"** | **Blocker** | `founding-pilot-form.tsx` success copy vs. the pilot's sign-in-only entry point. |
| **Hardcoded owner-email authorization duplicated across five files**, bypassing the one existing canonical constant (`OWNER_EMAIL` in `lib/scout-identity.ts`) | **Before next pilot** | `app/api/admin/candidate-opportunities/route.ts`, `app/api/admin/profile-reviews/route.ts`, `app/api/admin/touchpoints/route.ts`, `app/api/profile/route.ts`, `app/mcp/route.ts` all redeclare `const ownerEmail = "owner@example.invalid"` locally instead of importing it. |
| **MCP tool surface re-implements authentication independently** of the shared `chatgpt-auth.ts` helper, reading raw request headers directly | **Before next pilot** | `app/mcp/route.ts` lines reading `oai-authenticated-user-id`/`-email` directly, vs. every REST route calling `getChatGPTUser()`. |
| **`add_opportunities` MCP tool's approval-gate check is skipped entirely when a candidate has no profile row yet** (`if(profile && ...)` short-circuits on `undefined`) | **Before next pilot** | `app/mcp/route.ts`, `add_opportunities` handler. Low real-world impact today (nothing surfaces without a profile via the REST path), but MCP bypasses the UI gate entirely and should not rely on that coincidence. |
| **Admin-route authorization depends entirely on trusting `oai-authenticated-user-*` headers from the hosting layer**, with no independent in-app verification | **Blocker — verify, don't assume** | This is an infrastructure-level guarantee that can't be confirmed from application code alone. `docs/SECURITY_AND_DATA_BOUNDARIES.md` already names this exact class of risk ("Review authorization server-side; hiding an admin control in the UI is not access control") — treat that as the team's own flag, not a new discovery. |
| **No append-only audit log of owner access to candidate private data** (views, exports, edits) | **Before paid launch** | `db/schema.ts` has no audit-log table; `profileSuggestions`/`candidateMessages` capture *some* history but not general access. Relevant given `SECURITY_AND_DATA_BOUNDARIES.md`'s own classification of career/health-adjacent fields as sensitive. |
| **No structural distinction between human-verified and MCP/AI-sourced opportunities**, yet the UI presents all opportunities with a "Verified {date}" badge and "why it survived" framing implying human judgment | **Before paid launch** | `db/schema.ts`'s `opportunities.source`/`verifiedAt` fields exist but aren't surfaced to candidates, and `verifiedAt` defaults to "now" automatically regardless of actual verification. Directly touches the brief's "AI-generated wording" and "employment-outcome claims" risk categories. |
| **Sponsorship-neutrality promise exists only in UI copy, not in the data model** | **Before paid launch** | The sponsor-guardrail text in `HumanTouchQueue` is good, but nothing in `opportunities`/`candidateMessages` schemas marks an item as sponsored vs. organic, so the promise can't be structurally enforced or audited later. |
| **No explicit mental-health/financial-advice boundary** around the human-touch encouragement feature, despite the product's "life fit" language and a candidate community that may include veterans/caregivers | **Before paid launch** | No boundary statement found anywhere in either codebase; this is an absence, not a bug. |
| **Candidate free-text fields (background, notes, ethicsValues, blockers) have no technical safeguard against sensitive data entry**, despite UI copy asking candidates not to include it | **Later improvement** | Purely trust-based today; DLP-style scanning would likely be over-engineering at 10-person pilot scale, but worth a documented decision either way. |
| **Opportunity `deadline` is free-text with no structured date or staleness detection** | **Before paid launch** | `db/schema.ts`, `opportunities.deadline` (text, defaults to "Open until filled") — given "verified, current" is the core value proposition, an opportunity can go stale silently. |
| **Placeholder owner identity (`owner@example.invalid`) must not reach production as-is** | **Blocker** | Already explicitly called out in `docs/LIVE_PILOT_HANDOFF.md`/`docs/SECURITY_AND_DATA_BOUNDARIES.md` by the team itself — repeating it here because it intersects directly with the authorization-duplication finding above: reconciling the real owner identity is exactly the moment the five-file duplication becomes dangerous if done inconsistently. |
| **A separate-account login was attempted and failed — not merely unverified. Failure layer not yet determined** | **Blocker** | The owner personally attempted pilot sign-in with a separate ChatGPT account; it did not work. Could be a ChatGPT auth failure, a Sites-hosting failure, a connector/app-activation failure, an app-load failure, or an API/runtime failure after authentication — not yet distinguished. The marketing site's "no paid ChatGPT subscription is required" claim must not be treated as confirmed. Diagnostic logging was added in the `ruthless-scout` repo (tagged by layer) to help diagnose the *next* attempt. See `ruthless-scout` repo's `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` pre-flight checklist. |
| **No automatic scouting process exists** | **Blocker** | Source inspection (confirmed via `build/sites-worker.ts` exporting only a `fetch()` handler, no `scheduled()` handler) found zero scheduled jobs, external job-source integrations, or post-approval triggers anywhere in the pilot. Every opportunity a candidate sees today was added by a person or an active ChatGPT tool call. The pilot is an intake/decision dashboard, not yet an operating scouting service — see `ruthless-scout` repo's `docs/SCOUTING_ARCHITECTURE_PROPOSAL.md` for a smallest-viable design proposal (not yet built). |
| **Candidate-added opportunities could appear scored and remain active despite failing hard gates — fixed and hardened across two passes** | **Blocker (resolved)** | Root cause was two-fold: `fitScore`/`leverageScore` defaulted to 50 for any unscored opportunity, *and* `visibilityStatus` defaulted straight to "visible" for every candidate-added and MCP-added row (the schema's own column default, never overridden) — so self-added leads skipped review entirely and landed in the active queue with a fake score. Fixed in `ruthless-scout`: scores are nullable and never defaulted; every insertion path now explicitly stages rather than auto-publishing; release requires an allow-list pass on hard gates (not just avoiding "cut"), a documented exception restricted to the owner-only route, manual location/work-mode review, a deliberate scoring event (score + who + when, not a bare number), and complete verification; a computed "research inbox vs. qualified queue" split keeps anything short of that out of the active counts regardless of stored flags. A local migration rehearsal also caught and fixed a real data-corruption defect in the supporting schema migration before it could reach production. See `ruthless-scout` repo's `docs/AUTHORIZATION_AND_PROVENANCE.md` for the full model. |

---

## 10. Prioritized implementation plan

### Phase 0 — Security and configuration

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Consolidate owner-authorization to a single import | ruthless-scout | 5 API route files, `app/mcp/route.ts` | Replace all local `const ownerEmail = "owner@example.invalid"` with `import { OWNER_EMAIL, isScoutOwner } from "@/lib/scout-identity"` | Removes drift risk before real identity reconciliation | Low | None | `grep -r "owner@example.invalid"` returns zero matches outside `lib/scout-identity.ts` | S |
| Unify MCP authentication with the shared helper | ruthless-scout | `app/mcp/route.ts`, `app/chatgpt-auth.ts` | Route MCP's header reads through the same `getChatGPTUser`-equivalent logic (refactored to accept a raw `Request` if needed) | Removes the second, independently-drifting auth implementation | Medium (touches the tool-calling surface) | Prior task | A single code path governs both REST and MCP auth decisions | M |
| Fix the `add_opportunities` undefined-profile gate bypass | ruthless-scout | `app/mcp/route.ts` | Require an existing, approved profile (or explicit owner identity) before accepting MCP-sourced opportunities, with no silent skip on missing profile | Closes a real gate-bypass path | Low | None | A user with no profile row cannot insert opportunities via MCP | S |
| Verify (don't assume) the hosting layer's header-trust guarantee | ruthless-scout | Infra/hosting config, not app code | Confirm with the ChatGPT Sites platform that `oai-authenticated-user-*` headers are always stripped from inbound requests and only set by the trusted gateway | Closes the single largest unverified assumption in the entire security model | N/A (verification, not code change) | None | Written confirmation obtained and recorded in `docs/SECURITY_AND_DATA_BOUNDARIES.md` | S |
| Resolve the marketing-page ChatGPT-account contradiction | markedminds-website | `src/app/ruthless-scout/page.tsx`, `src/components/ruthless-scout/founding-pilot-form.tsx` | Either change the product's onboarding so no ChatGPT account is genuinely required, or rewrite the marketing copy/FAQ to accurately describe the real sign-in flow — **this is a product decision for Dani, not something to default on (§11)** | This is the top-priority finding in the entire document | High — affects every other phase's assumptions about the conversion path | A decision from Dani | Marketing copy and actual product behavior agree | Decision: S to change copy; L–XL if the product's auth model itself needs to change |
| Document the paid-pilot handoff path explicitly | Both | `founding-pilot-form.tsx` success state; pilot onboarding | Once the above decision is made, write the actual step-by-step a paying candidate follows from "selected" to "using the app" | Closes Problem #2 | Low once Phase 0's prior item is resolved | Prior item | A new candidate can follow the documented path without guessing | S |

### Phase 1 — Cohesive visual foundation

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Consolidate lime to one hex (`#b8ff26`) | ruthless-scout | `app/globals.css` | Remove `--primary:#c9ff3d` usage where it leaks into visible UI (checkbox accent-color, any shadcn-default-derived utility) | Fixes the dual-lime bug in §4 | Low | Dani's hex approval (§4) | Single lime value verifiable via CSS audit | S |
| Consolidate cyan to one hex | ruthless-scout | `app/globals.css` | Pick `#3dd9eb` or `#14cde0` (needs Dani's call, §4) and replace the other everywhere | Fixes the dual-cyan bug in §4 | Low | Dani's decision | Single cyan value verifiable via CSS audit | S |
| Adopt actual Signature Orange tokens for the brand-mark stripe | ruthless-scout | `app/globals.css` | Replace `#ff7a00` with `#ff7700`/`#e56600` per the confirmed Marked Minds tokens | Makes the family-marker link real instead of coincidental | Low | None | Brand-mark stripe matches `src/app/globals.css`'s `--color-mm-orange` exactly | S |
| Separate status-amber from Signature Orange visually | ruthless-scout | `app/globals.css` | Consolidate `#ff9c45`/`#ff9d31`/`#ffb05f` into one amber, distinct from the orange above | Preserves orange's family-endorsement meaning | Low | Prior task | Status-amber and brand-mark orange are visibly, measurably different hues | S |
| Consolidate near-black and red duplicates | ruthless-scout | `app/globals.css` | Pick one ink value (`#070a0c`) and one red (`#ff5e4c`), remove the others | Minor but part of the same cleanup pass | Low | None | No duplicate near-identical hex pairs remain in the stylesheet | S |
| Rebuild the marketing page's product preview to reflect reality | markedminds-website | `src/app/ruthless-scout/page.tsx` | Replace the invented orange-only "Opportunity Intelligence" mockup with an honest representation (screenshot or faithful recreation) of the real lime/cyan dashboard | Closes Problem #3 | Medium (visual, user-facing) | Phase 1's color consolidation above, so the "real" look is actually settled first | M |
| Typography exploration pass for Ruthless Scout | ruthless-scout | `app/globals.css`, font loading | Select and license a condensed/geometric display face + confirm a deliberate data/monospace face (§5) | Replaces system-font stand-ins with a real typographic identity | Medium | Dani's approval of direction + budget for any licensed font | A chosen, loaded, documented type pair distinct from both Marked Minds' and Dream Deferred's | M |

### Phase 2 — Candidate experience

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Surface fit/leverage score methodology | ruthless-scout | `app/scout-board.tsx` (intel sheet) | Add a short, plain-language explanation of how scores are derived, visible from the opportunity detail sheet | Closes the "scores need explanation" gap (§8) | Low | None | A candidate can answer "why is this 94?" from the UI itself | S |
| Distinguish human-verified vs. MCP/AI-sourced opportunities in the UI | ruthless-scout | `db/schema.ts` (add a `verificationMethod` or similar field), `app/scout-board.tsx` | Add a schema field and a visible (even subtle) UI indicator | Closes the integrity gap in §9/§1 | Medium (schema migration) | Phase 0's MCP auth work, so the field can be set reliably at insertion time | M |
| Add structured opportunity expiration | ruthless-scout | `db/schema.ts`, `app/scout-board.tsx` | Replace/augment free-text `deadline` with a real date and a staleness indicator | Closes the staleness gap in §9 | Medium (schema migration + UI) | None | Opportunities older than a defined threshold are visibly flagged | M |
| Candidate-centered photography pass | markedminds-website / ruthless-scout | `public/brand/`, relevant pages | Commission or source consented photography of adults in the 30–59 range | Warms the product per §5/§6 | Low | Budget/approval | At least one real candidate-presence image in use | M |
| Jameson: first mascot moment (empty queue state) | ruthless-scout | `app/scout-board.tsx` (`EmptyQueue`) | Introduce Jameson at the single lowest-risk placement identified in §7 | Begins the mascot system without overcommitting | Low | A chosen visual style for Jameson (explicitly deferred, §7) | Jameson appears in exactly one place, matches usage rules | S (once style exists) |

### Phase 3 — Owner/admin workflow

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Add an audit log for owner access to candidate data | ruthless-scout | `db/schema.ts`, all admin routes | New append-only table logging admin views/edits/exports of candidate data | Closes the audit-trail gap in §9 | Medium | None | Every admin read/write of candidate data produces a log row | M |
| Add a `sponsored` flag to opportunities/messages | ruthless-scout | `db/schema.ts`, `app/api/admin/*` | Structural field backing the existing UI-only sponsor-neutrality promise | Closes the data-model gap in §9/§8 | Low | None | Sponsored content is queryable/auditable, not just promised in copy | S |
| Document a mental-health/financial-advice boundary for human-touch | ruthless-scout (docs), product copy | `docs/`, `HumanTouchQueue` composer | Add a short, explicit boundary statement visible to the owner when composing touchpoints | Closes the §9 boundary gap | Low | None | A documented boundary exists and is visible at the point of composition | S |

### Phase 4 — Jameson and human-touch system

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Full Jameson visual style exploration | ruthless-scout / design | New design assets | Explore illustrated/abstracted/typographic directions per §7 | Needed before expanding beyond the one Phase-2 placement | Low (exploration only) | Phase 1's base identity settled | A chosen direction, approved by Dani | M |
| Expand Jameson to remaining approved moments | ruthless-scout | `app/scout-board.tsx` | Onboarding handoff, human-touch empty state, loading screen (§7) | Completes the initial mascot system | Low | Prior task | All four initially-recommended moments implemented, none prohibited ones | M |

### Phase 5 — Marketing, measurement, and paid-pilot readiness

| Recommendation | Repo | Files | Change | Rationale | Risk | Dependency | Acceptance criteria | Effort |
|---|---|---|---|---|---|---|---|---|
| Resolve Dream Deferred-community framing decision | markedminds-website | `src/lib/data/ruthless-scout.ts`, page copy | Decide and implement whether Ruthless Scout's marketing stays scoped to the Dream Deferred community or broadens (§11) | Needed before scaling past the founding cohort | Low (copy) | Dani's decision | Copy matches the decided scope | S |
| Add conversion-path analytics across both surfaces | markedminds-website / ruthless-scout | Analytics config | Instrument the full funnel from marketing form through to first pilot-app sign-in, once Phase 0's handoff path is fixed | Needed to know whether the fix actually worked | Low | Phase 0 completion | Funnel is visible end-to-end in analytics | M |
| Real-device mobile QA pass on the pilot app | ruthless-scout | N/A (testing, not code) | Manual testing on real phones given the CSS-only evidence in this audit | Confirms the mobile breakpoints actually work in practice | Low | None | No broken layouts found on at least iOS/Android, one browser each | S |

---

## 11. Decisions requiring Dani's approval

**True brand/product decisions:**
- Whether the product's onboarding changes to genuinely not require a ChatGPT account, or the marketing copy changes to accurately describe the real ChatGPT-based sign-in (Phase 0 — this is the single most consequential decision in this document).
- Final lime hex (`#b8ff26`, the already-dominant value, is the recommendation) and final cyan hex (`#3dd9eb` vs. `#14cde0` — needs an explicit call, not just a default to majority usage).
- Whether Ruthless Scout's marketing positioning stays scoped to "the Dream Deferred community" permanently, or broadens as the brand matures (§3, §11 Phase 5).
- A chosen visual style for Jameson (illustrated, abstracted, or typographic) — explicitly deferred in this document per `BRAND_FAMILY_SYSTEM.md`'s own sequencing.
- Final display/data typeface selection for Ruthless Scout (§5) — this document recommends a *direction* (condensed display + deliberate data/monospace face), not specific typefaces.

**Technical implementation choices** (lower-stakes, can proceed without a separate approval round once the above are settled):
- The specific refactor pattern for unifying MCP and REST authentication.
- Schema design for the audit-log table and the `sponsored`/`verificationMethod` fields.
- Whether opportunity-expiration uses a hard date field or a computed staleness window.

---

## Recommended first implementation slice

**Phase 0's two decision items — the ChatGPT-account contradiction and the handoff-path documentation — before anything else.** Every other recommendation in this document, including the color consolidation work that looks like the "obvious" first move, is less urgent than confirming the product can actually be reached and used the way it's being sold. Visual consolidation (Phase 1) is the right *second* move, since it's low-risk, well-evidenced, and doesn't require new design work — it's formalizing what already exists.

## What should remain untouched

- The consent/approval model for profile edits (§1, §8) — this is a genuine strength; do not simplify or streamline it away in the name of moving faster.
- The existing radar imagery asset and its current usage pattern (§6) — reuse and extend it rather than replacing it.
- The dense, data-dashboard layout system (§5) — do not soften it toward conventional SaaS patterns in pursuit of "friendliness"; warm it through photography and copy instead.
- The sponsor-neutrality and decision-support disclaimer language, verbatim, wherever it currently appears — it's already well-written and legally/ethically load-bearing.

## Is the pilot ready for additional users?

**Not yet, as currently connected.** The product mechanics themselves (gates, consent-based profile tightening, staged-opportunity release) are sound enough for more pilot users. But the ChatGPT-account contradiction means any additional user acquired through the existing marketing funnel may arrive expecting an experience the product doesn't provide, and the authorization duplication (§9) should be cleaned up before the user base — and therefore the number of places "owner" could be gotten wrong — grows.

## Is it ready to charge $147?

**No, not until Phase 0 is resolved.** Charging money for a product whose own marketing page makes a false claim about how to access it is the one issue in this entire document that should be treated as non-negotiable before another dollar changes hands. Everything else — color consistency, typography, Jameson, even the audit-log gap — is real but can reasonably follow a paying launch rather than precede it.

## Minimum evidence needed before a paid launch

1. Confirmation (not assumption) that the hosting layer's header-trust guarantee actually holds (§9, Phase 0).
2. A verified, working, documented path from "pays via Square" to "is signed in and using the app" — tested with an actual non-owner account, not just read in source.
3. The owner-authorization duplication consolidated to a single source of truth, so that reconciling the real owner identity (replacing `owner@example.invalid`) can be done once, correctly, instead of in five places.
4. A visible, even minimal, distinction between human-verified and automation-sourced opportunities — this is the core integrity claim the $147 price is actually buying.
5. The marketing page and the real product no longer contradicting each other on the single most basic question: what do I need to use this.
