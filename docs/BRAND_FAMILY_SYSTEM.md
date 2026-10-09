# Marked Minds Brand Family System

**Location note:** This document was specified at `docs/brand/BRAND_FAMILY_SYSTEM.md`.
It's placed at `docs/BRAND_FAMILY_SYSTEM.md` instead — the repository has no
existing subfolders anywhere under `docs/` (20+ docs, all flat, including
the closest sibling to this file, `docs/BRAND_GUIDE.md`), so a new `brand/`
subfolder would break an established, consistent convention rather than
follow one. Say the word if you'd rather it actually live at the originally
specified path.

**Status:** Governing document. Nothing in this file has been implemented.
No production code, styles, tokens, or routes were touched to produce it.

**Relationship to `docs/BRAND_GUIDE.md`:** That document remains the source
of truth for Marked Minds' own core identity (colors, type, logo, favicon,
positioning) — this document does not replace it, restate it as "confirmed"
a second time, or modify it. This document's job is the *relationship
between* Marked Minds and the brands it houses, and the individual identity
direction for each of those brands. Where this document needs a Marked
Minds fact (the orange hex, the type system), it cites `BRAND_GUIDE.md`
rather than re-deriving it.

**A conflict surfaced during research, with a proposed (not final) resolution:**
`BRAND_GUIDE.md` states explicitly, under "What Not To Do": *"Don't
reintroduce 'education nonprofit' or 'education company' framing as the
primary identity — Marked Minds is the parent creative studio."* The live
`site.ts` description (changed 2026-10-07, commit `d13da44`) currently reads
*"Marked Minds is an education technology company..."* — which is close to
the exact framing `BRAND_GUIDE.md` warns against.

**Proposed parent positioning (requires Dani's final approval — not yet
adopted):**

> "Marked Minds is a creative venture studio building tools, experiences
> and brands for how people learn, work, create and become."

"Education technology/company" is too narrow to represent the full
portfolio this document covers. Two of the five operating brands *are*
directly education-centered — **Focus + FLEX Academy** (a youth learning
program) and **MAPS** (currently the family's dedicated
education-technology product) — so this isn't a case of education being
a minor thread. But the other three are not: Ruthless Scout is
career-transition intelligence, Dream Deferred is a storytelling
platform, and Remnants Label is a fashion line. A parent identity built
around "education technology" would still underrepresent three of five
operating brands, and would itself be exactly the kind of branded-house
flattening §2 argues against, just at the positioning-statement level
instead of the visual one. The proposed language is built to house all
six family members (the parent plus all five brands) without needing a
future rewrite each time a non-education brand joins the family. This is
flagged again in §14 (Approval
Matrix) as the one decision that should probably be settled before the
rest of Phase 1, since the parent's own positioning shapes how every
brand's endorsement level (§11) reads.

---

## 1. Purpose

This document governs the relationship between Marked Minds and the
distinct brands and products it houses. It exists because the current
portfolio has grown organically — each addition (Focus + FLEX Academy,
Ruthless Scout, MAPS, Dream Deferred) was built as its own page using the
same shared component library and the same core palette, with no explicit
rule yet for when a brand *should* look different from Marked Minds and
when it shouldn't. The result, confirmed directly against the live
codebase in §12, is more visual repetition than an intentional family
resemblance would produce.

This system must create:

- **Shared lineage** — every brand should read as something Marked Minds
  stands behind, without needing to say so loudly.
- **Independent brand recognition** — each brand should be identifiable
  with its logo removed, by its own color, type, and voice.
- **Audience-specific experiences** — a district administrator reading
  Focus + FLEX Academy and a mid-career professional reading Ruthless
  Scout are different people with different expectations; the brand
  should meet each of them differently.
- **Controlled visual variety** — variety that is designed, not
  accidental, and bounded by a shared grammar (§3–4).
- **Scalability for future brands and products** — a new brand should be
  addable by following this document's pattern, not by re-litigating the
  whole system.

## 2. Brand Architecture

Marked Minds should operate as an **endorsed family of distinct brands**,
not a single visual system stretched across unrelated products.

- **Marked Minds is the parent organization** — the credibility layer,
  the entity that stands behind each brand, and (per `BRAND_GUIDE.md`) a
  creative innovation studio in its own right, not merely a holding
  company.
- Individual brands may use **"By Marked Minds"** (or, where space is
  tight, "by Marked Minds") as a restrained endorsement — present, not
  dominant.
- **Marked Minds should not visually overpower the individual brand.** A
  visitor to a Ruthless Scout or Focus + FLEX page should feel they're on
  *that* brand's page, with Marked Minds as a quiet signature, not the
  other way around.
- **Individual brands should be recognizable without the parent logo
  being prominent.** This is the actual test applied in §15's review
  checklist: cover the logo — is it still obviously that brand?
- **Shared ownership does not require shared typography, page templates,
  or identical interfaces.** Two brands can be equally "Marked Minds" and
  look nothing alike.

### Branded house vs. house of brands vs. endorsed brands

