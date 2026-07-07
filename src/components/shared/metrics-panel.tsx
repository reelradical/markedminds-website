import type { Metric } from "@/lib/data/metrics";
import { AnimatedSection } from "@/components/shared/animated-section";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";

// Renders confirmed metrics as full stat cards. Unconfirmed metrics
// (value === null) collapse into a single honest panel listing what's
// being tracked, rather than repeating "Coming soon" across several
// empty-looking cards.
export function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  const confirmed = metrics.filter((metric) => metric.value !== null);
  const pending = metrics.filter((metric) => metric.value === null);

  return (
    <div className="flex flex-col gap-6">
      {confirmed.length > 0 && (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          {confirmed.map((metric, i) => (
            <AnimatedSection key={metric.label} delay={i * 0.05}>
              <MetricCard metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <AnimatedSection className="rounded-2xl border border-dashed border-ink/15 bg-mist/60 p-8 text-center">
          <p className="text-charcoal/70">
            {confirmed.length > 0
              ? "We're also tracking:"
              : "We're building our first full impact report. Here's what we're tracking:"}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {pending.map((metric) => (
              <Badge key={metric.label} variant="outline">
                {metric.label}
              </Badge>
            ))}
          </div>
          <p className="mt-5 text-sm text-charcoal/50">
            Real numbers will replace this as program data is confirmed.
          </p>
        </AnimatedSection>
      )}
    </div>
  );
}
