import Link from "next/link";

import { cn } from "@/lib/utils";

// The real Marked Minds wordmark (transparent background) is only clean
// for light contexts today. Dark contexts (e.g. the Footer) fall back to
// the text mark until a transparent white-on-dark lockup is supplied —
// see docs/ROADMAP.md.
export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  if (invert) {
    return (
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white",
          className,
        )}
      >
        <span
          className="inline-block size-2.5 rounded-full bg-brand-orange"
          aria-hidden="true"
        />
        Marked Minds
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- vector logo, no raster optimization needed */}
      <img
        src="/logos/marked-minds-logo-white-black-orange.svg"
        alt="Marked Minds — We Curate Culture"
        className="h-14 w-auto"
      />
    </Link>
  );
}
