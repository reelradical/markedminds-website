# Roadmap / Open Items

## Current Release

**Marked Minds Website v1.1.0**
Released July 2026
Status: Production

See `RELEASES.md` for the full release record and `CHANGELOG.md` for
change-by-change detail.

Things intentionally left as honest placeholders, and what's needed to
close each one out. See `CONTENT_STYLE_GUIDE.md` for why these weren't
filled in with invented content.

## Needs real data

- [x] **Impact metrics** (`src/lib/data/metrics.ts`) — 4 of 6 values
      confirmed from the Session I Pilot Evidence & Impact Report:
      Students Served (13), Families Supported (7), Scholarships Awarded
      (11), Guest Educators (2). Community Partners and Volunteer Hours
      remain `null` — the source report itself marks these TBD/inconsistent
      across its own tables; do not fill in until that's resolved.
- [x] **Parent testimonials** — real, permission-granted quotes from the
      Session I Parent Exit Survey now live as short pull-quotes on
      `/impact` and `/focus-flex`, attributed generically ("Focus + FLEX
      parent") rather than by full name. Implemented as inline quote
      cards rather than a standalone `testimonials.ts`/`TestimonialCard`
      — that file/component was never built; this line item previously
      referenced a path that doesn't exist in the codebase.
- [x] **Dream Deferred listen/follow links** (`src/lib/data/dream-deferred.ts`)
      — Spotify, Apple Podcasts, Spreaker, YouTube, Metacast, Instagram, and
      X all confirmed with real URLs.
- [ ] **Dream Deferred community highlight** (`conversationHighlight` in
      `src/lib/data/dream-deferred.ts`) — the kg.codes.social Facebook post
      embed is live; revisit if a different/updated post should replace it.
- [ ] **Dream Deferred supporter link** (`supporterUrl` in
      `src/lib/data/dream-deferred.ts`) — confirmed live (Spreaker
      Supporter). No action needed unless it changes.
- [ ] **Gallery photography/video** (`src/lib/data/gallery.ts`,
      `GalleryGrid`) — 8 of 10 items now have real photos (g1–g6, g11,
      g12). The remaining 4 (family showcase night, "a day inside Focus +
      FLEX" video, guest educator visit, reading circle) still have no
      asset — their entries stay in the data file but are hidden from
      `/gallery` (filtered on `src` presence) rather than shown as empty
      placeholder tiles. Swap in real assets as they come in.
- [ ] **Partner confirmation** (`src/lib/data/partners.ts`) — confirm
      exact relationship category (Partner/Collaborator/Client/Community
      Connection) for each entry, and fill the "Additional partners to be
      confirmed" slot as new ones are confirmed.

## Needs a real URL from the user

- [ ] **Dani's personal LinkedIn** (`site.founderLinkedinUrl` in
      `src/lib/data/site.ts`) — currently empty, so the LinkedIn icon is
      hidden in the Footer and on `/contact` until supplied.
- [ ] **DaniCummings.com** (`site.founderSiteUrl`) — confirmed not live yet.
      The About page's Founder section intentionally shows this as plain
      text ("coming soon"), not a link. Re-enable the link once it resolves.

## Needs a logo asset

- [x] Light-context logo (navbar, mobile menu) now uses the real vector
      wordmark (`marked-minds-logo-white-black-orange.svg`), sized up to
      `h-14` per direct feedback.
- [ ] **Transparent white-on-dark wordmark** for the Footer (dark
      background) — none of the current `public/logos/` files are both
      transparent and light-colored. The Footer keeps the text-based
      fallback until one is supplied.

## Favicon / typography

- [x] Favicon set finalized — Variant 3 ("Improved Internal Spacing") of
      the Befitting "M" used consistently at every size, chosen from a
      5-variant comparison (`design-reference/favicon-iterations.png`)
      after the full-glyph-at-large/simplified-at-small split proved
      inconsistent. See `BRAND_GUIDE.md` → Favicon (Permanent Decision).
- [ ] **Brand Sprint** — scheduled for after Focus + FLEX Academy Session
      II. Revisit iconography and typography more broadly.

## Needs a status decision

- [ ] **Focus + FLEX Session II** (`src/lib/data/academy.ts` →
      `sessions`) — currently "preparing to launch." Update to "currently
      enrolling" (or an exact enrollment date) once known.

## Possible future site work

- [ ] Dedicated `/founder` page if the About-page section ever needs to
      expand beyond a "concise section, not a résumé."
- [ ] Revisit whether "Black-owned" or "queer-owned" language should be
      added — explicitly deferred per brand brief, pending approval.
- [ ] Add real partner/sponsor logo images to replace the wordmark tiles
      in `PartnerLogo`.
- [ ] **Services page Creative Production portfolio** — a single
      oversized BTS photo was removed (see `CHANGELOG.md` → v1.1.0); the
      section is text-led for now. Design a curated multi-image treatment
      using only clearly-attributable Marked Minds work — see
      `ASSET_CHECKLIST.md` → Services for the full TODO.
