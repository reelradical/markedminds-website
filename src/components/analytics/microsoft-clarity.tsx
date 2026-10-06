import Script from "next/script";

// Only rendered by the marketing layout when NEXT_PUBLIC_CLARITY_ID is set.
// Never render this component in Planner: Clarity includes session replay.
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
