import { iconMap, type IconKey } from "@/lib/icon-map";

// Icon is typed against the full IconKey map (not academy.ts's narrower
// Pillar type) so other Focus + FLEX programs — e.g. Run Club — can reuse
// this card with their own icon choices without widening academy.ts itself.
type PillarLike = { name: string; description: string; icon: IconKey };

export function PillarCard({ pillar }: { pillar: PillarLike }) {
  const Icon = iconMap[pillar.icon];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-academy-purple/15 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex size-11 items-center justify-center rounded-full bg-academy-purple/10 text-academy-purple">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-semibold tracking-tight text-ink">{pillar.name}</h3>
        <p className="mt-1.5 text-sm leading-6 text-charcoal/70">
          {pillar.description}
        </p>
      </div>
    </div>
  );
}
