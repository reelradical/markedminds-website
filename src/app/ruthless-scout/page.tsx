import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CircleDollarSign,
  Compass,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { FoundingPilotForm } from "@/components/ruthless-scout/founding-pilot-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ruthlessScout } from "@/lib/data/ruthless-scout";

export const metadata: Metadata = {
  title: "Ruthless Scout Career Transition Intelligence",
  description:
    "Ruthless Scout by Marked Minds helps experienced professionals translate their strengths, set life-fit career gates, and find credible opportunities worth pursuing.",
  alternates: { canonical: "/ruthless-scout" },
  openGraph: {
    title: "Ruthless Scout by Marked Minds",
    description: "Your next move should fit your life—not just your résumé.",
    url: "/ruthless-scout",
  },
};

const gateIcons = [CircleDollarSign, MapPin, BriefcaseBusiness, ShieldCheck];

export default function RuthlessScoutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink px-6 pb-24 pt-28 text-white sm:pb-28 sm:pt-36 lg:px-8">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,119,0,0.28),transparent_64%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-linear-to-r from-transparent via-brand-orange/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
              {ruthlessScout.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              {ruthlessScout.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              {ruthlessScout.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="orange">
                <a href="#founding-pilot">Apply for Founding Access</a>
              </Button>
              <Button asChild size="lg" variant="outline-inverse">
                <a href="#how-it-works">See What Survives the Filter</a>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="flex items-center gap-2"><Check className="size-4 text-brand-orange" />No ChatGPT account required</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-brand-orange" />Human-reviewed intelligence</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-brand-orange" />You make every final decision</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10" aria-hidden="true" />
            <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-charcoal shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  <Radar className="size-4 text-brand-orange" /> Opportunity Intelligence
                </div>
                <span className="rounded-full bg-brand-orange/15 px-2.5 py-1 text-[11px] font-semibold text-brand-orange">Scout online</span>
              </div>
              <div className="space-y-4 p-5">
                {["Career leverage", "Life fit", "Compensation", "Credible stretch"].map((label, index) => (
                  <div key={label} className="rounded-xl border border-white/8 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-white/75">{label}</span>
                      <strong className="font-display text-xl text-white">{[94, 91, 88, 82][index]}</strong>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-brand-orange" style={{ width: `${[94, 91, 88, 82][index]}%` }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-xl bg-brand-orange p-4 text-ink">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Why it survived</p>
                  <p className="mt-2 text-sm font-medium leading-6">The opportunity clears the non-negotiables and creates a believable bridge to the work you want next.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <Badge variant="outline">For the Dream Deferred community</Badge>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              You are not starting over. You are deciding what deserves to come with you.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-charcoal/70">
              Ruthless Scout is for experienced people—educators, service members, caregivers, creatives, operators, community leaders, and builders—whose next chapter cannot be reduced to “just find another job.”
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section id="how-it-works" className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">The method</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">Dream with range. Decide with evidence.</h2>
              <p className="mt-5 text-lg leading-8 text-charcoal/70">
                Generic job boards ask what title you want. Ruthless Scout starts with what your life requires, what your experience proves, and what your next move must make possible.
              </p>
            </AnimatedSection>
            <div className="grid gap-4 sm:grid-cols-2">
              {ruthlessScout.principles.map((principle, index) => {
                const Icon = gateIcons[index];
                return (
                  <AnimatedSection key={principle.number} delay={index * 0.06} className="rounded-2xl border border-ink/8 bg-white p-7 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl font-semibold text-ink/15">{principle.number}</span>
                      <div className="flex size-11 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-dark"><Icon className="size-5" /></div>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-charcoal/70">{principle.body}</p>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <AnimatedSection className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl bg-mist">
            <Image
              src="/images/founder/founder-dani-marked-minds-portrait.webp"
              alt="Dani Cummings, founder of Marked Minds and creator of Ruthless Scout."
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-ink/88 p-5 text-white backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Built from lived experience</p>
              <p className="mt-2 text-sm leading-6 text-white/75">Educator. Army logistics leader. Creative founder. Still becoming.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">Why this exists</p>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">The first person Ruthless Scout had to help was its creator.</h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-charcoal/70">
              <p>Dani Cummings built a career across education, military logistics, youth development, creative direction, and entrepreneurship. The problem was never a lack of ability. It was finding opportunities capable of holding the full range of that experience without sacrificing the life she was trying to protect.</p>
              <p>Ruthless Scout began as her private decision system: compensation floors, location limits, travel ceilings, career leverage, strongest concerns, and one uncompromising question—<strong className="font-semibold text-ink">is this opportunity worth my life?</strong></p>
              <p>Now Marked Minds is opening that method to a small founding group from the Dream Deferred community.</p>
            </div>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/dream-deferred">Explore Dream Deferred <ArrowRight className="size-4" /></Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-ink py-24 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Your founding sprint</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Clarity you can act on.</h2>
              <p className="mt-5 text-lg leading-8 text-white/68">Not another personality quiz. Not a list of jobs copied from a search page. A decision system built around you.</p>
            </AnimatedSection>
            <div className="grid gap-4 sm:grid-cols-2">
              {ruthlessScout.deliverables.map((item, index) => (
                <AnimatedSection key={item} delay={index * 0.04} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-5">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-brand-orange" />
                  <p className="text-sm leading-6 text-white/75">{item}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="founding-pilot" className="bg-mist py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <AnimatedSection className="h-fit rounded-3xl bg-ink p-8 text-white shadow-xl sm:p-10">
            <Badge variant="orange">Founding pilot · 10 people</Badge>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">Ruthless Scout Transition Sprint</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-6xl font-semibold tracking-tight">${ruthlessScout.foundingPrice}</span>
              <span className="pb-2 text-sm text-white/55">one time</span>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/70">{ruthlessScout.turnaround}. Payment is requested only after founding-pilot acceptance.</p>
            <div className="mt-8 space-y-4 border-t border-white/10 pt-8 text-sm text-white/70">
              <p className="flex items-center gap-3"><Compass className="size-4 text-brand-orange" />Personal transition strategy</p>
              <p className="flex items-center gap-3"><Radar className="size-4 text-brand-orange" />Five verified opportunities</p>
              <p className="flex items-center gap-3"><Sparkles className="size-4 text-brand-orange" />Human review and debrief</p>
            </div>
          </AnimatedSection>
          <AnimatedSection className="rounded-3xl border border-ink/8 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">Request a founding place</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Tell us where you are—and what has to change.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-charcoal/70">This first form is intentionally focused. If you are selected, the full private intake comes after payment.</p>
            <div className="mt-8"><FoundingPilotForm /></div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-dark">Questions before you move</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">Straight answers.</h2>
          </div>
          <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {ruthlessScout.faqs.map((item) => (
              <details key={item.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-ink">
                  {item.question}<span className="text-2xl font-light text-brand-orange-dark transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl pr-10 leading-7 text-charcoal/70">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-charcoal/55">
            Ruthless Scout provides research, education, and decision support. It is not an employment agency, legal or financial adviser, or guarantee of interviews, offers, or income.
          </p>
        </div>
      </section>
    </>
  );
}
