import type { Metadata } from "next";

import { coreValues, timeline } from "@/lib/data/about";
import { iconMap } from "@/lib/icon-map";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the history, mission, vision, and values behind Marked Minds LLC, and the founder story that started it all.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Marked Minds"
        title="Built by educators who refused to accept the status quo."
        description="Marked Minds exists because too many capable students were being let down by learning environments that weren't built for them."
      />

      {/* History & Founder Story */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Our History
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
              A response to a real gap.
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">
              Marked Minds LLC was founded to close the distance between what
              students are capable of and what traditional classrooms often
              have the capacity to offer. We started with a simple question:
              what would education look like if it were designed around the
              learner first? The answer became Focus + FLEX Academy, our
              flagship initiative, and the foundation for everything Marked
              Minds is building next.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Founder Story
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
              Rooted in classrooms, not conference rooms.
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">
              Our founder spent years in classrooms and community programs
              watching brilliant students get labeled as behind, disengaged,
              or difficult — when what they actually needed was a different
              structure, not a different diagnosis. Marked Minds was built to
              be that structure: rigorous, creative, and deeply human. Every
              program we design carries that same conviction forward.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <AnimatedSection className="rounded-2xl bg-ink p-10 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              Mission
            </h3>
            <p className="mt-4 text-2xl font-medium leading-snug tracking-tight">
              To develop innovative educational experiences that empower
              learners, strengthen communities, and inspire lifelong
              curiosity.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="rounded-2xl border border-ink/8 bg-white p-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Vision
            </h3>
            <p className="mt-4 text-2xl font-medium leading-snug tracking-tight text-ink">
              A future where every learner has access to an education that
              recognizes their potential and gives it somewhere to go.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Values"
            title="The principles that shape every decision we make."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, i) => {
              const Icon = iconMap[value.icon];
              return (
                <AnimatedSection
                  key={value.name}
                  delay={i * 0.06}
                  className="rounded-2xl border border-ink/8 bg-mist/60 p-7"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight text-ink">
                    {value.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-charcoal/70">
                    {value.description}
                  </p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Story So Far"
            title="Organization Timeline"
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 flex flex-col gap-10">
            {timeline.map((entry, i) => (
              <AnimatedSection
                key={entry.title}
                delay={i * 0.08}
                className="relative flex gap-6 border-l-2 border-ink/10 pl-8"
              >
                <span className="absolute -left-2.25 top-1 size-4 rounded-full border-2 border-white bg-brand-orange" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange-dark">
                    {entry.year}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-charcoal/70">{entry.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
