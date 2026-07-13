# Marked Minds — Website Asset Checklist

Generated from a full scan of the current codebase (every page, section,
and data file) ahead of launch. This is an inventory, not a to-do list for
code — no code was changed to produce it.

**Status key:**
- **Missing** — no asset exists at all; section currently renders with no
  image/photo/video
- **Placeholder** — a styled placeholder tile/graphic stands in
  (dashed border, icon, or generic text) until a real asset is supplied
- **Needs replacement** — an asset exists but is a stand-in that should be
  swapped (e.g. a code-generated graphic instead of a designed one)
- **Complete** — real, final asset is in place

---

## Homepage (`/`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Hero | Photo/video background | `homepage/hero-background.jpg` (or `.mp4`) | Landscape | 2400×1350 | Optional but high-impact: a real photo or short looping video representing creative/education work in motion, behind the "We Curate Culture." headline (currently a gradient + dot-grid pattern, no photo) | Missing |
| Creative Production section | Supporting photo/video | `homepage/creative-production-supporting.jpg` | Landscape | 1600×1000 | A real shot of a video/photo shoot, podcast recording, or design session — makes the "Create" pillar tangible | Missing |
| Education + Workshops section | Supporting photo | `homepage/education-workshops-supporting.jpg` | Landscape | 1600×1000 | Real classroom, workshop, or AI-literacy session photo | Missing |
| Focus + FLEX teaser | Photo | `homepage/focus-flex-teaser.jpg` | Landscape | 1600×1000 | A real Session I photo (small-group learning in action) | Missing |
| Dream Deferred teaser | Cover art / photo | `homepage/dream-deferred-teaser.jpg` | Square | 1400×1400 | Podcast cover art or a recording-session photo | Missing |
| Trusted By / partner strip | Logo images | `logos/[partner-name].png` (×5) | Square or wide, transparent | 400×400 min | Real logo files for each confirmed partner (see Partners page below) — currently rendered as plain text, not logos | Placeholder |

## About (`/about`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| History | Photo | `founder/history-supporting.jpg` | Landscape | 1600×1000 | Optional supporting image for the 2017 founding story | Missing |
| **Founder** | **Headshot photo** | `founder/dani-cummings-headshot.jpg` | Portrait | 1200×1500 | Professional headshot of Dani Cummings — currently text-only, no photo anywhere on the site | **Missing** |
| Founder | Secondary/lifestyle photo | `founder/dani-cummings-at-work.jpg` | Landscape or Portrait | 1600×1200 | Optional: Dani in a creative/teaching context, for variety if the section expands | Missing |
| Timeline | Per-era photos (7 entries) | `founder/timeline-2017.jpg` … `timeline-2025.jpg` | Landscape | 1200×800 | Optional: one representative photo per timeline era; currently text-only | Missing |

## Services (`/services`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Creative Production | Portfolio sample photos/video | `creative-production/sample-01.jpg` … `sample-04.jpg`, `creative-production/reel.mp4` | Landscape | 1600×1000 (photo), 1920×1080 (video) | Real examples of past video/photo/podcast work — a single BTS photo was tried here and removed (oversized, and the pictured crew/equipment/environment weren't clearly attributable to Marked Minds). Currently text-led: icon + bullet list of service names, no proof-of-work imagery. | Missing |
| Design + Brand Support | Portfolio sample graphics | `creative-production/design-sample-01.png` … `-04.png` | Square or Landscape | 1200×1200 | Real graphics/flyer/apparel design examples | Missing |
| Education + Workshops | Workshop photo | `focus-flex/educator-workshop.jpg` | Landscape | 1600×1000 | Real photo from an educator workshop or AI-in-classroom session | Missing |
| Consulting + Strategy | Supporting photo/graphic | `our-work/consulting-supporting.jpg` | Landscape | 1600×1000 | Optional: strategy/planning session photo or abstract graphic | Missing |

**TODO — Services page portfolio treatment:** Services currently renders
text-only (no photos) across all four categories, by editorial decision
rather than gap. Before adding photography back to Creative Production
specifically, design a curated *multi-image* portfolio treatment (e.g. a
small grid or filmstrip, not one oversized single photo) using **only**
images that clearly and verifiably show Marked Minds' own work — no
BTS/production shots where the crew, equipment, or environment can't be
confidently attributed to Marked Minds. Do not reintroduce a single large
photo as a stopgap.

## Our Work (`/our-work`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Initiatives grid | Card imagery | `our-work/initiative-[slug].jpg` | Landscape | 1200×800 | Optional: a representative photo per initiative card (currently icon-only `InitiativeCard`) | Missing |
| Photo & Video Highlights | Gallery photos/videos | See Gallery section below (same items, reused) | — | — | Pulls the same placeholder gallery items used on `/gallery` | Placeholder |
| Trusted By strip | Logo images | Same as homepage/Partners | Square | 400×400 min | Same partner logo gap as homepage | Placeholder |

