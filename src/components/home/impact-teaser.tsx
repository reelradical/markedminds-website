import Link from "next/link";

import { metrics } from "@/lib/data/metrics";
import { SectionHeading } from "@/components/shared/section-heading";
import { MetricsPanel } from "@/components/shared/metrics-panel";
import { Button } from "@/components/ui/button";

export function ImpactTeaser() {
  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Community Impact"
            title="Impact we're building, one relationship at a time."
            description="Every metric below represents a real student, family, or partner."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/impact">See Full Impact Report</Link>
          </Button>
        </div>

        <div className="mt-12">
          <MetricsPanel metrics={metrics.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}
