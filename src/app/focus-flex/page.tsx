import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandCoins, Quote } from "lucide-react";

import {
  learningModel,
  academicPillars,
  sessions,
  academyTagline,
} from "@/lib/data/academy";
import { pickGalleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { SentenceBreak } from "@/components/shared/sentence-break";
import { AnimatedSection } from "@/components/shared/animated-section";
import { PillarCard } from "@/components/academy/pillar-card";
import { SessionCard } from "@/components/academy/session-card";
import { SessionInterestForm } from "@/components/academy/session-interest-form";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The fullest curated set — this is the dedicated home for Session I
// photography. Excludes g1 (classroom-small-groups): editorial call, too
// similar to g2/g3's classroom moments (see docs/CHANGELOG.md).
const sessionIPhotos = pickGalleryItems(["g2", "g3", "g4", "g5", "g6", "g12"]);

// From the Session I Pilot Evidence & Impact Report (July 2026) — parent
// survey results, 7 of 7 families responding. No dollar amounts, donor
// names, or scholar names appear on the public site; see the Focus + FLEX
// Playbook for the full report.
const sessionIStats = [
  { label: "Scholars Served", value: "13" },
  { label: "Families Served", value: "7" },
  { label: "Would Enroll Again", value: "100%" },
  { label: "Would Recommend Us", value: "100%" },
];

const weekActivities = [
  "Writing and visual literacy with a guest educator",
  "Math, chess, and strategy with our enrichment lead",
  "A multi-day budget challenge that turned problem-solving into a team project",
  "Hands-on art and creative expression",
  "First coding profiles, with take-home practice to keep going",
  "Student-led presentations scholars were genuinely proud to give",
  "FLEX Friday — a full day of celebration and community that closed out the session",
];

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
        description="Small-group, project-based learning built to give every scholar individual attention, real academic rigor, and room to be a kid — for rising 2nd–7th graders across South Metro Atlanta."
        academy
      >
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-academy-purple">
          {academyTagline}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="academy">
            <a href="#session-ii-interest">
              Join the Interest List
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/donate">Fund a Scholarship</Link>
          </Button>
        </div>
      </PageHero>

      {/* Session I Visual */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <AnimatedSection className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src="/images/focus-flex/focus-flex-session-group-photo.webp"
              alt="The Focus + FLEX Academy community gathers for a group photo."
              fill
              sizes="(min-width: 1024px) 72vw, 100vw"
              className="object-cover"
              priority
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Session I Proved the Model */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Session I Results"
            title="Session I proved the model works."
            description="In June 2026, thirteen scholars from seven South DeKalb families joined our very first session. Every family who finished the program said they'd enroll again — and every one said they'd recommend Focus + FLEX to someone else. Session I proved the idea works. Session II is how we grow it, carefully."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {sessionIStats.map((stat, i) => (
              <AnimatedSection
                key={stat.label}
                delay={i * 0.05}
                className="rounded-2xl border border-ink/8 bg-white p-6 text-center"
              >
                <p className="font-display text-4xl font-semibold tracking-tight text-academy-purple">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal/60">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

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

      {/* What Scholars Experienced */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Experience"
            title="A first look at what a week looked like."
            align="center"
            className="mx-auto"
          />
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {weekActivities.map((item, i) => (
              <li
                key={item}
                className={cn(
                  "rounded-xl border border-ink/8 bg-mist/60 px-5 py-4 text-sm leading-6 text-charcoal/80",
                  i === weekActivities.length - 1 && "sm:col-span-2",
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photo Highlights */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Session I"
            title="Moments from inside Focus + FLEX Academy."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <GalleryGrid items={sessionIPhotos} />
          </div>
        </div>
      </section>

      {/* Parent Voice */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <Quote className="mx-auto size-8 text-academy-purple/30" aria-hidden="true" />
            <p className="mt-4 text-balance font-display text-2xl font-medium leading-snug tracking-tight text-ink">
              &ldquo;So much fun I&apos;m not sure that they realized they
              were learning!&rdquo;
            </p>
            <p className="mt-3 text-sm font-medium text-charcoal/50">
              — Focus + FLEX parent
            </p>
          </AnimatedSection>
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
              No family should be turned away for financial reasons. In
              Session I, 19 individual donors and community partners helped
              cover tuition, materials, and meals — and 11 of our 13 scholars
              received scholarship support. That&apos;s the kind of community
              generosity that keeps Focus + FLEX accessible.
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
            title={
              <SentenceBreak text="Session I is complete. Session II has been postponed." />
            }
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

      {/* Session II Interest List */}
      <section id="session-ii-interest" className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <SectionHeading
            eyebrow="Stay in the Loop"
            title="Join our interest list."
            description="Thank you for the overwhelming support of Focus + FLEX Academy. We have made the decision to postpone our next session so we can continue delivering the high-quality experience our scholars deserve. Join our interest list to be the first to know when enrollment reopens."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <SessionInterestForm />
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