## Focus + FLEX Academy (`/focus-flex`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Hero | Photo/video background | `focus-flex/hero-background.jpg` | Landscape | 2400×1350 | Real session photo behind the purple-scoped hero (currently text-only on dark background) | Missing |
| Learning Model / Academic Pillars | Supporting photos | `focus-flex/pillar-[name].jpg` | Landscape | 1200×800 | Optional: one photo per pillar (AI literacy, coding, reading, etc.) — currently icon-only `PillarCard` | Missing |
| Scholarships | Photo | `focus-flex/scholarship-recipient-moment.jpg` | Landscape | 1600×1000 | Optional: a real moment representing scholarship impact | Missing |
| Sessions (Session I) | Recap photo(s) | `focus-flex/session-1-recap.jpg` | Landscape | 1600×1000 | Session I is described as complete — a real recap/group photo would substantiate that | Missing |
| Sessions (Session II) | Promotional graphic | `focus-flex/session-2-launch-graphic.jpg` | Landscape or Square | 1200×1200 | "Preparing to launch" promo graphic/flyer | Missing |

## Dream Deferred (`/dream-deferred`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Hero | Podcast cover art | `dream-deferred/cover-art.jpg` | Square | 3000×3000 (podcast-platform standard) | Official show cover art — used on Spotify/Apple already presumably, but not displayed anywhere on this website page | Missing |
| Featured Spreaker player | — | — | — | — | Live embed, functioning | Complete |
| The Conversation Continues | Facebook post embed | — | — | — | kg.codes.social post, live embed | Complete |
| Instagram preview | Screenshot/photo | `social/instagram-preview.jpg` | Square or Portrait | 1080×1080 | Optional: a real screenshot/photo representing the Instagram feed content, next to the "Follow" card | Missing |
| Listen Wherever section | Platform icons | — | — | — | Uses text buttons, not icon graphics — could add real platform badge icons (Spotify/Apple/YouTube/Metacast logos) | Placeholder |

## Impact (`/impact`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Metrics | — | — | — | — | Numbers are `null`, not a visual asset gap — tracked separately in `ROADMAP.md` | N/A (data, not asset) |
| Testimonials | Headshot photos | `impact/testimonial-[name].jpg` | Square | 600×600 | Once real testimonials are collected, a small headshot per person would strengthen credibility (current `TestimonialCard` has no photo slot at all) | Missing |
| Photo Highlights | Gallery photos | Same as Gallery section | — | — | Reuses the same placeholder gallery items | Placeholder |

## Gallery (`/gallery`)

All 10 items currently render as styled placeholder tiles (gradient block
+ icon + caption). Real assets needed for every one:

| ID | Caption | Type | Suggested Filename | Orientation | Min. Resolution | Status |
|---|---|---|---|---|---|---|
| g1 | Small-group problem solving | Photo | `gallery/small-group-problem-solving.jpg` | Portrait | 1200×1600 | Placeholder |
| g2 | Family showcase night | Photo | `gallery/family-showcase-night.jpg` | Landscape | 1600×1200 | Placeholder |
| g3 | A day inside Focus + FLEX | Video | `video/day-inside-focus-flex.mp4` | Landscape | 1920×1080 | Placeholder |
| g4 | AI literacy workshop | Photo | `gallery/ai-literacy-workshop.jpg` | Square | 1200×1200 | Placeholder |
| g5 | Guest educator visit | Photo | `gallery/guest-educator-visit.jpg` | Portrait | 1200×1600 | Placeholder |
| g6 | Reading circle | Photo | `gallery/reading-circle.jpg` | Square | 1200×1200 | Placeholder |
| g7 | Student project spotlight | Video | `video/student-project-spotlight.mp4` | Portrait / 9:16 | 1080×1920 | Placeholder |
| g8 | Movement & mindfulness break | Photo | `gallery/movement-mindfulness-break.jpg` | Landscape | 1600×1200 | Placeholder |
| g9 | Coding lab | Photo | `gallery/coding-lab.jpg` | Square | 1200×1200 | Placeholder |
| g10 | Community celebration | Photo | `gallery/community-celebration.jpg` | Portrait | 1200×1600 | Placeholder |

## Partners (`/partners`)

