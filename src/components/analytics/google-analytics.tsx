import Script from "next/script";

// Real GA4 measurement IDs are always "G-" followed by alphanumerics.
// Guards against malformed env var values (e.g. accidental duplication
// or stray whitespace/newlines) producing broken inline script content.
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

// Only rendered by the marketing layout when NEXT_PUBLIC_GA_ID is set. The
// Planner application deliberately does not load marketing analytics.
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const trimmedGaId = gaId.trim();
  if (!GA_ID_PATTERN.test(trimmedGaId)) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trimmedGaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trimmedGaId}');
        `}
      </Script>
    </>
  );
}
