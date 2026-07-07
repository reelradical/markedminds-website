# Marked Minds — Content Style Guide

Version 1.0 — July 2026

## Voice

Confident, human, creative-first. Marked Minds is a studio, not a
brochure — write like one. Prefer concrete verbs (design, build, tell,
create) over vague ones (empower, unlock, elevate).

## Taglines

"We Curate Culture." is the Marked Minds tagline — use it, don't avoid or
soften it. The job of the surrounding copy (subheadline, pillars line,
Four Pillars section) is to *explain* what it means, not to replace it.
Never substitute "Create. Teach. Build. Connect." for the tagline itself —
it's a supporting line. See `BRAND_GUIDE.md` for the full tagline
hierarchy, including Focus + FLEX Academy's separate tagline ("Learn.
Grow. Create. Thrive.") which never appears outside Focus + FLEX
pages/sections.

## Preferred Language

Use:

- Creative innovation studio
- Education and media company
- Community-centered creative work
- Storytelling, learning, and design
- Youth programs and educator workshops
- Production, strategy, and creative direction
- Woman-owned and veteran-owned (once, in the About/Founder section only)

Avoid:

- "Education nonprofit" / "education company" as the primary identity
- Leading with or dwelling on military service, rank, or service history
- "Black-owned" or "queer-owned" language — not currently approved for use

## Naming Conventions

- **Focus + FLEX Academy** — always the full name on first mention per
  page; "Focus + FLEX" is fine on repeat mentions within the same page.
- **Dream Deferred** — no "The" prefix, always capitalized as a proper name.
- **Marked Minds** vs **Marked Minds LLC** — use "Marked Minds LLC" for
  legal/formal contexts (schema.org data, footer copyright, founder
  section); "Marked Minds" everywhere else.
- **Dani Cummings** — permanent decision, confirmed directly by the
  founder. Use "Dani," never "Danielle," anywhere on the site (About/
  Founder section, code comments, future bios). This applies across the
  entire Marked Minds ecosystem, not just this site.

## No Dead Links

Don't link to a domain or profile that isn't live yet, even if you know
the eventual URL. Show it as plain text (e.g. "coming soon at
example.com") instead of an `<a href>`, and re-enable the link once it
resolves. This is why `DaniCummings.com` appears as plain text in the
About page's Founder section rather than a clickable link — same
principle as the honest-placeholder rule below, applied to navigation
rather than content.

## The No-Fabrication Rule

This is the most important rule in this guide. **Never invent:**

- Partner names, logos, or relationships
- Testimonial quotes or the people attributed to them
- Impact statistics (student counts, dollar amounts, hours, etc.)
- Episode titles, show details, or listen-link URLs
- Session enrollment status, dates, or capacity

When real information isn't available yet, use an honest placeholder
instead of a plausible-sounding invention:

| Situation | Pattern |
|---|---|
| Unconfirmed metric | `value: null` in `metrics.ts` → renders "Coming soon" |
| No real testimonial yet | Role-only attribution + "Testimonial coming soon." (see `testimonials.ts`) |
| Unconfirmed partner | `placeholder: true` in `partners.ts` → renders in a dashed, muted tile |
| No real URL yet | Leave the field as an empty string (`""`), never a guessed URL — consuming components should render a "coming soon" state instead of a dead or fake link (see `dream-deferred.ts` → `ListenLinks`, `site.ts` → `founderLinkedinUrl`) |

If you're editing copy and don't know a real number or name, stop and ask
rather than filling the gap with something that sounds right.

## Focus + FLEX Session Language

- Session I: always **completed**, past tense.
- Session II: **upcoming** / **preparing to launch** — update
  `academy.ts` → `sessions` directly if enrollment status changes (e.g. to
  "currently enrolling").

## Purple Usage

Academy purple is reserved for Focus + FLEX Academy. If you're writing
copy or a component that isn't specifically about Focus + FLEX, don't
introduce purple — use the core black/white/charcoal/silver/orange system.