| Partner | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Re:imagine/ATL | Logo | `logos/reimagine-atl.png` | Square or wide, transparent bg | 800×800 | Real logo file | Missing |
| Pharaoh's Conclave | Logo | `logos/pharaohs-conclave.png` | Square or wide, transparent bg | 800×800 | Real logo file | Missing |
| Cedar Grove community | Logo/icon | `logos/cedar-grove-community.png` | Square, transparent bg | 800×800 | Real logo if one exists; otherwise this may stay text-only (it's a community, not an org with a mark) | Missing / N/A |
| Focus + FLEX Academy families | — | — | — | — | Represents families collectively, not a loggable org — no logo expected | N/A |
| Black2SchoolMvmt | Logo | `logos/black2schoolmvmt.png` | Square or wide, transparent bg | 800×800 | Real logo file | Missing |
| Additional partners | — | — | — | — | Placeholder slot, intentionally generic until confirmed | Placeholder (intentional) |

## Donate (`/donate`)

| Section | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Hero | Photo | `focus-flex/donate-hero.jpg` | Landscape | 2400×1350 | Optional: real photo showing scholarship/program impact behind the hero | Missing |
| Purpose grid (Scholarships, Meals, Enrichment, Technology, Community) | Supporting icons | — | — | — | Currently uses lucide icons, which is fine/complete — no photo needed structurally | Complete |

## Contact (`/contact`)

No visual assets required — form + text page. **Complete.**

## Campaign Pages (`/black2school` and future campaigns)

**RESOLVED — Airtable Intake Queue integration:** Black2School and the
Focus + FLEX interest list both write to the Marked Minds OS Airtable base
(Intake Queue table) via the shared `saveIntake()` helper
(`src/lib/airtable.ts`). Verified live end-to-end, including the "New
Inquiry" automation and duplicate prevention. Full schema and integration
detail: `docs/AIRTABLE_CRM_SCHEMA.md`. Remaining item: confirm
`AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` / `AIRTABLE_INTAKE_TABLE` are set
in Vercel's production environment (confirmed locally only as of this
writing) — see the Production Readiness Report for status.

**TODO — AI Classroom Starter Kit resources:** The free lead-magnet section
promised 8 downloadable resources (AI prompt guide, AI classroom policy
template, parent letter template, lesson-planning prompt bank, student
reflection prompts, coding vocabulary guide, AI glossary, classroom
workflow cheat sheet). **None of these files have been authored yet.** The
section, form, and analytics event (`<slug>_starter_kit_submit`) are fully
built in `campaign-content.ts` / `starter-kit-form.tsx` but are hidden via
`campaign.features.starterKit = false` in `campaigns.ts` so the page never
promises access to a resource that doesn't exist. To launch it: author the
8 resources, host them somewhere fetchable, wire real delivery (see the
email-delivery TODO below), then flip `starterKit: true` for the relevant
campaign — no other code changes needed.

**TODO — Campaign email delivery to production:** `/api/campaign-inquiry`
and `/api/campaign-lead` send real email via Resend (`src/lib/email.ts`).
Confirmed working end-to-end in local testing — a real submission was
delivered to and received at `markedminds@gmail.com`. Two things remain
before this works on the live site:
1. Set `RESEND_API_KEY`, `CAMPAIGN_INQUIRY_TO_EMAIL`, and
   `CAMPAIGN_FROM_EMAIL` in Vercel's production environment variables
   (currently only set locally in `.env.local`, which is gitignored and
   never deploys).
2. The sender is currently Resend's sandbox address
   (`onboarding@resend.dev`), which only delivers to pre-verified
   recipient addresses — fine for `markedminds@gmail.com` as a known
   destination, but **will not reliably deliver for the actual campaign**
   unless a real domain (e.g. `markedminds.com`) is verified in Resend
   and `CAMPAIGN_FROM_EMAIL` is switched to an address on it. Verify the
   domain before relying on this for real conference participants.

## Sitewide / Brand

| Asset | Asset Type | Suggested Filename | Orientation | Min. Resolution | Description | Status |
|---|---|---|---|---|---|---|
| Favicon set | Icon (favicon.ico, icon.svg, icon-32/192/512, apple-touch-icon) | `icons/*` | Square | up to 512×512 | Befitting "M" brand mark, all sizes generated and wired in | **Complete** |
| Light-context logo (navbar) | Logo (SVG) | `logos/marked-minds-logo-white-black-orange.svg` | Wide | Vector | Real transparent wordmark, in use | **Complete** |
| Dark-context logo (Footer) | Logo (SVG/PNG) | `logos/marked-minds-logo-transparent-white.svg` | Wide, transparent bg | Vector | No transparent white-on-dark lockup exists yet — Footer still uses a text fallback (dot + "Marked Minds") | Missing |
| Open Graph share image | Graphic | `social/og-image.jpg` | Landscape | 1200×630 | Currently code-generated (dot + tagline on black) — functional but generic; a designed graphic would look better when links are shared | Needs replacement |
| Social avatar/profile image | Photo/graphic | `social/profile-avatar.png` | Square | 800×800 | For Instagram/Facebook/X profile consistency — not a website asset but worth tracking here since it's brand-adjacent | Missing (out of scope for this site) |

