import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Layers3,
  PackageOpen,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Planner",
  description:
    "Marked Minds Planner helps teachers shape realistic learning experiences around the students, time, materials, environment, and constraints they actually have.",
  alternates: { canonical: "/plan" },
};

const realities = [
  {
    title: "Instructional time",
    description: "Build around the minutes available, including transitions and cleanup.",
    icon: Clock3,
  },
  {
    title: "The students in the room",
    description: "Keep developmental level, class size, and learning needs in view.",
    icon: UsersRound,
  },
  {
    title: "Materials and prep",
    description: "Work with what is available without quietly creating more work for tomorrow.",
    icon: PackageOpen,
  },
  {
    title: "Real classroom constraints",
    description: "Account for access, management, likely friction, and backup options.",
    icon: ShieldCheck,
  },
];

const modes = [
  { name: "Plan Tomorrow", status: "First workflow" },
  { name: "Fix My Lesson", status: "Planned" },
  { name: "Emergency Plan", status: "Planned" },
  { name: "Differentiate", status: "Planned" },
];

export default function PlannerLandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-24 pt-28 text-white sm:pb-32 sm:pt-36">
        <div
          aria-hidden="true"
          className="absolute -right-24 top-8 size-80 rounded-full bg-brand-orange/20 blur-3xl sm:size-[28rem]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-32 size-96 rounded-full bg-white/5 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
              Marked Minds Planner
            </p>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Plan for the class you actually have.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/70 sm:text-xl">
              Teachers already know what they need to teach. Marked Minds Planner helps turn
              that responsibility into a realistic learning experience based on the actual
              students, instructional time, materials, environment, and constraints available.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="inverse" size="lg">
                <Link href="/planner">
                  Try the Planner
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline-inverse" size="lg">
                <a href="#how-it-works">See the approach</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/50">Early product preview. Planning tools are coming next.</p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-sm">
              <div className="rounded-[1.4rem] bg-white p-6 text-ink sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-ink/8 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">
                      Planning context
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold">Tomorrow, 10:15 AM</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-full bg-ink text-white">
                    <Layers3 className="size-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Time", "42 minutes"],
                    ["Class", "28 learners"],
                    ["Materials", "No copies"],
                    ["Transition", "5 minutes"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-mist p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">{label}</p>
                      <p className="mt-1 font-medium text-ink">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-brand-orange/25 bg-brand-orange/8 p-4">
                  <p className="text-sm leading-6 text-charcoal/80">
                    A useful plan starts with the conditions around the lesson—not an idealized classroom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">Built around reality</p>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              The same lesson changes when the conditions change.
            </h2>
            <p className="mt-5 text-lg leading-8 text-charcoal/70">
              The Planner is being designed to make those conditions part of the plan from the beginning.
            </p>
          </AnimatedSection>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {realities.map(({ title, description, icon: Icon }, index) => (
              <AnimatedSection key={title} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-ink/8 bg-mist p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-ink text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/70">{description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">A focused starting point</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">One tool, several planning moments.</h2>
              <p className="mt-5 text-lg leading-8 text-charcoal/70">
                Plan Tomorrow will be the first workflow. The broader product direction remains visible without pretending unfinished tools are ready.
              </p>
            </AnimatedSection>
            <div className="grid gap-3 sm:grid-cols-2">
              {modes.map((mode, index) => (
                <AnimatedSection key={mode.name} delay={index * 0.05}>
                  <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-ink/8 bg-white p-6">
                    <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{mode.status}</span>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{mode.name}</h3>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-orange py-20 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/60">Marked Minds Planner</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Start with the classroom in front of you.
          </h2>
          <Button asChild size="lg" className="mt-8">
            <Link href="/planner">
              Try the Planner
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
