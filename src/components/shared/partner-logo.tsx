import type { Partner } from "@/lib/data/partners";

// Placeholder wordmark tile until real partner logo assets are supplied.
// Swap the inner content for an <Image> once files land in /public/partners.
export function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border border-ink/8 bg-white px-4 text-center transition-colors hover:border-ink/20">
      <span className="text-sm font-semibold tracking-tight text-ink">
        {partner.name}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-charcoal/50">
        {partner.category}
      </span>
    </div>
  );
}
