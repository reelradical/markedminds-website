import { iconMap } from "@/lib/icon-map";
import type { Pillar } from "@/lib/data/academy";

export function PillarCard({ pillar }: { pillar: Pillar }) {
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
