import Script from "next/script";

// Only rendered by RootLayout when NEXT_PUBLIC_CLARITY_ID is set — see
// src/app/layout.tsx and the "Analytics" section in README.md.
export function MicrosoftClarity({ clarityId }: { clarityId: string }) {
  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `}
    </Script>
  );
}
