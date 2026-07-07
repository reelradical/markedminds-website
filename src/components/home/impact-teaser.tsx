import Link from "next/link";

import { metrics } from "@/lib/data/metrics";
import { SectionHeading } from "@/components/shared/section-heading";
import { MetricCard } from "@/components/shared/metric-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export function ImpactTeaser() {
  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Community Impact"
            title="Impact we're building, one relationship at a time."
            description="Figures below will populate as program data is confirmed — every metric represents a real student, family, or partner."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/impact">See Full Impact Report</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {metrics.slice(0, 6).map((metric, i) => (
            <AnimatedSection key={metric.label} delay={i * 0.06}>
              <MetricCard metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
