# Marked Minds — Brand Guide

Version 1.0 — July 2026

## Positioning

Marked Minds LLC is a creative innovation studio that designs experiences,
tells meaningful stories, builds learning opportunities, and helps people,
brands, and communities grow.

Education (Focus + FLEX Academy) is one major expression of the work, not
the whole of it. The studio spans creative production, media, design,
storytelling, community connection, youth development, educator support,
and strategic consulting.

## Tagline Hierarchy

Two distinct taglines exist. Never confuse or merge them:

1. **Marked Minds** (`site.tagline` in `src/lib/data/site.ts`)
   - Tagline: **"We Curate Culture."**
   - Pillars line (`site.pillarsLine`): **"Create. Teach. Build. Connect."**
     — a supporting line under the tagline, not a replacement for it.
2. **Focus + FLEX Academy** (`academyTagline` in `src/lib/data/academy.ts`)
   - **"Learn. Grow. Create. Thrive."**
   - Used only on Focus + FLEX pages/sections (`/focus-flex`, the homepage
     Focus + FLEX teaser) — never presented as the Marked Minds tagline.
3. **Dream Deferred** — positioned as a **cultural storytelling platform**,
   not a generic "podcast" — born from the original Marked Minds vision of
   creative-minded people connecting, sharing stories, promoting purpose,
   and building community.

The tagline "We Curate Culture." is valid brand language and should
appear — the goal is to make sure the site *explains* what it means (via
the pillars line and the Four Pillars homepage section), not to avoid or
downplay it.

## Four Pillars

The homepage "What Marked Minds Does" section makes the pillars concrete:

| Pillar | Covers |
|---|---|
| **Create** | Photography, video, podcasts, graphics, apparel, branding, creative production |
| **Teach** | Focus + FLEX Academy, educator workshops, AI classroom support, curriculum design, youth programming |
| **Build** | Programs, partnerships, workshops, community initiatives, strategic consulting |
| **Connect** | Dream Deferred, storytelling, events, collaboration, networking, community-centered projects |

Each `ServiceCategory` in `src/lib/data/services.ts` carries a `pillar`
field mapping it back to one of these four — surfaced as a badge on
`/services` and the homepage services preview.

## Color System

| Token | Hex | Usage |
|---|---|---|
| Ink (black) | `#0a0a0b` | Primary text, dark section backgrounds |
| Charcoal | `#232326` | Secondary text tint base |
| Silver | `#e7e7ea` | Borders, dividers |
| Mist | `#f6f6f7` | Light section backgrounds |
| White | `#ffffff` | Base background, inverse text |
| Orange | `#ff7700` | Primary accent, CTAs, focus states |

Defined as CSS custom properties in `src/app/globals.css` and exposed as
Tailwind utilities (`bg-ink`, `text-brand-orange`, etc.) via `@theme inline`.

**Academy Purple (`#6b46c1`)** is reserved exclusively for Focus + FLEX
Academy — its own page (`/focus-flex`, scoped via the `.academy-scope`
wrapper in `src/app/focus-flex/layout.tsx`) and the `AcademyBadge` component
used to label Focus + FLEX content elsewhere (e.g. the homepage teaser).
Purple must never appear as a general Marked Minds brand color.

## Typography

- **Display (headings):** Bricolage Grotesque (`font-display` utility) —
  bold, editorial, used for `<h1>`/`<h2>` via the shared `PageHero` and
  `SectionHeading` components, plus the `Logo`.
- **Body:** Geist Sans (`font-sans`, the default body font) — clean,
  neutral, high legibility.

## Logo

Real logo files live in `public/logos/` (SVG + PNG, multiple color
variants). `src/components/shared/logo.tsx` uses
`marked-minds-logo-white-black-orange.svg` — a clean, transparent-
background vector wordmark (black script + orange "WE CURATE CULTURE"
tagline) — for light contexts (navbar, mobile menu), rendered at `h-14`
(sized up from an earlier `h-10` pass per direct feedback that it read too
small in the header).

Dark contexts (the Footer) still use the text-based fallback (orange dot +
"Marked Minds") because no transparent white-on-dark lockup exists yet —
the other dark-context file (`marked-minds-logo-black-white.svg`) has its
own solid charcoal canvas fill that doesn't match the site's `bg-ink`
(`#0a0a0b`) exactly. See `ROADMAP.md`.

## Favicon (Permanent Decision)

The favicon system uses one consistent derivative of the **Befitting**
font's brush-script "M" across every size — `favicon.ico` (16/32/48),
`icon.svg`, `icon-32.png`, `icon-192.png`, `icon-512.png`, and
`apple-icon.png`/`apple-touch-icon.png` (180px). No other typeface is
substituted anywhere in the set.

This is **"Variant 3 — Improved Internal Spacing"**, chosen from a
5-variant comparison (`design-reference/favicon-iterations.png`): the
Befitting "M" rendered at high resolution, then processed with a
horizontal-only erosion that narrows each diagonal stroke without moving
the gaps between them, a tight crop trimming the thinnest swash
extremities, and a light uniform dilation for weight. This was the only
variant that kept the three-stroke structure visibly distinct at 16×16 —
every other approach (increased slant, brush smoothing, aggressive crop
alone, uniform bold dilation alone) collapsed into a solid, illegible
blob at that size.

`icon.svg` embeds the same high-resolution processed raster inside an SVG
wrapper rather than a true vector path — Variant 3 is the output of
raster morphology operations (numpy-based erosion), not an edited vector
outline, so there's no separate path to trace.

This is the **permanent, ecosystem-wide decision** — don't revisit it
opportunistically. A dedicated Brand Sprint (typography and iconography
more broadly) is intentionally deferred until after Focus + FLEX Academy
Session II.

Source font files are not committed to the repo (`Befitting.otf` lives
outside the project); only the generated output assets are.

## Ownership Disclosure

Marked Minds LLC is a **woman-owned and veteran-owned business**
(`site.ownership` in `src/lib/data/site.ts`). This is mentioned exactly
**once** on the site — in the About page's Founder section — as a
credibility credential, never as the lead story. Do not lead with or
emphasize military service, rank, or service history anywhere on the site.

## What Not To Do

- Don't reintroduce "education nonprofit" or "education company" framing
  as the primary identity — Marked Minds is the parent creative studio.
- Don't use purple outside Focus + FLEX Academy scope.
- Don't invent partners, quotes, testimonials, or impact statistics. See
  `CONTENT_STYLE_GUIDE.md` for the placeholder policy.
- Don't add "Black-owned" or "queer-owned" language unless/until
  explicitly confirmed and approved — not currently part of the brand copy.

See also: `WEBSITE_STRATEGY.md` for site architecture, and the original
brand/website strategy brief at `/notes/MARKED_MINDS_BRAND_WEBSITE_STRATEGY.md`.
