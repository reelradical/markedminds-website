# Marked Minds Email Style Guide

Every customer-facing email should feel like it came from a thoughtful
educator, creative director, and founder — not an automated system.
Someone should recognize a Marked Minds email without seeing the logo.

This guide is for anyone (human or AI) writing a new template in
`src/emails/`. It documents the conventions established in
`educator/InquiryConfirmation.tsx` and `focus-flex/InterestConfirmation.tsx`
— follow those two as reference implementations.

## Scope: who this applies to

**Customer-facing templates** (anything a real person outside Marked
Minds receives) — follow every convention below.

**Internal-only templates** (`internal/NewInquiryNotification.tsx` and
anything like it, sent to Dani/staff, never to a customer) are exempt
from the voice/greeting/signature/CTA conventions — they're an
operational tool, not a brand-experience moment. They still use the
shared `BaseEmail`/`Header`/`Footer` for visual consistency, just not the
human voice.

## Brand voice

We are: **thoughtful, optimistic, creative, encouraging, human, editorial.**

We are never: **robotic, overly enthusiastic, salesy, corporate, generic.**

Think Apple, Notion, Airbnb, Linear — minimal, warm, intentional. The
recipient should feel welcomed and confident, not marketed to.

## Structure of a customer-facing email

1. **Greeting** — first line, always. `Hi {firstName},` (or `Hi there,`
   if no name is available). Never lead with a cold system-style heading
   like "Request received." If you need a heading at all, it's a sign the
   greeting isn't doing enough work — prefer folding the point into the
   first sentence instead.
2. **Body** — 2–4 short paragraphs, first-person from Dani where it reads
   naturally ("I'll personally review your request..."). State every
   required fact plainly (what happens next, what's on file, what
   expires when) but in sentences a person would actually say out loud,
   not a notice.
3. **One CTA** — see below.
4. **Signature** — the `<Signature />` component, always.
5. **Footer** — the `<Footer />` component, always.

## Greetings

```
Hi {firstName},
```

Falls back to `Hi there,` only when no name exists (e.g. Focus + FLEX
interest signups where a name wasn't parsed confidently).

## Headings

Avoid them in customer-facing templates. The greeting + first sentence
should carry the "why you're getting this email" job that a heading
would otherwise do. (Internal templates are the exception — a small
`<Heading>` there is fine, since it's a scan-fast operational tool.)

## Signature

Always the shared `<Signature />` component
(`src/emails/components/Signature.tsx`). Default closing line is
`"Looking forward to connecting,"` — pass a different `closing` prop
only when the default genuinely doesn't fit the message.

```tsx
<Signature />
// or
<Signature closing="Talk soon," />
```

Renders as:

```
Looking forward to connecting,

Dani Cummings
Founder & Creative Director
Marked Minds LLC

Questions? markedminds@gmail.com
```

## CTA conventions

Exactly **one** CTA per customer-facing email, placed after the body and
before the signature. Use the shared `<CTA href="...">` component. Label
as a natural next step, never sales language:

- "Visit Marked Minds"
- "Learn more about Focus + FLEX"
- "Explore educator resources"
- "Return to the website"

Not: "Click here," "Learn More!!!," "Don't miss out," anything with an
exclamation point.

## Footer conventions

Always the shared `<Footer />` component
(`src/emails/components/Footer.tsx`). It shows `site.pillarsLine` (the
same tagline used sitewide, e.g. the homepage hero) and a plain
`markedminds.com` link — nothing else. Contact info lives in the
Signature, not the Footer, so it isn't repeated twice in one email.

## Header

Always the shared `<Header />` component
(`src/emails/components/Header.tsx`). Centered wordmark logo (the
tagline-free crop, `marked-minds-wordmark-only.png`) with a small,
muted, real-text tagline beneath (`site.tagline`, uppercase, letter-spaced
— not baked into the logo image, so it still renders if images are
blocked). Subtle — this is a header, not a hero banner.

## Composing a new template

```tsx
import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Signature } from "@/emails/components/Signature";
import { Footer } from "@/emails/components/Footer";
import { CTA } from "@/emails/components/CTA";

export function SomeTemplate({ firstName }: { firstName: string }) {
  return (
    <BaseEmail previewText="...">
      <Header />
      {/* Section + Text: greeting, then 2-4 short warm paragraphs */}
      <CTA href="https://markedminds.com/...">One clear next step</CTA>
      <Signature />
      <Footer />
    </BaseEmail>
  );
}
```

Do not add a template with placeholder/fabricated copy — wait for real,
approved content for that program area first, same as before.
