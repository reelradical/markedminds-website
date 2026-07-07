# Changelog

## 2026-07-06 — Brand repositioning: Marked Minds as creative innovation studio

Repositioned the site from "education company" to "creative innovation
studio" per the strategic brand correction in
`/notes/MARKED_MINDS_BRAND_WEBSITE_STRATEGY.md`.

**Added**

- New pages: `/services`, `/our-work`, `/dream-deferred`
- New data files: `services.ts`, `dream-deferred.ts`
- Founder section on `/about` (Danielle Cummings, woman-owned/veteran-owned
  mentioned once)
- Editorial display typeface (Bricolage Grotesque) for headings, layered
  over the existing Geist Sans body font
- Shared `Timeline` component (used by `/about` and the homepage)
- Honest-placeholder handling: `metrics.ts` values are `null` until
  confirmed, `testimonials.ts` uses role-only placeholder attribution,
  `partners.ts` contains only real, confirmed connections

**Changed**

- Homepage rebuilt around Marked Minds broadly: new hero copy ("Ideas
  become experiences..."), "What Marked Minds Does," Creative Production,
  Education + Workshops, Focus + FLEX teaser, Dream Deferred teaser,
  Timeline, Services Preview, Community Impact, Trusted By, closing CTA
- Navigation restructured: About, Services, Our Work, Focus + FLEX
  Academy, Dream Deferred, Impact, Support, Contact
- `/partners` rewritten with real partners only (Re:imagine/ATL,
  Pharaoh's Conclave, Cedar Grove community, Focus + FLEX Academy
  families, Black2SchoolMvmt)
- Focus + FLEX session language corrected: Session I marked completed,
  Session II marked upcoming/preparing to launch
- `site.ts` tagline/description updated to studio positioning
- Organization JSON-LD type changed from `EducationalOrganization` to
  `Organization` (Focus + FLEX sub-organization keeps the educational type)

**Removed**

- `/programs` content consolidated into `/our-work`; the route now
  permanently redirects (308) rather than 404ing for old links
- Dead components: `mission-section.tsx`, `why-marked-minds.tsx`,
  `programs-section.tsx`, `program-card.tsx`, `testimonials-section.tsx`
- `lib/data/programs.ts` (superseded by `services.ts` + `initiatives.ts`)
- Invented placeholder partners and testimonials that read as real
