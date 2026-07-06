import { iconMap } from "@/lib/icon-map";
import type { Metric } from "@/lib/data/metrics";

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = iconMap[metric.icon];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/8 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex size-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-dark">
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-4xl font-semibold tracking-tight text-ink">
          {metric.value}
          {metric.suffix}
        </p>
        <p className="mt-1 text-sm font-medium text-charcoal/60">
          {metric.label}
        </p>
      </div>
    </div>
  );
}
