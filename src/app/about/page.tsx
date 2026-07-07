import type { Metadata } from "next";

import { coreValues, timeline } from "@/lib/data/about";
import { site } from "@/lib/data/site";
import { iconMap } from "@/lib/icon-map";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Timeline } from "@/components/shared/timeline";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the history, mission, vision, values, and founder story behind Marked Minds LLC, a creative innovation studio.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Marked Minds"
        title="A creative innovation studio built to help people, brands, and communities grow."
        description="Marked Minds LLC designs experiences, tells meaningful stories, builds learning opportunities, and helps people, brands, and communities grow."
      />

      {/* History */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Our History
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
              A space for creative-minded people to build together.
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">
              Marked Minds LLC was founded in 2017 as a space for
              creative-minded people to connect, collaborate, promote one
              another, educate one another, and build meaningful work
              together. That vision grew into storytelling and community
              media, then educator workshops and youth media, then creative
              production — photography, video, editing, graphics, and brand
              storytelling. Along the way, it grew into practical uses of AI
              for creativity, planning, and teaching, and into Focus + FLEX
              Academy, one direct expression of that founding mission.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Founder
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
              Founded by Dani Cummings.
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">
              Marked Minds reflects the intersection of creativity,
              education, media, strategy, and community work — founder,
              educator, creative director, producer, workshop facilitator,
              and strategist. Marked Minds LLC is a {site.ownership.toLowerCase()}.
            </p>
            {/* DaniCummings.com is not live yet — intentionally not linked
                until it is (see docs/BRAND_GUIDE.md: no dead links). */}
            <p className="mt-4 text-sm font-medium text-charcoal/50">
              Full professional profile coming soon at DaniCummings.com
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <AnimatedSection className="rounded-2xl bg-ink p-10 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              Mission
            </h3>
            <p className="mt-4 font-display text-2xl font-medium leading-snug tracking-tight">
              To design experiences, tell meaningful stories, build learning
              opportunities, and help people, brands, and communities grow.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="rounded-2xl border border-ink/8 bg-mist/60 p-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Vision
            </h3>
            <p className="mt-4 font-display text-2xl font-medium leading-snug tracking-tight text-ink">
              A future where creativity, education, and community work are
              treated as one practice — not three separate industries.
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
          <div className="mt-14">
            <Timeline entries={timeline} />
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
