import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  fall2026ProgramDetails,
  runClubPillars,
  fall2026Goals,
  kilometerKidsUrl,
} from "@/lib/data/run-club";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { PillarCard } from "@/components/academy/pillar-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";

export const metadata: Metadata = {
  title: "Run Club | Bouldercrest",
  description:
    "Focus + FLEX Run Club | Bouldercrest is a year-round Focus + FLEX Academy community running program, participating in Kilometer Kids, Atlanta Track Club's youth running program.",
  alternates: { canonical: "/focus-flex/run-club" },
};

export default function RunClubPage() {
  return (
    <>
      <PageHero
        eyebrow="A Focus + FLEX Community Program"
        title="Focus + FLEX Run Club | Bouldercrest"
        description="Movement. Confidence. Community."
        academy
      />

      {/* Intro */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col gap-5 text-lg leading-7 text-charcoal/80">
            <p>
              Focus + FLEX Run Club | Bouldercrest is a community-based youth
              running program powered by Focus + FLEX Academy and
              participating in Kilometer Kids, Atlanta Track Club&apos;s
              youth running program.
            </p>
            <p>
              Our goal is not simply to create faster runners. We want young
              people to experience what happens when they set a goal, keep
              showing up, encourage their teammates, and discover that
              movement can be fun.
            </p>
            <p>
              Through running games, team challenges, healthy movement, and
              intentional encouragement, participants strengthen endurance
              while building skills that matter in school and life:
              perseverance, self-confidence, goal setting, teamwork, and
              healthy habits.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Program Information */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Fall 2026 Season"
            title="Program details."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fall2026ProgramDetails.map((detail, i) => {
              const Icon = iconMap[detail.icon];
              return (
                <AnimatedSection
                  key={detail.label}
                  delay={i * 0.05}
                  className="flex flex-col gap-3 rounded-2xl border border-ink/8 bg-white p-6"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-academy-purple/10 text-academy-purple">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                      {detail.label}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                      {detail.value}
                    </p>
                    {detail.subValue && (
                      <p className="mt-1 text-sm leading-5 text-charcoal/60">
                        {detail.subValue}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* More Than Miles */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Focus + FLEX Framework"
            title="More than miles."
            description="Every practice is built around the same four pillars that shape every Focus + FLEX experience."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {runClubPillars.map((pillar, i) => (
              <AnimatedSection key={pillar.name} delay={i * 0.08}>
                <PillarCard pillar={pillar} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Powered by Community */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <AnimatedSection className="rounded-2xl border border-academy-purple/15 bg-white p-8 sm:p-12">
            <Badge variant="academy" className="w-fit">
              Powered by Community
            </Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Part of Kilometer Kids
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/80">
              Focus + FLEX Run Club | Bouldercrest participates in Kilometer
              Kids, an Atlanta Track Club youth running program. Kilometer
              Kids provides youth running curriculum, coach resources,
              mileage-tracking support, participant incentives, and event
              opportunities.
            </p>
            <p className="mt-4 text-sm leading-6 text-charcoal/60">
              This partnership is specific to Focus + FLEX Run Club |
              Bouldercrest and its participation in Kilometer Kids — it does
              not represent a sponsorship of, or partnership with, Marked
              Minds or Focus + FLEX Academy as a whole.
            </p>
            <a
              href={kilometerKidsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-academy-purple hover:text-academy-purple-dark"
            >
              Learn more about Kilometer Kids at Atlanta Track Club
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Community Partners */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Community Partners"
            title="Who makes this possible."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AnimatedSection className="flex flex-col gap-2 rounded-2xl border border-ink/8 bg-mist/60 p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                Atlanta Track Club
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-academy-purple">
                Kilometer Kids Youth Running Program
              </p>
              <p className="mt-2 text-sm leading-6 text-charcoal/70">
                Atlanta Track Club supports youth movement, running, healthy
                habits, and community-based programming through Kilometer
                Kids.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.08} className="flex flex-col gap-2 rounded-2xl border border-ink/8 bg-mist/60 p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                Bouldercrest Park
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-academy-purple">
                Community Practice Site
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Fall 2026 Goals */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Fall 2026 Goals"
            title="What we're working toward."
            description="These are season goals, not yet outcomes — real results (participants, attendance, miles completed, and more) will replace this list once Fall 2026 concludes."
            align="center"
            className="mx-auto"
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fall2026Goals.map((goal) => (
              <li
                key={goal}
                className="rounded-xl border border-ink/8 bg-white px-5 py-4 text-sm leading-6 text-charcoal/80"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-academy-purple py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Want to know more about Run Club?
          </h2>
          <p className="max-w-xl text-balance text-lg leading-7 text-white/80">
            Reach out and our team will walk you through what to expect,
            how practices work, and how your family can get involved.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" variant="inverse">
              <Link href="/contact">
                Get In Touch
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-inverse">
              <Link href="/focus-flex">Back to Focus + FLEX Academy</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
