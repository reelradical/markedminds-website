import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HandCoins } from "lucide-react";

import { learningModel, academicPillars, sessions, academyTagline } from "@/lib/data/academy";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { PillarCard } from "@/components/academy/pillar-card";
import { SessionCard } from "@/components/academy/session-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Focus + FLEX Academy",
  description:
    "Focus + FLEX Academy, a Marked Minds Initiative, delivers small-group, project-based learning across academics, AI literacy, and social-emotional growth.",
  alternates: { canonical: "/focus-flex" },
};

export default function FocusFlexPage() {
  return (
    <>
      <PageHero
        eyebrow="A Marked Minds Initiative"
        title="Focus + FLEX Academy"
        description="Small-group, project-based learning designed to build academic skill, creative confidence, and emotional resilience — together."
        academy
      >
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-academy-purple">
          {academyTagline}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="academy">
            <Link href="/contact">
              Enroll Interest
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/donate">Fund a Scholarship</Link>
          </Button>
        </div>
      </PageHero>

      {/* Learning Model */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="How We Teach"
            title="A learning model built around real engagement."
            description="Focus + FLEX Academy pairs two proven approaches so every student is known individually and challenged meaningfully."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {learningModel.map((pillar, i) => (
              <AnimatedSection key={pillar.name} delay={i * 0.08}>
                <PillarCard pillar={pillar} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Pillars */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="What Students Learn"
            title="Ten pillars, one integrated experience."
            description="Every session weaves these disciplines together rather than teaching them in isolation."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academicPillars.map((pillar, i) => (
              <AnimatedSection key={pillar.name} delay={i * 0.05}>
                <PillarCard pillar={pillar} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col items-center gap-6 rounded-2xl bg-ink px-8 py-14 text-center text-white sm:px-14">
            <div className="flex size-14 items-center justify-center rounded-full bg-academy-purple/20 text-academy-purple">
              <HandCoins className="size-7" />
            </div>
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Scholarships keep Focus + FLEX accessible.
            </h2>
            <p className="max-w-xl text-balance text-lg leading-7 text-white/70">
              No family should be turned away for financial reasons.
              Scholarships — funded by individual donors, corporate sponsors,
              and community partners — cover tuition, materials, and meals for
              qualifying students.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" variant="academy">
                <Link href="/donate">Fund a Scholarship</Link>
              </Button>
              <Button asChild size="lg" variant="outline-inverse">
                <Link href="/contact">Apply for a Scholarship</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sessions */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Sessions"
            title="Session I is complete. Session II is preparing to launch."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sessions.map((session, i) => (
              <AnimatedSection key={session.name} delay={i * 0.1}>
                <SessionCard session={session} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-academy-purple py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to learn more about Focus + FLEX Academy?
          </h2>
          <p className="max-w-xl text-balance text-lg leading-7 text-white/80">
            Reach out and our team will walk you through enrollment,
            scholarships, and what to expect from your student&apos;s first
            session.
          </p>
          <Button asChild size="lg" variant="inverse">
            <Link href="/contact">
              Get In Touch
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
