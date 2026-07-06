# Marked Minds — Official Website

The production website for **Marked Minds LLC**, home of **Focus + FLEX Academy** ("A Marked Minds Initiative") and the wider Marked Minds portfolio.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Radix primitives (shadcn-style UI), and Lucide icons.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build locally
npm run lint     # ESLint
```

## Project Structure

```text
src/
  app/                  Routes (App Router). One folder per page.
    focus-flex/         Focus + FLEX Academy — the only route using the
                         Academy purple accent (see layout.tsx there).
    api/                Route handlers backing the contact & newsletter forms.
    sitemap.ts, robots.ts, icon.tsx, apple-icon.tsx, opengraph-image.tsx
                         Generated SEO assets (no static files to swap).
  components/
    ui/                 shadcn-style primitives (button, card, input, ...).
    layout/              Navbar, Footer.
    shared/              Cross-page building blocks (cards, forms, gallery grid,
                         animated section wrapper, section heading, page hero).
    academy/             Components scoped to Focus + FLEX Academy (purple).
    home/                Home-page-only sections.
  lib/
    data/                Content as plain TypeScript objects/arrays — see below.
    icon-map.tsx          Maps data-layer icon keys to Lucide components.
    utils.ts              `cn()` class-merging helper.
```

## Editing Content

All real copy lives in `src/lib/data/*.ts`, not scattered across JSX. To update the site, edit data, not markup:

| File | Controls |
|---|---|
| `site.ts` | Site name, tagline, email, donation link, social URLs |
| `nav.ts` | Header & footer navigation links |
| `initiatives.ts` | Marked Minds brand architecture (current + future initiatives) |
| `programs.ts` | Programs page current/future program cards |
| `metrics.ts` | Impact page stat cards — **edit these numbers as programs grow** |
| `testimonials.ts` | Quotes shown on Home and Impact |
| `partners.ts` | Partner logos, grouped by category |
| `gallery.ts` | Gallery placeholder tiles (photo/video, caption, session) |
| `academy.ts` | Focus + FLEX learning model, pillars, sessions |
| `about.ts` | Core values and organization timeline |

This separation means a future CMS (Sanity, Contentful, a simple headless API, etc.) can replace any one of these files with a `fetch` call without touching page components.

## Brand Architecture

Marked Minds LLC is the parent brand. Its color system is black / charcoal / silver / white / orange (`#FF7700`) — **no purple**.

**Focus + FLEX Academy** is a sub-brand and the only place purple (`#6B46C1`) is used — its pages, badges, buttons, and accents. This is enforced structurally:

- `src/app/focus-flex/layout.tsx` wraps that route in an `.academy-scope` class.
- Only components under `src/components/academy/` and the Focus + FLEX page reference the `academy-purple` color token or the `academy` / `academy-outline` button variants.
- The one exception is `AcademyBadge` (`components/academy/academy-badge.tsx`), a small purple pill used to label Focus + FLEX content when it's referenced from other pages (e.g. the homepage teaser) — matching the brand guideline that "Academy badges" may appear anywhere.

### Adding a future initiative

`src/lib/data/initiatives.ts` already lists every current and future initiative (Dream Deferred, Educational Consulting, Creative Studio, Remnants, etc.) with a `status` of `"live" | "planned" | "future"`. They render automatically as cards on the Programs page and (for `"planned"`) show a "In Development" badge with no dedicated page yet.

To launch a real page for one of them:

1. Create `src/app/<slug>/page.tsx` (and a `layout.tsx` if it needs its own scoped accent color, following `src/app/focus-flex/layout.tsx` as a template).
2. Set that initiative's `status: "live"` and add `href: "/<slug>"` in `initiatives.ts`.
3. Add the route to `src/app/sitemap.ts`.

No other page needs to change — nav, footer, and the Programs/About listings all read from the data layer.

## Forms

- **Contact form** (`/contact`) posts to `src/app/api/contact/route.ts`, which validates the payload and currently logs it server-side. Wire it to a transactional email provider (Resend, Postmark, etc.) inside that route to deliver messages to `markedminds@gmail.com` — the client contract won't need to change.
- **Newsletter signup** (footer) posts to `src/app/api/newsletter/route.ts`. Wire it to a real list provider (Mailchimp, ConvertKit, a Resend audience) the same way.

## SEO

- Per-page `metadata` (title template, description, canonical) in every `page.tsx`.
- Site-wide OpenGraph/Twitter defaults plus a generated `opengraph-image` (`next/og`) in `layout.tsx` / `app/opengraph-image.tsx`.
- `app/sitemap.ts` and `app/robots.ts` (served at `/sitemap.xml` and `/robots.txt`).
- `Organization` JSON-LD structured data injected in the root layout.
- Generated favicon (`app/icon.tsx`) and Apple touch icon (`app/apple-icon.tsx`) — no binary assets to manage.

Before launch, update `site.url` in `src/lib/data/site.ts` to the live production domain — it feeds `metadataBase`, the sitemap, robots, and JSON-LD.

## Photography & Video

The Gallery, Impact, and Home pages render styled placeholder tiles (see `components/shared/gallery-grid.tsx`) until real photography/video is available. Swap them in by adding `src` (photo) or `videoUrl` (video) fields to `GalleryItem` in `lib/data/gallery.ts` and updating `GalleryGrid` to render an `<Image>` / video embed when present — the data shape and page markup won't need to change.

## Deployment (Vercel)

1. Push this repository to GitHub (see commands below).
2. In Vercel: **New Project → Import** the `markedminds-website` repo.
3. Framework preset: Next.js (auto-detected). No environment variables are required for the current build.
4. Deploy. Vercel builds with `next build` and serves the App Router output automatically.
5. Add the production domain in Vercel's Domains settings, then update `site.url` in `src/lib/data/site.ts` to match and redeploy.

### Connecting this local project to GitHub

```bash
git remote add origin https://github.com/reelradical/markedminds-website.git
git add .
git commit -m "Build production Marked Minds website"
git push -u origin main
```

(If the remote already exists, use `git remote set-url origin https://github.com/reelradical/markedminds-website.git` instead of `add`.)
