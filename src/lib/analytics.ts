// Safe wrapper around the sitewide GA4 gtag() call for one-off campaign
// events (page views, CTA clicks, form funnel steps). No-ops silently if
// GA hasn't loaded at all (env var unset, script blocked, ad blocker,
// etc.) — event tracking should never be able to break a page.
type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

const PENDING_RETRY_MS = 200;
const PENDING_MAX_ATTEMPTS = 20; // ~4s total — generous for a slow network fetch of gtag.js

// gtag.js loads via next/script strategy="afterInteractive" (an external
// network fetch) with no ordering guarantee relative to any component's
// own useEffect firing on mount. A component that tracks an event on
// mount (e.g. PurchaseConfirmedTracker) can easily run before window.gtag
// exists yet — verified live: this was silently dropping
// black2school_purchase_confirmed on every real page load. Retry briefly
// instead of dropping the event the first time gtag isn't ready.
function fireWhenReady(
  name: string,
  params: Record<string, string | number | boolean> | undefined,
  attempt: number,
) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
      return;
    }
    if (attempt >= PENDING_MAX_ATTEMPTS) return;
    setTimeout(() => fireWhenReady(name, params, attempt + 1), PENDING_RETRY_MS);
  } catch {
    // Analytics must never break the page it's measuring.
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  fireWhenReady(name, params, 0);
}
