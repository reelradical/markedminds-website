import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        invert ? "text-white" : "text-ink",
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
