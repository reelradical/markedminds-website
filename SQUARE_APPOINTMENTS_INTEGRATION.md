# Square Payment Links — Fixed-Price Services

## Status: live

The 3 fixed-price service cards on `/black2school` now link directly to real Square Payment
Links. This replaces the Square Appointments booking approach originally planned (see "What
changed" below) — payment happens immediately at a fixed URL; there is no time-slot picker.
Scheduling is a separate, manual step Dani handles after purchase.

---

## What changed

The original plan (see git history for the prior version of this doc) was to use **Square
Appointments** — a booking flow where a client picks a time slot AND pays in one step. That was
replaced with **Square Payment Links** instead: a simple fixed-price checkout page with no
scheduling built in. Every reference to `bookingUrl`/`bookingCtaLabel`/Appointments booking has
been renamed or removed from the codebase accordingly (`paymentUrl` / `PURCHASE_CTA_LABEL`).

---

## Current flow (live)

1. Client clicks **"Purchase & Schedule"** on a fixed-price card (Educator Strategy Consultation,
   AI-Supported Planning Session, or Coding Integration Planning Session).
2. The card opens that service's Square Payment Link in a new tab. The client pays there,
   optionally entering `B2S20` for 20% off.
3. **No appointment time is assigned at checkout.** A notice beneath the fixed-price cards says
   so explicitly: "After your purchase is complete, Marked Minds will contact you within one
   business day to coordinate your session. Purchasing a session does not automatically assign
   an appointment time."
4. Dani manually follows up (checking Square's own dashboard for completed payments) to schedule
   the session. **This step is not automated** — there is no code-level connection between a
   completed Square payment and Airtable or the website; Dani tracks this herself in Square.

Inquiry-only services are entirely unaffected by any of this — see "Inquiry-only services are
unchanged" below.

---

## Live Payment Links

| Service | Price | Payment Link |
|---|---|---|
| Educator Strategy Consultation | $75 ($60 with B2S20) | https://square.link/u/9xlhrR58 |
| AI-Supported Planning Session | $125 ($100 with B2S20) | https://square.link/u/vURRSzzs |
| Coding Integration Planning Session | $125 ($100 with B2S20) | https://square.link/u/jspKFIyA |

Set on each entry's `paymentUrl` field in `src/lib/data/campaign-content.ts` (`supportOptions`
array). If a link ever needs to change (e.g. the service is edited in Square and gets a new URL),
update `paymentUrl` there and redeploy — leaving it unset falls back safely to the inquiry form.

---

## Relevant fields (`src/lib/data/campaign-content.ts`)

```ts
export type SupportOption = {
  // ...
  /**
   * Square Payment Link for fixed-price services. Payment happens
   * immediately at this link; scheduling is coordinated afterward by Dani
   * (see fixedPricePurchaseNotice) — this is NOT a Square Appointments
   * booking page and has no time-slot picker. Leave unset (not a
   * placeholder string) until the real link exists; the card falls back
   * to the inquiry form automatically.
   */
  paymentUrl?: string;
};

/** Uniform CTA label for any fixed-price service once its Payment Link is live. */
export const PURCHASE_CTA_LABEL = "Purchase & Schedule";

/** Shown beneath the fixed-price service cards. */
export const fixedPricePurchaseNotice = "...";
```

The card CTA (`src/components/campaign/campaign-landing-page.tsx`):

```tsx
{option.paymentUrl ? (
  <a
    href={option.paymentUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-auto"
    onClick={() =>
      trackEvent(`${campaign.slug}_purchase_fixed`, {
        service: option.serviceValue,
        campaign: campaign.analytics.campaign,
      })
    }
  >
    <Button variant="outline" className="w-full">
      {PURCHASE_CTA_LABEL}
    </Button>
  </a>
) : (
  <Button
    variant="outline"
    className="mt-auto"
    onClick={() => handleChooseSupport(option.serviceValue)}
  >
    {option.ctaLabel}
  </Button>
)}
```

The "Choose Your Support" section now renders fixed-price and inquiry-only options as two
visually separate groups (fixed-price cards, then the campaign-messaging line and scheduling
notice, then the inquiry-only cards) rather than one mixed grid.

---

## Inquiry-only services are unchanged

The 7 inquiry-only services (Team Training, School-Wide PD, In-Person Sessions, Custom
Workshops, Custom Resource Packets, Travel-Based Engagements, Large-Group Training) still route
through the exact same flow as before:

```
Inquiry-only card CTA
  → Scrolls to inquiry form
  → Submission → Airtable Intake Queue (system of record)
  → Dani reviews → complimentary strategy consultation → custom invoice
```

None of this was touched by the Payment Link change.

---

## Open item: the generic floating widget

`site.squareAppointmentsWidgetSrc` still loads a real **Square Appointments** buyer widget
(a floating "Book Now" button, sitewide on campaign pages) — a genuinely different flow, with
its own time-slot picker, than the Payment Link flow the 3 fixed-price cards now use. This means
a visitor could plausibly book one of the same 3 services through the floating widget and get a
different experience (pick-a-time-then-pay) than clicking the dedicated card ("Purchase & Schedule"
→ pay now, get scheduled later). Left in place for now since removing a separate, sitewide
feature wasn't part of this change — worth a decision on whether to keep, remove, or reconfigure
it now that the fixed-price cards have their own dedicated flow.

---

## Known limitations

- No automated link between a completed Square Payment Link purchase and an Airtable record —
  Dani tracks fixed-price purchases directly in Square, separately from the Airtable Intake
  Queue (which only captures inquiry-only submissions).
- The B2S20 discount must be entered manually by the client at Square checkout; nothing on the
  website enforces, validates, or auto-applies it.
- If Square coupon scoping doesn't restrict `B2S20` to exactly these 3 services, it could
  theoretically be misapplied elsewhere in Square's checkout — this is a Square-side
  configuration concern, not a website one.