| Model | What it means | Why it's wrong for Marked Minds |
|---|---|---|
| **Branded house** | One brand, one visual system, applied uniformly across every product (e.g., Google) | This is close to what exists *today* by default (see §12) — it's why Ruthless Scout, MAPS, and Dream Deferred currently look like reskins of the same template. It flattens genuinely different audiences into one experience. |
| **House of brands** | Fully independent brands with no visible connection (e.g., P&G's detergent brands) | Marked Minds is a small, founder-led studio — hiding the connection between its own products wastes the credibility each one builds for the others, and isn't honest about how closely related they actually are. |
| **Endorsed brands** | Distinct brands, each with its own identity, visibly backed by one parent (e.g., Marriott's hotel brands, Google's own sub-products like Nest) | **This is the right model.** It lets Focus + FLEX feel kinetic and youth-facing, Ruthless Scout feel precise and adult-facing, and Dream Deferred feel cinematic — while a visitor who encounters more than one still understands they're the same trustworthy source. |

## 3. Shared Family DNA

The only elements every brand may share. Everything not listed here is
independence territory (§4).

- **One exact Marked Minds Signature Orange** — `#ff7700`
  (`--color-mm-orange`, exposed as `brand-orange` in Tailwind), confirmed
  in `src/app/globals.css` and `docs/BRAND_GUIDE.md`. This is Marked
  Minds' own **primary color**, not merely an accent — and it is also the
  one shared family color every brand may carry, though its role and
  prominence differ by brand (dominant for Marked Minds itself; a
  secondary signature or family marker elsewhere — see below and §6).
- **"By Marked Minds" endorsement treatment** — see §11 for levels and
  placement. A real precedent already exists: `PlannerBrand`
  (`src/components/planner/planner-navigation.tsx`) renders "MAPS" with
  "by Marked Minds" directly beneath it, smaller and muted
  (`text-charcoal/45`). This is the pattern to generalize, not reinvent.
- **A recurring mark-making device** — **provisional, not yet chosen.**
  The brief suggests an underline, slash, annotation, coordinate,
  registration mark, or imperfect line. Nothing like this currently
  exists in the codebase in any brand. This needs a real design pass,
  not a decision made inside a Markdown file — flagged as open in §14.
- **High standards for clarity, accessibility, and intentional design** —
  already the de facto standard across the codebase (semantic headings,
  `aria-hidden` on decorative elements, focus-visible outlines in
  `globals.css`, `prefers-reduced-motion` handling). Carry this forward
  explicitly as every brand's floor, not just Marked Minds core's.
- **Themes of possibility, movement, experimentation, transformation,
  and making** — a voice/thematic thread, not a visual one. Every brand
  in the portfolio already expresses some version of this (Focus + FLEX:
  growth; Ruthless Scout: transition; Dream Deferred: becoming) —
  confirmed by reading each brand's actual copy, not asserted.
- **A shared family directory / ecosystem reference** — doesn't exist
  yet. `src/lib/data/initiatives.ts` is the closest thing (it lists
  Focus + FLEX Academy, Community Impact, Dream Deferred, Consulting +
  Strategy as `currentInitiatives`) but it predates Ruthless Scout and
  MAPS and doesn't include them. Worth reconciling once this document's
  portfolio list (§5) is approved — flagged in §13, Phase 3.
- **Consistent quality of writing and user experience** — a standard,
  not an asset to inventory.

**Signature Orange does not have to be every brand's dominant color to
still matter.** For Marked Minds itself, it is the primary color, full
stop. For a brand with its own primary accent (Focus + FLEX's purple,
Ruthless Scout's lime, Remnants' Cadet Blue — see §6), Signature Orange's
role shifts to secondary accent and family marker: a small dot (the
existing `Logo` component's `invert` variant already does exactly this —
a plain orange dot beside wordmark text, confirmed in
`src/components/shared/logo.tsx`), a stitch line, a route marker, a
recording-light accent, an annotation mark, or purely in the endorsement
lockup itself. Ruthless Scout, for example, can be lime-first (§6) and
still carry one small Signature Orange signal somewhere without orange
becoming its personality there.

## 4. Independence Rules

Brands should **not** automatically share:

- Primary fonts
- Full color palettes
- Page templates
- Navigation treatments
- Hero layouts
- Card components
- Photography treatments
- Illustration styles
- Voice intensity
- Icon systems
- Amount of orange used

**Governing principle: share the grammar, not the entire outfit.**

Two brands can use the same underlying `Button` component (shared
grammar — same accessibility behavior, same focus states, same
underlying DOM) while rendering completely differently (different
outfit — different color prop, different type scale, different spacing
density). §10 describes exactly how that technical sharing should work.

## 5. Portfolio Overview

Six brands make up the current Marked Minds family. **Black2SchoolMVMT is
intentionally not in this table** — see §6a for why.

Columns marked **Confirmed** are pulled directly from live code/copy.
Columns marked *Provisional* are this document's proposed direction and
require Dani's approval before anything is built from them.

| | Marked Minds | Ruthless Scout | MAPS by Marked Minds | Focus + FLEX Academy | Dream Deferred | Remnants Label |
|---|---|---|---|---|---|---|
| **Purpose** | Parent studio: education, creative production, design, strategy — the credibility layer (Confirmed, `BRAND_GUIDE.md`) | Career-transition opportunity intelligence for experienced professionals (Confirmed, `src/lib/data/ruthless-scout.ts`) | Structured lesson/classroom planning tool for educators (Confirmed, `docs/PLANNER_PRODUCT_CONTRACT.md`, currently pre-launch per `/plan`'s copy: "Planning workflows are not active yet") | Small-group, project-based youth learning program (Confirmed, `src/lib/data/academy.ts`) | Cultural storytelling platform — podcast, live events (Confirmed, `src/app/(marketing)/dream-deferred/page.tsx`) | *Provisional* — zero implementation exists; only a one-line placeholder in `initiatives.ts`'s `futureInitiatives` ("A future Marked Minds initiative currently in early development") |
| **Primary audience** | Schools, families, organizations, partners (Confirmed) | Experienced professionals facing a career transition, drawn partly from the Dream Deferred community (Confirmed — the live page states this directly) | K–12 educators planning instruction (Confirmed, `PLANNER_PRODUCT_CONTRACT.md`) | Rising 2nd–7th graders and their families, South Metro Atlanta (Confirmed, `academy.ts`) | Adults interested in storytelling about ambition, identity, and becoming (Confirmed) | *Provisional* — no audience defined anywhere yet |
| **Brand personality** | Editorial, multidisciplinary, credible (Confirmed, `BRAND_GUIDE.md` positioning) | Precise, discerning, adult, a little unsentimental about its own name ("ruthless") balanced by real warmth in the founder-story section (Confirmed from live copy) | Organized, supportive, quietly structured (Confirmed from `/plan` copy and the understated `PlannerBrand` lockup) | Kinetic, encouraging, youthful (Confirmed from copy: "Learn. Grow. Create. Thrive.") | Reflective, cinematic, intimate (Confirmed from copy and live imagery — see below) | *Provisional* |
| **Emotional outcome** | Trust | Clarity and relief ("Clarity you can act on") | Reduced planning burden | Confidence and belonging | Recognition / being understood | *Provisional* |
| **Visual world (today, confirmed)** | Ink/mist/white, Signature Orange as primary color, Bricolage Grotesque display + Geist body | **Currently identical to Marked Minds core** — `bg-ink`, `text-brand-orange`, no distinct palette (confirmed by direct grep of `src/app/ruthless-scout/page.tsx` — every color class is a core token) | **Currently identical to Marked Minds core** — same tokens, confirmed in `planner-navigation.tsx` and `planner/layout.tsx` | Core palette + `academy-purple` (`#6b46c1`/`#55348f`), scoped via `.academy-scope` in CSS — the one brand with real visual independence today | **Currently identical to Marked Minds core** — confirmed by grep of the live page, zero distinct color classes | None exists |
| **Primary accent (direction)** | Signature Orange `#ff7700` — Marked Minds' primary color (Confirmed) | **Lime — provisional, requires approval** (§6) | *Provisional* (§6) | Purple `#6b46c1` (**Confirmed**, exclusively scoped per `BRAND_GUIDE.md`) | *Provisional* (§6) | **Cadet Blue — provisional, requires approval** (§6); Signature Orange as secondary accent/family marker |
| **Supporting colors** | Ink, charcoal, silver, mist, white (Confirmed) | Cyan reserved for data, scanning, and selected status functions (provisional); ink/charcoal retained as neutral base | TBD — likely retains ink/charcoal/mist as neutral base, needs its own accent before supporting colors make sense | Purple-dark `#55348f`, ink/charcoal/mist as neutrals (Confirmed) | Electric blue/periwinkle (primary accent); golden yellow, violet/lilac, and selective green (secondary highlights); ink/black, warm cream, and white (neutral foundation) — see §6 | Charcoal, bone, and black as neutrals, with Signature Orange appearing through stitching, edition marks, interior labels, tags, or small digital details (§6) |
| **Typography direction** | Bricolage Grotesque (display) + Geist (body) — the only two typefaces currently loaded anywhere in the codebase (Confirmed, `src/app/layout.tsx`) | Shares the two core faces today; provisional direction in §9 | Shares the two core faces today; provisional direction in §9 | Shares the two core faces today (no distinct type currently) | Shares the two core faces today | No typeface chosen |
| **Layout behavior** | Standard marketing page patterns (`PageHero`, `SectionHeading`, alternating `bg-white`/`bg-mist` sections) | Currently the same pattern, but with a distinct "device"-style panel in the hero (the scored opportunity-cards mock) — a genuine, if accidental, step toward its own visual language | App-shell pattern: fixed sidebar + mobile bottom nav, already structurally distinct from the marketing pages (Confirmed, `planner/layout.tsx`) | Standard marketing pattern + the `.academy-scope` purple override | Standard marketing pattern | TBD |
| **Imagery direction** | Real photography of real people/programs only — no stock, no AI-generated people (Confirmed site-wide convention, enforced throughout this engagement's history) | Currently reuses the Marked Minds founder portrait (`founder-dani-marked-minds-portrait.webp`) framed as "Built from lived experience" — works narratively since Dani *is* the founder-story, but means Ruthless Scout has no imagery of its own yet | None yet — pre-launch | Real session photography (`public/images/focus-flex/*`) (Confirmed) | Real event/studio photography (`public/images/dream-deferred/*`) (Confirmed) | None |
| **Voice** | Confident, editorial (Confirmed) | Direct, unsentimental, occasionally blunt ("ruthless" is doing real work in the name) | Calm, practical | Warm, encouraging | Reflective, literary | *Provisional* |
| **Marked Minds endorsement level (recommended)** | N/A — this *is* Marked Minds | Quiet endorsement (§11) | Strong endorsement — it's already named "MAPS **by Marked Minds**" | Quiet endorsement — already uses `AcademyBadge` pattern | Quiet endorsement | Ownership-only reference |
| **Elements that must remain unique** | — | Its own accent (lime/cyan), its own imagery once it exists, the Jameson/Scout character system (§8) | Its own accent, its distinct app-shell layout (already structurally different — preserve this) | Purple (already protected by explicit rule in `BRAND_GUIDE.md`) | Its own accent, its cinematic/editorial imagery treatment | Its tactile, fragment-based visual language (§7) |

## 6a. Why Black2SchoolMVMT is not in the portfolio

**Black2SchoolMVMT is not owned by Marked Minds and is not a Marked Minds
subsidiary, product, program, or portfolio brand.** It was — and is
described in the codebase as — an external partnership in which Marked
Minds participated. It does not appear in the table above, is not
assigned an accent color, does not receive a "By Marked Minds" treatment,
and is not part of any portfolio-separation or endorsement-level work in
this document.

See §16 for the full treatment of this relationship, including the
audit requested of the existing Black2School implementation.

## 6. Initial Accent-Color Direction

| Brand | Direction | Status |
|---|---|---|
| Marked Minds | **Signature Orange**, `#ff7700` — the parent brand's primary color, not merely an accent | **Confirmed** — `docs/BRAND_GUIDE.md`, `globals.css` |
| Focus + FLEX Academy | Purple, `#6b46c1` / `#55348f` dark | **Confirmed**, implemented, and explicitly protected ("Purple must never appear as a general Marked Minds brand color" — `BRAND_GUIDE.md`) |
| Ruthless Scout | Lime (primary); cyan reserved for data, scanning, and selected status functions | **Recommended, requires Dani's approval** — nothing currently implemented; exact hex values not yet chosen (see below) |
| Remnants Label | **Cadet Blue (primary)**; Signature Orange as secondary accent and family marker | **Recommended, requires Dani's approval** — nothing currently implemented; exact Cadet Blue hex not yet chosen (see below) |

### Ruthless Scout: lime + cyan rationale

- **Why lime:** Ruthless Scout's existing copy and visual metaphor (radar,
  scanning, "opportunity survived the gates," score bars, a "Scout
  online" status badge — all already present in the live page) is
  fundamentally about *signal detection*. Lime is a genuine
  scanning/active-system color in a way Signature Orange (already Marked
  Minds' own primary) and purple (already Focus + FLEX's) are not. It
  also reads distinctly adult and precise rather than playful, which fits
  a career-transition product aimed at experienced professionals.
- **Why it differs from its neighbors:** Purple is Focus + FLEX's
  (youth-facing); Signature Orange is Marked Minds' own. Lime shares no
  relationship to either, which is the point — Ruthless Scout currently
  has zero visual distinction from Marked Minds core (§12), and lime is
  as far from "looks like a reskinned homepage" as the existing
  orange/purple pairing allows.
- **Why cyan is reserved for data, scanning, and selected status
  functions, not the brand's dominant hue:** Cyan reads as data/status/
  telemetry (consistent with the score bars and "survived the gates"
  scoring already in the live UI), which makes it correct for small,
  functional accents (a status pill, a live score number) rather than
  the brand's dominant color. Making cyan primary would also risk
  reading as generic SaaS/fintech, which the brief explicitly warns
  against.
- **Accessibility/contrast:** Not yet checked against real hex values
  because none exist yet. **Any specific lime/cyan hex must be run
  through a real contrast check against both `--color-mm-black` (current
  dark-section background) and white before implementation** — lime in
  particular tends to fail contrast against white at normal text sizes,
  which may mean lime is better suited to backgrounds, borders, and large
  display type than body text or small UI labels. This is a concrete,
  testable requirement for Phase 2 (§13), not something this document can
  resolve by picking a hex code.
- **No hex values are assigned here.** Choosing exact values without a
  real design pass and contrast testing would be exactly the kind of
  "arbitrary trend-based selection" the brief warns against. Flagged in
  §14 as requiring Dani's approval at the *direction* level now, and a
  separate design pass before implementation.

### MAPS, Dream Deferred: proposed, not finalized

| Brand | Proposed direction | Rationale | Differs from neighbors by | Open question |
|---|---|---|---|---|
| MAPS by Marked Minds | **Cobalt or clear blue — explicitly not teal** | MAPS is explicitly a planning/navigation tool (the name itself — maps, routes, wayfinding) for educators; a clean cobalt/clear blue reads as organized and trustworthy without competing with Focus + FLEX's purple | A true blue (not teal) avoids colliding with Ruthless Scout's cyan, *and* — now that Remnants is directionally Cadet Blue (a muted, grayed teal-blue, see below) — must also stay clearly apart from that, which is the specific reason teal is ruled out here rather than just discouraged: teal sits in exactly the territory both of MAPS's two blue-family neighbors already occupy | Needs a real side-by-side comparison against both Ruthless Scout's cyan and Remnants' Cadet Blue before a final hex is chosen — three blue-family colors in one portfolio only works if they're deliberately pushed apart |
| Dream Deferred | **Coral (primary brand color) — see the dedicated rationale below; not a blue/teal-family color, so no collision risk with MAPS/Ruthless Scout/Remnants** | Revised after reviewing the existing podcast artwork directly — Dream Deferred already has real brand equity in coral, and the correct move is to preserve it, not replace it with a new hue picked for portfolio-spacing reasons alone | Distinct from every other brand's color direction in this document by construction — it's the one accent chosen from *existing* identity rather than assigned fresh | See the dedicated subsection below — several open questions, starting with sourcing a real high-resolution reference asset |

Signature Orange may remain present as a secondary accent/family marker
(per §3) even where another color is a brand's primary — e.g., MAPS could
use cobalt as its dominant color while the endorsement lockup itself
carries a small orange dot, exactly as `Logo`'s `invert` variant already
does for Marked Minds' own dark-context mark.

### Dream Deferred: coral-led hierarchy rationale

**Revised from this document's earlier garnet/deep-red direction after
reviewing the existing podcast artwork directly.** The earlier direction
was chosen to maximize distance from every other brand's color on a color
wheel — a reasonable instinct in the abstract, but wrong here because it
ignored that Dream Deferred already has a real, existing visual identity
to preserve rather than invent from scratch.

**Provisional hierarchy** (all provisional, requires Dani's approval):

| Role | Color direction |
|---|---|
| Primary brand color | **Coral** |
| Primary accent | **Electric blue / periwinkle** |
| Secondary highlights | Golden yellow, violet/lilac, and selective green |
| Neutral foundation | Ink/black, warm cream, and white |
| Marked Minds Signature Orange | Restrained family endorsement only — **not** a Dream Deferred lead color |

**Why coral, not garnet:** coral preserves Dream Deferred's existing
brand equity and communicates warmth, individuality, cultural energy,
reflection, and possibility — all qualities already present in how the
brand has been described throughout this document (§5, §7) and in its
own copy. Deep red/garnet would shift the brand toward a heavier, more
formal tone that the original identity doesn't support. Keeping coral
also means Dream Deferred's color story is the one case in this entire
document built from *existing* equity rather than assigned to create
portfolio distance — which is arguably the more important job this
document has for a brand with real history, versus a brand (like
Remnants) being designed from nothing.

**On the specific hex value — not yet confirmed:** a coral around
**`#E97155`** is the approximate dominant color extracted from the
existing, compressed podcast artwork. **This is explicitly not ratified
as a final production value.** It was derived from a compressed asset,
and the original logo or a highest-resolution cover-art file needs to be
located first — compression artifacts and color-profile shifts can move
a measured hex meaningfully from the true source color. I checked the two
Dream Deferred images currently in this repository
(`public/images/dream-deferred/dream-deferred-podcast-host-studio.webp`,
`dream-deferred-live-event.webp`) and neither is the podcast cover art or
logo this finding is based on — so this hex is documented here as a
reported finding with known provenance, not something I independently
verified against a source file I have access to. Finding and confirming
against the real highest-resolution asset is a concrete prerequisite
before implementation, not a formality.

**Electric blue/periwinkle as primary accent, paired with coral:** this
pairing (warm coral against a cooler blue-violet) is a classic
complementary-adjacent relationship that supports "cultural energy" and
"possibility" without competing with any other brand's blue-family
color — periwinkle sits closer to violet than true blue, keeping it
clearly apart from MAPS's cobalt, Ruthless Scout's cyan, and Remnants'
Cadet Blue. Golden yellow, violet/lilac, and selective green round out a
richer secondary palette than most of this portfolio's other brands have
been given — appropriate for a storytelling/cultural platform where a
single accent pair would likely feel thin against its own stated
personality (reflective, cinematic, intimate, but also energetic).

**Typography pairing, revised:** the editorial-serif recommendation
(§9) stands, but should be paired with expressive handwritten or drawn
elements inspired by the original artwork — not presented as a purely
formal literary system. A coral-led, cross-media (podcast + live event)
cultural brand calls for something with more hand-made warmth than a
serif alone would communicate; the serif can still do the "editorial"
work while a complementary hand-drawn/script element carries the
"cultural energy" the pure formal direction would have underserved.

### Remnants Label: Cadet Blue + Signature Orange rationale

- **Cadet Blue leads; Signature Orange is secondary and a family
  marker.** This is the one brand in the portfolio where Signature
  Orange is explicitly *not* the primary accent — it appears instead
  through fashion-specific details: stitching, edition marks, interior
  labels, tags, or small digital details. Cadet Blue leads Remnants'
  digital identity, packaging details, labels, and supporting visual
  system.
- **Proposed range, not a final value:** "Cadet Blue" as a named color
  traditionally sits in muted teal-blue territory (the standard web
  color `cadetblue` is `#5F9EA0`, itself fairly close to teal). Given
  this portfolio is actively trying to keep its blue-family colors
  distinct (MAPS's cobalt/clear-blue direction above, Ruthless Scout's
  cyan secondary), Remnants' Cadet Blue should lean **duller and
  grayer** than the standard web color — a genuinely muted, "cadet
  cloth" slate-blue rather than a bright teal — roughly in the
  **`#4F7B86`–`#5E8C96` region** as a starting range, not a chosen
  value. This needs the same side-by-side comparison against MAPS and
  Ruthless Scout called for above before anything is finalized.
- **Why this range should work with the rest of Remnants' palette:** at
  a muted, mid-value blue in that range, contrast against both a dark
  near-black and a light bone/cream neutral should be achievable at
  normal UI sizes — but this is a direction to test, not a confirmed
  result. **A real WCAG contrast check (4.5:1 for body text, 3:1 for
  large text/UI elements) against charcoal (`#232326`), bone (a warm
  off-white neutral — new to this portfolio, distinct from the site's
  own cooler "mist" `#f6f6f7`, and not yet defined as a token anywhere),
  black (`#0a0a0b`), and Signature Orange (`#ff7700`) must happen before
  any value is locked.**
- **No final hex is assigned here**, per instruction — direction and
  range only. Flagged in §14 as requiring Dani's approval at the
  direction level, with the final value deferred to a real design pass.

## 7. Individual Brand Direction

### Marked Minds

`BRAND_GUIDE.md`'s existing positioning — "editorial, intelligent,
multidisciplinary creative studio" — remains the confirmed source of
truth and isn't restated here as a document-of-record. This document
additionally proposes an updated framing, specifically for its role as
parent of a five-brand portfolio (six family members including the
parent itself):

> "Marked Minds is a creative venture studio building tools, experiences
> and brands for how people learn, work, create and become."

**Proposed, requires Dani's final approval — not yet adopted.** "Venture
studio" is doing specific work here: it signals that Marked Minds builds
and houses distinct products/brands (which it now demonstrably does —
five of them, making six family members in total with the parent
included), without committing to "education" as the lead word when three
of those five brands (Ruthless Scout, Dream Deferred, Remnants Label)
aren't education at all — even though the other two (Focus + FLEX
Academy, MAPS) genuinely are. It should feel expansive enough to
credibly stand behind very different products (a career-intelligence
tool, a youth enrichment program, a storytelling platform, a fashion
label) without absorbing any of them into its own visual language. This
is the central discipline this whole document exists to protect: Marked
Minds' job is to be a trustworthy *parent*, not the loudest voice in
every room.

### Ruthless Scout

Position as **career intelligence combined with human discernment** —
already well-expressed in the live copy ("You make the call... It does
not apply, contact employers, or make life-changing decisions for you").

Visual language, building on what's *already* organically present in the
live page (radar icon, scanning-style opportunity cards, score bars,
"Scout online" status) rather than inventing from scratch:

- Radar, coordinates, scanning, field notes, decision gates, signals,
  precision
- Dark surfaces (already true — the hero and founding-pilot sections are
  `bg-ink`)
- Lime highlights, cyan data/status information
- Selective amber and red alerts (for risk/caution states — not yet
  needed anywhere in the current copy, but worth reserving now rather
  than improvising later)

It should feel sophisticated, decisive, and human — not militaristic,
dystopian, gimmicky, or like generic SaaS. The existing FAQ copy already
protects this well ("Ruthless Scout provides research, education, and
decision support... no ethical career service can promise an interview or
offer") — that restraint should extend to the visual language too.

Preserve, verbatim: **"Your next move should fit your life—not just your
résumé."** (Confirmed live headline, `ruthless-scout.ts`.)

### MAPS by Marked Minds

Position as a **structured, supportive planning and navigation system for
educators**. The existing implementation already gets the *tone* right —
calm, understated, "Planning workflows are not active yet" is an honest,
unhyped way to describe a pre-launch product — but has no visual identity
of its own yet (§12).

It should feel organized, useful, and human — not childish, bureaucratic,
or like Ruthless Scout with lighter colors (a real risk if MAPS ends up
with a cool-toned accent chosen without deliberately differentiating it
from lime/cyan).

Explore modular routes, planning blocks, pathways, and wayfinding — the
name itself is the brief.

### Focus + FLEX Academy

Position as **kinetic, youthful, exploratory, and collaborative** — this
is the one brand in the portfolio that already has a real, protected,
independent visual identity (purple), and the existing rule in
`BRAND_GUIDE.md` ("Purple must never appear as a general Marked Minds
brand color") should remain exactly as strict as it is today.

It should feel energetic and imaginative without becoming chaotic or
juvenile — the current implementation's restraint (purple as accent only,
not as a wholesale youth-coded redesign with different fonts/illustration
style) is worth preserving as the model for how a brand can be
*independent* without needing to diverge on every dimension at once.

### Dream Deferred

Position as **cinematic, reflective, culturally aware, and editorial** —
and, per the coral-led color direction above (§6), also warm, individual,
and energetic rather than only reflective. The identity should support
intimate storytelling, audio, portraiture, lived experience, and
becoming. It should not look like a corporate product dashboard — a real
risk today, since its current implementation shares literally every
visual token with Marked Minds core and nothing in its presentation
currently signals "storytelling platform" versus "marketing page."

Visual language should build from the brand's *existing* equity (coral,
per the artwork reviewed in §6) rather than a fresh assignment — this is
the one brand in the portfolio where preservation, not invention, is the
right instinct. Typography should pair an editorial serif with expressive
handwritten or drawn elements inspired by the original artwork, so the
result reads as a real cultural identity rather than a purely formal
literary system.

### Remnants Label

Position as an **independent fashion label** with a controlled, tactile,
fragment-based visual language. Orange can operate through stitching,
tags, edition marks, labels, or restrained focal details — i.e., orange
as material detail, not orange as a dominant brand wash.

It should not look like a Marked Minds education initiative. Given
Remnants currently has zero implementation (confirmed: a single
"Coming Soon" line in `initiatives.ts`, no route, no component, no
asset), this is the brand with the most design freedom and the least
existing work to protect or contradict.

## 8. Ruthless Scout Mascot System

**Entirely new — nothing resembling this exists in the codebase today.**
No "Jameson," "Scout," dog, or mascot concept appears anywhere in
`src/lib/data/ruthless-scout.ts` or the live page. This is a from-scratch
proposal requiring full approval before any implementation.

Document **Jameson** as a possible supporting character — "Scout,"
"Jameson," or "Jameson — the original Scout."

Jameson must **not** become:

- The primary Ruthless Scout logo
- The dominant hero image
- A source of excessive dog puns
- A pet-industry visual signal
- A reason users could mistake Ruthless Scout for a dog-search platform

Recommended uses: onboarding, empty states, scouting/loading states,
"Scout's Note" explanations, encouragement, strong-opportunity alerts,
occasional social content, pilot badges or merchandise, a restrained
animated product moment.

Visual direction: a sophisticated graphic character rather than a
childish cartoon; recognizable silhouette and alert posture; orange field
bandana or utility collar (the one place orange-as-family-marker could
appear inside Ruthless Scout's otherwise lime/cyan world); optional
lime/cyan scouting signal; a trusted field companion rather than a
product mascot dominating the system.

Provisional introduction copy (not live anywhere, not approved):

> "Meet Jameson—the original Scout. Curious enough to search. Disciplined
> enough to stop. Loyal enough to care whether the opportunity is
> actually right for you."

## 9. Typography Architecture

**Confirmed, repo-wide:** exactly two typefaces are loaded anywhere in
this codebase — **Bricolage Grotesque** (display/headings, loaded as
`--font-bricolage`) and **Geist** (body, `--font-geist-sans`), both via
`next/font/google` in `src/app/layout.tsx`. No other font family exists
in `package.json`, `globals.css`, or any component. Every brand today,
without exception, inherits these two faces.

This document does **not** force one font family across the whole
portfolio going forward, but any change is new production work (adding
and loading an actual font), not a documentation decision — every
recommendation below is provisional and requires both Dani's approval and
a real licensing/production check before use.

| Brand | Desired character | Currently using | Conflict? | Recommendation (provisional) |
|---|---|---|---|---|
| Marked Minds | Editorial, confident display + clean body | Bricolage Grotesque + Geist | — | Keep as-is (Confirmed, permanent per `BRAND_GUIDE.md`) |
| Ruthless Scout | Precision, a monospaced or utility feel would reinforce the "data/scanning" visual language | Bricolage Grotesque + Geist (identical to core) | Yes — no typographic distinction from Marked Minds at all | A monospaced utility face for small data labels/scores only (e.g., the score numbers, "Scout online" status) — keep Bricolage Grotesque for headlines so it doesn't lose all family resemblance at once |
| MAPS | Humanist sans, calm and legible — this is a planning tool used under time pressure, not a place for a display face to work hard | Bricolage Grotesque + Geist (identical to core) | Mild — works fine today since MAPS's distinction currently comes from its app-shell layout, not type | No urgent change needed; if MAPS gets a dedicated display moment later (a dashboard headline), consider a slightly more condensed/utility-leaning display face |
| Focus + FLEX Academy | Kinetic, friendly, still display-worthy | Bricolage Grotesque + Geist | None — already works well | Keep as-is |
| Dream Deferred | Editorial serif would reinforce "cinematic/literary," paired with expressive handwritten/drawn elements inspired by the original artwork so the result doesn't read as purely formal | Bricolage Grotesque + Geist (identical to core) | Yes — this is the brand where the typographic mismatch is most noticeable against its stated personality | **Recommended as the first brand in the portfolio to introduce a new typeface** — a real editorial serif for display text (body stays Geist for legibility), paired with a hand-drawn/script accent element — biggest typography opportunity in the whole portfolio |
| Remnants Label | Fashion grotesk — tighter, more condensed, more "label copy" than "marketing headline" | None (doesn't exist yet) | N/A | A condensed grotesque distinct from Bricolage Grotesque's warmer, rounder editorial character |

Favor accessible, licensable, production-appropriate choices (e.g., real
Google Fonts loadable via `next/font/google`, matching the existing
loading pattern) over anything requiring a paid license or manual font
file hosting, unless Dani explicitly wants to invest in a licensed face
for a specific brand.

## 10. Layout and Component Rules

What a shared component means in this codebase, concretely: `Button`
(`src/components/ui/button.tsx`) already supports this pattern today —
it's a single implementation with a `variant` prop (`default`, `orange`,
`academy`, `academy-outline`, `outline-inverse`, etc.) that changes color
without changing behavior, accessibility, or markup. This is the model to
extend, not a new pattern to invent: a future `variant="scout"` or
`variant="maps"` is a small, additive change to one file, not a
duplicated component.

**Shared code infrastructure** (one implementation, reused everywhere):
`Button`, `Badge`, `PageHero`, `SectionHeading`, `AnimatedSection`,
form primitives (`Input`, `Label`, `Textarea`), the honeypot spam-guard
pattern. These should stay shared — duplicating them per-brand would be
exactly the kind of wasted effort the brief warns against ("Do not
recommend duplicating entire applications solely to create visual
distinction").

**Shared accessibility behavior:** focus-visible states, semantic heading
order, `aria-hidden` on decorative elements, reduced-motion handling —
all currently implemented once, in shared components or `globals.css`,
and inherited by every brand automatically. This must never be
reimplemented per-brand; a brand-specific visual variant of `Button`
should never lose the accessibility behavior the shared implementation
already provides.

**Brand-specific visual expression:** color (via CSS custom properties,
following the existing `--color-academy-purple` pattern exactly), type
choice (per §9, once/if approved), spacing density, radius, border
behavior, motion character, iconography set, and content density.

A shared component must be capable of receiving brand-specific:

- Tokens (color, following the `.academy-scope` CSS-scoping pattern
  already proven in `globals.css`)
- Type (once §9 is resolved)
- Spacing / radius / border behavior
- Motion (e.g., Ruthless Scout's "scanning" micro-interactions could be a
  distinct motion signature without a different component)
- Iconography (Ruthless Scout already uses a distinct icon *selection* —
  `Radar`, `Compass`, `ShieldCheck` — within the same shared icon-map
  infrastructure, `src/lib/icon-map.tsx` — this is already the right
  pattern, just not yet paired with a distinct color)
- Color and content density

**Do not duplicate entire applications or page templates solely to
create visual distinction.** MAPS's app-shell layout is a legitimate
exception — it's structurally different (fixed sidebar, bottom nav) *for
a real product reason* (it's an application, not a marketing page), not
as a brand-distinction exercise.

## 11. Endorsement System

**"By Marked Minds" placement**, per the brief: launch screens, about
sections, footers, press materials, legal/ownership references,
cross-brand portfolio pages. It should remain visually secondary to the
individual brand name — the existing `PlannerBrand` component already
demonstrates this correctly (MAPS large and bold, "by Marked Minds"
small, muted, beneath it).

Three endorsement levels:

1. **Strong endorsement** — the parent name appears prominently,
   consistently, near the brand name itself. Appropriate when the
   product is explicitly a Marked Minds extension rather than its own
   standalone brand voice.
2. **Quiet endorsement** — the parent appears once, predictably (e.g.,
   footer, about section, metadata), but the brand otherwise speaks
   entirely in its own voice. This is the default for most of the
   portfolio.
3. **Ownership-only reference** — the parent relationship is documented
   (e.g., in legal copy, a press kit, or this document) but essentially
   invisible in the product experience itself. Appropriate for a brand
   meant to stand almost entirely on its own, like Remnants Label.

| Brand | Recommended level | Why |
|---|---|---|
| Ruthless Scout | Quiet endorsement | Already uses this today ("Ruthless Scout by Marked Minds" in metadata, a single mention) — keep it understated as the brand gets its own visual identity, so it doesn't read as "a Marked Minds feature" rather than its own product |
| MAPS by Marked Minds | Strong endorsement | Already named this way; the product name itself carries the endorsement, so this is as much a confirmed fact as a recommendation |
| Focus + FLEX Academy | Quiet endorsement | Already the pattern — `AcademyBadge` is the one sanctioned cross-brand reference; the Academy otherwise speaks in its own voice/color on its own pages |
| Dream Deferred | Quiet endorsement | Matches its current single-mention pattern ("born from the original Marked Minds vision") |
| Remnants Label | Ownership-only reference | A fashion label benefits from standing furthest apart — per the brief's own instruction, "It should not look like a Marked Minds education initiative" |

## 12. Brand Collision Audit

This is the section with the most direct, uncomfortable evidence — and
the clearest case for why this document exists.

- **Font repetition:** Every single brand in the portfolio, without
  exception, currently loads only Bricolage Grotesque + Geist (§9). This
  alone isn't necessarily wrong (shared type can still read as a family
  trait), but combined with the findings below, it compounds the problem.
- **Repeated dark backgrounds + identical accent color:** Ruthless
  Scout's hero (`src/app/ruthless-scout/page.tsx`), founding-pilot panel,
  and closing deliverables section are all `bg-ink` with `brand-orange`
  accents — **textually identical color classes** to Marked Minds core
  marketing pages. Dream Deferred (`src/app/(marketing)/dream-deferred/page.tsx`)
  and MAPS (`planner-navigation.tsx`, `planner/layout.tsx`) show the same
  pattern: confirmed by direct grep, zero distinct color classes in
  either file.
- **Orange overuse:** Because three of six brands (Marked Minds,
  Ruthless Scout, Dream Deferred) currently use `brand-orange` as their
  *only* accent, orange is doing far more identity work across the
  portfolio than a single family-marker color should. This is the
  single most important number in this audit: **orange is currently the
  primary accent of half the family.**
- **Shared landing-page layouts:** Ruthless Scout and Dream Deferred both
  follow the identical `PageHero`-less, custom-hero-section-then-
  alternating-bg-white/bg-mist pattern used everywhere else on the
  marketing site. Not wrong in itself (§10 — shared layout grammar is
  fine) but combined with identical color, the result is pages that
  differ only in copy.
- **Identical cards and buttons:** Confirmed — both pages use the same
  `Button` variants (`orange`, `outline-inverse`) and the same card
  border/radius treatment (`rounded-2xl border border-ink/8`) as
  Marked Minds core marketing pages.
- **Audience distinction exists in copy, not in visual design:** The
  *writing* for Ruthless Scout, Dream Deferred, and MAPS is already
  distinct and well-differentiated (confirmed by reading each — Ruthless
  Scout is direct and adult, Dream Deferred is reflective, MAPS is calm
  and practical). The visual design has not caught up to what the copy
  already knows about its own audience.
- **Endorsement is inconsistent:** MAPS states its endorsement in its own
  name; Focus + FLEX uses a dedicated badge component; Ruthless Scout and
  Dream Deferred mention Marked Minds only in prose/metadata, with no
  consistent visual pattern. Worth standardizing per §11, not because the
  current approach is wrong, but because it's currently accidental rather
  than decided.
- **Imagery is currently borrowed, not brand-specific:** Ruthless Scout
  reuses the founder portrait; MAPS and Remnants have no imagery at all
  yet. Only Focus + FLEX, Dream Deferred, and Marked Minds core have real,
  brand-specific photography today.

**Net finding:** Focus + FLEX Academy is the only brand in the portfolio
with genuine, protected visual independence today. Every other brand is
either identical to Marked Minds core (Ruthless Scout, MAPS, Dream
Deferred) or doesn't exist yet (Remnants). This document's job is to fix
exactly that gap — deliberately, not by accident, and not all at once.

## 13. Implementation Roadmap

### Phase 1 — Ratify Architecture

- Approve shared family DNA (§3)
- Approve brand roles (§5, §7)
- Approve accent-color directions (§6)
- Approve endorsement levels (§11)
- Resolve the Marked Minds positioning conflict noted at the top of this
  document (education-technology framing vs. `BRAND_GUIDE.md`'s existing
  rule) — doing this first matters, since the parent's own identity
  shapes how "quiet endorsement" should read everywhere else

### Phase 2 — Ruthless Scout Pilot Identity

- Establish lime-first identity (real hex values, contrast-tested)
- Retain cyan for data/status only
- Define typography (§9's monospace-for-data-only recommendation, or an
  alternative)
- Define radar and field-note visual language (building on what's
  already live, per §7)
- Create Jameson/Scout character rules (§8) — only after the above is
  settled, since a mascot without a settled brand world to live in will
  end up carrying more identity weight than intended
- Separate the app's own presentation from the Marked Minds marketing
  page template (currently shares `PageHero`-less custom sections with
  the rest of the site — this is the first real test of §10's
  shared-infrastructure/brand-specific-expression split)

### Phase 3 — Portfolio Separation

- MAPS (cobalt/clear blue direction — explicitly not teal, §6)
- Focus + FLEX (already largely done — verify nothing has drifted since
  `BRAND_GUIDE.md` was written)
- Dream Deferred (first brand recommended for new typography — editorial
  serif + handwritten/drawn accent, §9; coral-led color hierarchy, §6 —
  but **blocked on locating the original/highest-resolution podcast
  artwork** before any hex is finalized)
- Remnants (full identity from scratch — the brand with the most
  freedom and the least existing work to reconcile)
- Reconcile `src/lib/data/initiatives.ts` against this document's
  five-brand portfolio (it currently omits Ruthless Scout and MAPS
  entirely, and includes "Consulting + Strategy" which isn't in this
  document's scope — worth a separate, explicit decision about whether
  that's a seventh family member or a Marked-Minds-core service line)

### Phase 4 — Shared Technical Tokens

- Build brand-aware tokens, extending the exact pattern already proven
  by `--color-academy-purple` / `.academy-scope` — this is not a new
  architecture to invent, just one to repeat per brand
- Create theme mappings
- Refactor shared components (starting with `Button`'s `variant` prop,
  per §10) only after identity directions are approved — not before

### Phase 5 — Governance

- Adopt §15's design review checklist as a real step before shipping new
  brand work
- Define ownership (who approves a new brand's identity before it ships)
- Establish the process for adding a future seventh brand: start from
  this document's template (§5's table columns), not from a blank page

## 14. Approval Matrix

| Decision | Current status | Evidence | Recommendation | Dani approval required? | Implementation dependency |
|---|---|---|---|---|---|
| Endorsed-brand architecture (§2) | Proposed | §12 audit | Adopt | **Yes** | Blocks Phases 2–5 |
| Signature Orange `#ff7700` as Marked Minds' primary color, and shared family color elsewhere with varying prominence | Confirmed as Marked Minds' own color; *recommendation* is new (the varying-prominence usage model across the portfolio) | `globals.css`, `BRAND_GUIDE.md` | Adopt the "primary for Marked Minds, secondary/family-marker elsewhere" usage model | **Yes**, for the usage model specifically | None — doesn't block anything |
| Ruthless Scout lime (primary) | Provisional, no hex chosen | `ruthless-scout.ts`, live page (confirmed zero existing lime anywhere) | Adopt direction; defer hex to design pass | **Yes** | Blocks Phase 2 |
| Ruthless Scout cyan (reserved for data, scanning, and selected status functions) | Provisional | Same | Adopt direction; defer hex to design pass | **Yes** | Blocks Phase 2 |
| Focus + FLEX purple `#6b46c1` | **Confirmed, already implemented and protected** | `globals.css`, `BRAND_GUIDE.md` | No action — preserve exactly as-is | No (already decided) | None |
| Dream Deferred coral-led hierarchy (primary: coral; accent: electric blue/periwinkle; highlights: golden yellow, violet/lilac, selective green) | Provisional direction confirmed by Dani from existing artwork; exact coral hex (~`#E97155`) explicitly not ratified | Existing podcast artwork (compressed; original/high-res source not yet located) | Adopt hierarchy; locate real source asset before finalizing hex | **Yes**, direction + final hex both need approval | Blocks Phase 3 |
| MAPS accent (cobalt/clear blue — not teal) | Provisional, no hex chosen | None — confirmed zero existing accent | Adopt direction; defer hex to design pass; test against Ruthless Scout cyan and Remnants Cadet Blue | **Yes** | Blocks Phase 3 |
| Remnants Cadet Blue (primary) | Provisional, range only (`#4F7B86`–`#5E8C96` direction, not final) | None — confirmed zero existing accent | Adopt direction; contrast-test against charcoal, bone, black, Signature Orange before finalizing | **Yes** | Blocks Phase 3 |
| Remnants Signature Orange (secondary/family marker via fashion details) | Provisional | §3, §6 | Adopt — stitching, edition marks, interior labels, tags, small digital details only, never a dominant wash | **Yes** | Blocks Phase 3 |
| Typography families (§9) | Confirmed: only Bricolage Grotesque + Geist exist today; all per-brand recommendations are new | `layout.tsx`, `package.json` | Adopt Dream Deferred serif as highest priority; others lower urgency | **Yes**, per brand | Blocks any typography work in Phase 3 |
| "By Marked Minds" lockup (§11) | Confirmed pattern exists (`PlannerBrand`); not yet applied consistently elsewhere | `planner-navigation.tsx` | Standardize per the endorsement-level table | **Yes**, for consistency rollout | Low — mostly copy/placement, not new engineering |
| Jameson/Scout character (§8) | Entirely new, zero precedent | Confirmed absent from codebase | Adopt direction; do not implement before Phase 2's base identity is settled | **Yes** | Blocks Phase 2's final step only |
| Shared mark-making device (§3) | Entirely new, zero precedent | Confirmed absent from codebase | Needs a real design exploration, not a decision made in this document | **Yes**, and needs a design pass first | Blocks nothing yet — purely additive whenever it's ready |
| Marked Minds positioning: "creative studio" (`BRAND_GUIDE.md`) vs. "education technology company" (live `site.ts`) | **Unresolved conflict**, not caused by this document | `BRAND_GUIDE.md` §"What Not To Do"; `site.ts` commit `d13da44` | Resolve before Phase 1 is considered complete | **Yes — this one blocks everything else** | Blocks Phase 1 |

## 15. Design Review Checklist

Run before approving any future brand-specific design work:

- [ ] Does this clearly belong to the correct individual brand?
- [ ] Could the logo be removed and the brand still be recognizable?
- [ ] Does it share family DNA (§3) without copying another brand's
      specific expression of that DNA?
- [ ] Is the individual accent color doing meaningful work — or is it
      decorative only?
- [ ] Is Marked Minds appropriately visible but not overpowering, per
      this brand's assigned endorsement level (§11)?
- [ ] Is the audience obvious within the first screen?
- [ ] Are typography and layout appropriate to this brand specifically,
      not just "whatever the shared components default to"?
- [ ] Is the experience accessible — focus states, heading order, alt
      text, contrast, reduced motion — at the same standard as the rest
      of the site?
- [ ] Is the design borrowing too much from another portfolio brand
      (same accent, same layout, same imagery treatment)?
- [ ] Does it feel intentional rather than merely coordinated?

---

## 16. External Partnerships and Collaborations

This section exists specifically to house relationships that are **not**
part of the Marked Minds brand family, so that project history doesn't
get mistaken for brand ownership.

### Black2SchoolMVMT

**Black2SchoolMVMT was external partnership work involving Marked Minds.
Its inclusion in project history does not indicate ownership,
brand-family membership, or intellectual-property control by Marked
Minds.**

**General rule going forward:** Collaborative projects may demonstrate
Marked Minds' capabilities, but they do not enter the Marked Minds brand
portfolio unless ownership, licensing, and long-term brand stewardship
are explicitly established. Black2SchoolMVMT has not met that bar and
is not treated here as if it had.

Per this task's instructions, the existing implementation was inspected
for language that might incorrectly imply ownership, parent-brand status,
permanent portfolio membership, or control of Black2SchoolMVMT's
intellectual property. **No production code was changed to do this
review — findings only, for Dani's review:**

| Location | Current language | Assessment |
|---|---|---|
| `src/lib/data/partners.ts` | Listed under `currentInitiatives`'s sibling array as a `"Community Connection"` (not `"Partner"`), with note `"Black educator conference opportunity — developing"` | **Accurate** — correctly uses the weakest/most external of the four partner categories; not listed in `initiatives.ts` at all (confirmed by direct grep: zero matches) |
| `src/lib/data/campaigns.ts` → `approvedFraming` | *"An exclusive opportunity created for Black2SchoolMvmt conference participants."* | Reads as Marked Minds describing an offer *it* created *for* that audience — not a claim of owning Black2SchoolMVMT. Minor, optional tightening: "created for" could become "created in partnership with" for extra precision, but this is not a real ownership claim as written |
| `src/lib/data/campaigns.ts` → `metadata.description` | *"Educator support from Marked Minds, created in partnership with Black2SchoolMvmt..."* | **Accurate** — explicit, correct "in partnership with" framing |
| `src/components/campaign/campaign-landing-page.tsx` → partner banner | Dynamically renders `"Exclusive for {partnerName} {eventName} Participants"` (when a time-limited offer is active) or `"In Partnership with {partnerName}"` (the current, non-expired-offer state, since the Black2School offer itself expired 2026-08-25) | **Accurate** — both renderings use `partnerName` generically and never assert ownership; the currently-live state is the "In Partnership with" wording |
| Anywhere in `initiatives.ts` | N/A | **Confirmed absent** — Black2SchoolMvmt has never been listed as a Marked Minds initiative in this file |

**Overall assessment: no significant ownership-implying language was
found.** The existing implementation already treats Black2SchoolMVMT
as an external partner rather than a sub-brand, consistently across
every file that references it. The one minor wording tightening above
("created for" → "created in partnership with") is optional, not urgent,
and listed here only because the task asked for a thorough report, not
because it represents a real risk as currently written.

No Black2SchoolMVMT identity work (accent color, typography, "By Marked
Minds" treatment, or any other brand-family element) is proposed, and
none should be undertaken under this document.

---

## Research Summary (for the record)

Repository evidence actually reviewed to produce this document:

- Full file listing (`rg --files`)
- `docs/BRAND_GUIDE.md` (existing, confirmed Marked Minds brand source of
  truth)
- `notes/MARKED_MINDS_BRAND_WEBSITE_STRATEGY.md` (older strategy brief —
  treated as historical context, not current truth, where it conflicts
  with `BRAND_GUIDE.md` or the live codebase — e.g., it still lists
  "Creative Studio" as an initiative and "Danielle Cummings" as the
  founder's name, both superseded)
- `src/app/globals.css` (design tokens, confirmed hex values, the
  `.academy-scope` pattern)
- `src/app/layout.tsx` (confirmed font loading — exactly two families,
  site-wide)
- `src/lib/data/` — `site.ts`, `initiatives.ts`, `partners.ts`,
  `campaigns.ts`, `ruthless-scout.ts`, `dream-deferred.ts`, `academy.ts`
- Live pages for every brand: `src/app/ruthless-scout/page.tsx`,
  `src/app/(marketing)/dream-deferred/page.tsx`,
  `src/app/(marketing)/focus-flex/page.tsx`,
  `src/app/(planner)/planner/layout.tsx`,
  `src/app/(marketing)/black2school/page.tsx`
- Shared components: `Button`, `Badge`, `Logo`, `AcademyBadge`,
  `PlannerBrand`/`PlannerDesktopNavigation`/`PlannerMobileNavigation`,
  `PillarCard`
- `public/logos/`, `public/images/` (confirmed what real imagery exists
  per brand, and what doesn't yet)
- `package.json` (confirmed no additional font packages beyond what
  `next/font/google` loads at build time)
