import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/data/partners";

// Placeholder wordmark tile until real partner logo assets are supplied.
// Swap the inner content for an <Image> once files land in /public/partners.
export function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div
      className={cn(
        "flex h-24 flex-col items-center justify-center gap-1 rounded-xl border px-4 text-center transition-colors",
        partner.placeholder
          ? "border-dashed border-ink/15 bg-mist/40"
          : "border-ink/8 bg-white hover:border-ink/20",
      )}
    >
      <span
        className={cn(
          "text-sm font-semibold tracking-tight",
          partner.placeholder ? "text-charcoal/50" : "text-ink",
        )}
      >
        {partner.name}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-charcoal/50">
        {partner.note ?? partner.category}
      </span>
    </div>
  );
}
