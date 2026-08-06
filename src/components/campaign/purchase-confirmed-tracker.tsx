"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

// Fires once, on mount, from the thank-you page itself — deliberately
// separate from the pre-checkout click event (`${slug}_purchase_fixed`,
// fired in campaign-landing-page.tsx). That click only measures intent to
// purchase; Square opens in a new tab, so there's no reliable client-side
// link between "clicked toward checkout" and "actually completed it."
// This event is the confirmation signal. See docs/BLACK2SCHOOL_POSTMORTEM.md
// (Critical action item #2) for why the click event alone wasn't enough.
//
// Note: all three Black2School fixed-price Payment Links redirect to this
// same thank-you page, so which specific service was purchased isn't
// knowable here — only that a purchase completed.
export function PurchaseConfirmedTracker({ eventName }: { eventName: string }) {
  useEffect(() => {
    trackEvent(eventName);
  }, [eventName]);

  return null;
}
