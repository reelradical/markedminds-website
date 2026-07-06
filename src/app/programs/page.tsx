import type { Metadata } from "next";

import { currentPrograms, futurePrograms } from "@/lib/data/programs";
import { currentInitiatives } from "@/lib/data/initiatives";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { ProgramCard } from "@/components/shared/program-card";
import { InitiativeCard } from "@/components/shared/initiative-card";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Marked Minds' current educational programs and what's coming next, from Focus + FLEX Academy to future workshops and camps.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Every program starts with one question: what does this student need?"
        description="Focus + FLEX Academy is live today. A growing slate of workshops, coaching, and camps is in development to reach students in more ways."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Current" title="Live right now." />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentPrograms.map((program) => (
              <AnimatedSection key={program.name}>
                <ProgramCard program={program} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Future"
            title="In development."
            description="These programs are being designed based on direct feedback from the families and partners we already serve."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {futurePrograms.map((program, i) => (
              <AnimatedSection key={program.name} delay={i * 0.06}>
                <ProgramCard program={program} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Beyond Focus + FLEX"
            title="The wider Marked Minds portfolio."
            description="Focus + FLEX Academy is one initiative under the Marked Minds umbrella. These are taking shape alongside it."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentInitiatives
              .filter((initiative) => initiative.status === "planned")
              .map((initiative, i) => (
                <AnimatedSection key={initiative.name} delay={i * 0.06}>
                  <InitiativeCard initiative={initiative} />
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
