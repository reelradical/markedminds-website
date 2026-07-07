# Roadmap / Open Items

Things intentionally left as honest placeholders, and what's needed to
close each one out. See `CONTENT_STYLE_GUIDE.md` for why these weren't
filled in with invented content.

## Needs real data

- [ ] **Impact metrics** (`src/lib/data/metrics.ts`) — all six values are
      `null`. Pull real numbers from program records (students served,
      families supported, scholarships awarded, guest educators, community
      partners, volunteer hours).
- [ ] **Testimonials** (`src/lib/data/testimonials.ts`) — three
      placeholder entries with no real quotes or names attached yet.
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
      `GalleryGrid`) — currently styled placeholder tiles; swap in real
      `<Image>`/video embeds as assets come in.
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

- [x] Favicon set generated and wired in — Befitting "M" throughout (full
      glyph at large sizes, a simplified cropped/thickened derivative of
      the same glyph at 16/32px). See `BRAND_GUIDE.md` → Favicon
      (Permanent Decision).
- [ ] **Brand Sprint** — scheduled for after Focus + FLEX Academy Session
      II. Revisit the small-size simplified mark and iconography more
      broadly.

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
