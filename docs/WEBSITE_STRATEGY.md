# Marked Minds — Website Strategy

Version 1.0 — July 2026

Reflects the site as implemented after the July 2026 rebrand (see
`CHANGELOG.md`). The original brand correction brief lives at
`/notes/MARKED_MINDS_BRAND_WEBSITE_STRATEGY.md`.

## Navigation (`src/lib/data/nav.ts`)

Home (via logo) · About · Services · Our Work · Focus + FLEX Academy ·
Dream Deferred · Impact · Support · Contact

`footerNav` mirrors `primaryNav` exactly.

## Page-by-Page Purpose

| Route | Purpose |
|---|---|
| `/` | Leads with Marked Minds broadly (studio positioning), not Focus + FLEX. See homepage section order below. |
| `/about` | History, founder section, mission/vision, core values, full timeline. |
| `/services` | Four service categories: Creative Production, Design + Brand Support, Education + Workshops, Consulting + Strategy. |
| `/our-work` | Portfolio: initiatives overview, gallery highlights, Trusted By strip. Absorbs what `/programs` used to cover. |
| `/focus-flex` | Focus + FLEX Academy detail page. Only place Academy purple (`bg-academy-purple`) is used as a section background. |
| `/dream-deferred` | Podcast/storytelling platform page with an editable "listen" link area. |
| `/impact` | Community impact metrics (placeholder-safe) and testimonials (placeholder-safe). |
| `/gallery` | Full photo/video placeholder grid. |
| `/partners` | Full "Trusted By, Built With, and Connected Through" list. |
| `/donate` | Support Focus + FLEX Academy — scholarships, giving, sponsorship, volunteering. |
| `/contact` | General contact form; inquiry types include workshop bookings and creative production clients. |
| `/programs` | Permanent redirect (308) to `/our-work` — kept so old links don't 404. |

## Homepage Section Order (`src/app/page.tsx`)

1. Hero — "We Curate Culture." headline, studio-positioning subheadline,
   "Create. Teach. Build. Connect." supporting line, 3 CTAs (Explore Our
   Work / View Services / Support Focus + FLEX).
2. What Marked Minds Does — Four Pillars (Create/Teach/Build/Connect),
   each mapped to real service/initiative areas. See `BRAND_GUIDE.md`.
3. Creative Production
4. Education + Workshops
5. Focus + FLEX Academy teaser
6. Dream Deferred teaser
7. Timeline (condensed, links to full `/about` timeline)
8. Services Preview (4-category grid)
9. Community Impact
10. Trusted By / partners strip
11. Closing CTA

## Data-Driven Content

Nearly all copy lives in `src/lib/data/*.ts`, not hardcoded in JSX — update
data files first when content changes:

- `site.ts` — global site config, tagline, ownership line, social links
- `services.ts` — the four service categories and their item lists
- `initiatives.ts` — Marked Minds initiative portfolio (live/planned/future)
- `partners.ts` — real partners only, see `CONTENT_STYLE_GUIDE.md`
- `metrics.ts` — impact numbers, `null` until confirmed
- `testimonials.ts` — placeholder-safe until real quotes are collected
- `academy.ts` — Focus + FLEX learning model, pillars, sessions
- `dream-deferred.ts` — podcast listen links (empty until real URLs exist)
- `about.ts` — core values, organization timeline
