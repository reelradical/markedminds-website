import Link from "next/link";

import { currentPrograms, futurePrograms } from "@/lib/data/programs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProgramCard } from "@/components/shared/program-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export function ProgramsSection() {
  const featured = [...currentPrograms, ...futurePrograms.slice(0, 2)];

  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Programs"
            title="Educational experiences built for real growth."
            description="From our flagship academy to workshops still in development, every program is designed around how students actually learn best."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/programs">View All Programs</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((program, i) => (
            <AnimatedSection key={program.name} delay={i * 0.08}>
              <ProgramCard program={program} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
