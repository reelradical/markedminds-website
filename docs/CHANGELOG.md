# Changelog

## v1.1.0 — July 2026

Session I evidence integration, corrected analytics configuration, and a
Services page correction. See `RELEASES.md` for the formal release record.

**Added**

- Authentic Session I photography across Focus + FLEX Academy pages
  (`/focus-flex`, `/gallery`, `/impact`, `/our-work`) — group photo,
  student portraits, classroom moments, and the FLEX Friday celebration,
  replacing placeholder gallery tiles.
- Verified Focus + FLEX Session I impact metrics
  (`src/lib/data/metrics.ts`): 13 scholars served, 7 families supported,
  11 scholarships awarded, 2 guest educators — sourced from the Session I
  Pilot Evidence & Impact Report. Community Partners and Volunteer Hours
  remain unconfirmed.
- Real, permission-granted parent testimonials on `/impact` and
  `/focus-flex`, replacing the "coming soon" placeholder section.
- "Session I proved the model" and "What Scholars Experienced" sections
  on `/focus-flex`.
- Analytics environment-variable validation
  (`src/components/analytics/google-analytics.tsx`) — the GA4 measurement
  ID is now trimmed and validated against `^G-[A-Z0-9]+$` before
  rendering; malformed values render nothing instead of producing broken
  inline script content.

**Changed**

- Gallery captions rewritten to explain the learning or moment behind
  each photo rather than a generic description.
- Services page: removed an oversized behind-the-scenes photo that risked
  implying the pictured crew/equipment belonged to Marked Minds; Creative
  Production is now text-led like the other three service categories.
  Follow-up tracked in `ASSET_CHECKLIST.md`.

**Fixed**

- Corrected the `NEXT_PUBLIC_GA_ID` production environment variable (was
  duplicated 5× with embedded newlines, causing a sitewide console
  `SyntaxError` and broken GA4 tracking).
- Removed a duplicate `Analytics` import in `layout.tsx` introduced by an
  auto-generated Vercel PR, which had broken the production build.

## v1.0.0 — July 7, 2026

Initial public release of markedminds.com

**Added**

- Public website
- Dream Deferred hub
- Focus + FLEX Academy pages
- Services
- Our Work
- Impact
- Partners
- Gallery
- Contact
- Session II registration
- Session II deposit payment
- Google Analytics
- Microsoft Clarity
- Vercel Analytics
- Open Graph images
- Brand documentation
- Favicon system

**Fixed**

- Canonical URLs
- Metadata
- Social previews
- Navigation
- Responsive layout

## 2026-07-07 — Favicon, Dream Deferred real assets, founder naming decision

**Added**

- Full favicon set: `favicon.ico`, `icon.svg`, `icon-32.png`,
  `icon-192.png`, `icon-512.png`, `apple-icon.png`/`apple-touch-icon.png`.
  Befitting brush "M" throughout — full glyph at large sizes, a
  simplified cropped/thickened derivative of the same glyph at
  16x16/32x32 where the full glyph's slant stopped reading as a letter —
  see `BRAND_GUIDE.md` → Favicon (Permanent Decision). Wired in via
  Next.js file-convention icons, explicit `metadata.icons`, and a new
  `manifest.ts`.
- Dream Deferred real platform links and embeds: Spotify, Apple Podcasts
  (embedded player), Spreaker (featured "Listen Now" player), YouTube,
  Metacast, Instagram (styled link card), X (`@deferredpodcast`), a real
  Spreaker Supporter link, and the kg.codes.social Facebook post embed in
  "The Conversation Continues."
- Verified public stats on `/dream-deferred`: 32 episodes, 3,641 lifetime
  downloads (internal-only "Live Plays" figure kept out of public view).
- "Get Involved" section on `/dream-deferred` with five concrete calls to
  action.

**Changed**

- Navbar logo sized up (`h-10` → `h-14`) per direct feedback that it read
  too small.
- Founder referred to as **Dani Cummings**, not Danielle — permanent,
  ecosystem-wide decision (see `CONTENT_STYLE_GUIDE.md` → Naming
  Conventions).
- `DaniCummings.com` link removed from the About page (not live yet);
  shown as plain "coming soon" text instead — see `CONTENT_STYLE_GUIDE.md`
  → No Dead Links.
- Dream Deferred page reordered end-to-end: Hero → Verified Stats →
  Featured Spreaker Player → Origin → Conversation Continues → Instagram
  Preview → Get Involved → Support Independent Storytelling → Listen
  Wherever You Stream Podcasts (Spotify/Apple/YouTube/Metacast only) →
  Apple Podcasts embed (last).

**Deferred**

- A Brand Sprint (typography and iconography, including refining the
  simplified small-size favicon mark) is scheduled for after Focus + FLEX
  Academy Session II.

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
