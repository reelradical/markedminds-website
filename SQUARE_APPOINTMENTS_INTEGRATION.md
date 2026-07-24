# Square Appointments Integration — Fixed-Price Services

## Problem

The 3 fixed-price service cards on `/black2school` all call `handleChooseSupport()`, which scrolls
to the inquiry form. This means:

1. Client fills out the form
2. Dani sends a payment link manually
3. Dani **still has to coordinate a time separately**

Square Appointments solves this — booking a time slot AND paying happen in one step. After a client
books through Square Appointments, the appointment is confirmed, payment is captured, and it lands
on Dani's calendar. No follow-up scheduling needed.

---

## What's already in place

- `site.squareAppointmentsWidgetSrc` is set and loading the generic widget ✓
- The widget injects a floating "Book Now" button ✓
- `SupportOption.bookingUrl` and `SupportOption.bookingCtaLabel` already exist on the type
  (`src/lib/data/campaign-content.ts`) — Step 2 below is done ✓
- The service-card CTA in `campaign-landing-page.tsx` already renders conditionally — Step 4 below
  is done ✓. All 3 fixed-price entries currently leave `bookingUrl` **unset** (not a placeholder
  string), so every card still safely falls back to the inquiry form today.

The generic widget is fine for discovery, but the fixed-price service cards should link directly to
each service's booking page so the client lands on the right one — that only needs Steps 1 and 3
below (the actual Square setup + the 3 real URLs), which are still outstanding.

---

## Step 1 — Set up the 3 services in Square Appointments (outside the codebase)

In Square Dashboard → Appointments → Services, create:

| Service Name                        | Duration | Price  |
|-------------------------------------|----------|--------|
| Educator Strategy Consultation      | 30 min   | $75.00 |
| AI-Supported Planning Session       | 60 min   | $125.00 |
| Coding Integration Planning Session | 60 min   | $125.00 |

Each service gets a unique booking URL in the format:
```
https://square.site/appointments/book/[location-id]/[service-id]
```

Copy those 3 URLs — you'll need them for Step 3.

---

## Step 2 — Add `bookingUrl` to `SupportOption` type (done ✓)

**File:** `src/lib/data/campaign-content.ts`

Already implemented, with one refinement beyond the original plan: a separate
`bookingCtaLabel` was added so the button's wording only turns booking-specific
("Book a Consultation") once a real URL exists — until then it reads "Request
This Session," so it never promises immediate booking it can't deliver.

```ts
export type SupportOption = {
  name: string;
  duration?: string;
  /** Shown when routing to the inquiry form (the default/fallback path). */
  ctaLabel: string;
  /** Shown instead of ctaLabel once a real bookingUrl exists. Falls back to ctaLabel if unset. */
  bookingCtaLabel?: string;
  serviceValue: string;
  icon: IconKey;
  pricingType: "fixed" | "inquiry";
  price: number;
  priceSuffix?: string;
  /**
   * Direct Square Appointments booking URL for fixed-price services.
   * When set, the service card CTA links here instead of scrolling to
   * the inquiry form. Leave unset (not a placeholder string) until the
   * real URL exists — the card falls back to the inquiry form automatically.
   */
  bookingUrl?: string;
};
```

---

## Step 3 — Add booking URLs to the 3 fixed-price services (outstanding — needs Dani)

**File:** `src/lib/data/campaign-content.ts`

The 3 fixed-price entries currently look like this (unset `bookingUrl`, safe fallback):

```ts
{
  name: "Educator Strategy Consultation",
  duration: "30 minutes",
  ctaLabel: "Request This Session",
  bookingCtaLabel: "Book a Consultation",
  serviceValue: "Educator Strategy Consultation",
  icon: "message-circle",
  pricingType: "fixed",
  price: 75,
  // bookingUrl not yet set
},
```

Once Dani supplies the real URLs from Step 1, add `bookingUrl: "<real Square Appointments URL>"`
to each of the 3 fixed-price entries (Educator Strategy Consultation, AI-Supported Planning
Session, Coding Integration Planning Session). Do not use a placeholder string — leaving the
field unset is what triggers the safe inquiry-form fallback.

---

## Step 4 — Update service cards to use booking links for fixed-price services (done ✓)

**File:** `src/components/campaign/campaign-landing-page.tsx`

Already implemented:

```tsx
{option.bookingUrl ? (
  <a
    href={option.bookingUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-auto"
    onClick={() =>
      trackEvent(`${campaign.slug}_book_fixed`, {
        service: option.serviceValue,
        campaign: campaign.analytics.campaign,
      })
    }
  >
    <Button variant="outline" className="w-full">
      {option.bookingCtaLabel ?? option.ctaLabel}
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

This keeps inquiry-only services routing to the inquiry form unchanged. Fixed-price services will
open Square Appointments directly as soon as Step 3's URLs are added — until then, they behave
identically to inquiry-only services (safe, not broken).

---

## Resulting flow after these changes

```
Fixed-price card CTA
  → Opens Square Appointments (picks time + pays in one step)
  → Done. Appointment on Dani's calendar. No follow-up scheduling.

Inquiry-only card CTA
  → Scrolls to inquiry form (unchanged)
  → Dani reviews → books complimentary strategy call → custom invoice
```

---

## Notes

- The generic floating Square Appointments widget (`site.squareAppointmentsWidgetSrc`) can stay as-is
  — it's a fallback discovery path and doesn't conflict with the per-service links.
- The B2S20 discount (20% off) for fixed-price services is applied at Square checkout via the coupon
  code the client enters — no changes needed to the booking URLs for that.
- If Square Appointments booking URLs change (e.g. after editing a service), update the `bookingUrl`
  values in `campaign-content.ts` and redeploy.