---

## Master Upload Checklist (by folder)

```
/assets
  /founder
    dani-cummings-headshot.jpg          ← LAUNCH CRITICAL
    dani-cummings-at-work.jpg
    timeline-2017.jpg … timeline-2025.jpg (7 files, optional)
    history-supporting.jpg

  /homepage
    hero-background.jpg (or .mp4)       ← LAUNCH CRITICAL
    creative-production-supporting.jpg  ← LAUNCH CRITICAL
    education-workshops-supporting.jpg
    focus-flex-teaser.jpg
    dream-deferred-teaser.jpg

  /dream-deferred
    cover-art.jpg                       ← LAUNCH CRITICAL
    instagram-preview.jpg

  /focus-flex
    hero-background.jpg                 ← LAUNCH CRITICAL
    pillar-ai-literacy.jpg … pillar-family-partnership.jpg (10 files, optional)
    scholarship-recipient-moment.jpg
    session-1-recap.jpg
    session-2-launch-graphic.jpg
    educator-workshop.jpg
    donate-hero.jpg

  /creative-production
    sample-01.jpg … sample-04.jpg       ← LAUNCH CRITICAL (at least 1)
    reel.mp4
    design-sample-01.png … design-sample-04.png

  /our-work
    initiative-[slug].jpg (per initiative, optional)
    consulting-supporting.jpg

  /gallery
    small-group-problem-solving.jpg
    family-showcase-night.jpg
    ai-literacy-workshop.jpg
    guest-educator-visit.jpg
    reading-circle.jpg
    movement-mindfulness-break.jpg
    coding-lab.jpg
    community-celebration.jpg

  /partners
    reimagine-atl.png                   ← LAUNCH CRITICAL
    pharaohs-conclave.png               ← LAUNCH CRITICAL
    cedar-grove-community.png (if one exists)
    black2schoolmvmt.png                ← LAUNCH CRITICAL

  /impact
    testimonial-[name].jpg (per confirmed testimonial, once real)

  /logos
    marked-minds-logo-transparent-white.svg (Footer dark-context fix)

  /icons
    (favicon set — already complete, no action needed)

  /video
    day-inside-focus-flex.mp4
    student-project-spotlight.mp4
    reel.mp4 (Creative Production, duplicate ref from above)

  /social
    og-image.jpg                        ← LAUNCH CRITICAL
    profile-avatar.png
    instagram-preview.jpg (duplicate ref from Dream Deferred)
```

---

## LAUNCH CRITICAL — Top 15

Ranked by visibility and credibility impact for tomorrow's launch:

1. **`founder/dani-cummings-headshot.jpg`** — About/Founder section has zero photo of Dani right now; this is the single biggest credibility gap on the site.
2. **`gallery/small-group-problem-solving.jpg`** (g1) — first gallery tile, appears on `/gallery`, `/our-work`, and `/impact`.
3. **`gallery/family-showcase-night.jpg`** (g2) — same reuse pattern as above.
4. **`focus-flex/session-1-recap.jpg`** — Session I is publicly described as "complete"; a real recap photo backs that claim up.
5. **`homepage/hero-background.jpg`** — the very first thing every visitor sees; currently an abstract gradient with no photography at all.
6. **`focus-flex/hero-background.jpg`** — same gap on the Focus + FLEX page itself.
7. **`dream-deferred/cover-art.jpg`** — standard podcast cover art, expected by anyone clicking through from Spotify/Apple/Instagram.
8. **`partners/reimagine-atl.png`** — currently a plain text tile where a real partner logo should be.
9. **`partners/pharaohs-conclave.png`** — same gap.
10. **`partners/black2schoolmvmt.png`** — same gap.
11. **`creative-production/sample-01.jpg`** (at least one) — `/services` currently makes zero visual case for Creative Production despite it being a headline pillar; a portfolio sample of any kind fixes this.
12. **`homepage/creative-production-supporting.jpg`** — same gap, homepage version.
13. **`social/og-image.jpg`** — every link shared to this site (social, Slack, text) currently shows a generic code-generated card instead of a designed one.
14. **`gallery/ai-literacy-workshop.jpg`** (g4) — reinforces the AI-literacy positioning that's central to the brand story.
15. **`logos/marked-minds-logo-transparent-white.svg`** — the Footer (present on every single page) is still showing a text fallback instead of the real logo.

Everything else in this checklist can reasonably follow post-launch.
