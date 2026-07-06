import { cn } from "@/lib/utils";

// The one Academy element allowed to appear anywhere on the site (per brand
// guidelines: "Academy badges" are a permitted exception) to identify
// Focus + FLEX content outside of its own pages, e.g. on the homepage teaser.
export function AcademyBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-academy-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-academy-purple",
        className,
      )}
    >
      Focus + FLEX Academy
    </span>
  );
}
