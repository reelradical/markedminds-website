// Safe wrapper around the sitewide GA4 gtag() call for one-off campaign
// events (page views, CTA clicks, form funnel steps). No-ops silently if
// GA hasn't loaded (env var unset, script blocked, ad blocker, etc.) —
// event tracking should never be able to break a page.
type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  } catch {
    // Analytics must never break the page it's measuring.
  }
}
