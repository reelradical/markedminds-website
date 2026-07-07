import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  UtensilsCrossed,
  Palette,
  Laptop,
  Users,
  ArrowRight,
  Building2,
  HeartHandshake,
  HandHeart,
} from "lucide-react";

import { site } from "@/lib/data/site";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support scholarships, meals, enrichment, and technology for Marked Minds students through individual giving, corporate sponsorship, or volunteering.",
  alternates: { canonical: "/donate" },
};

const purposes = [
  {
    title: "Scholarships",
    description: "Cover tuition for students whose families need support.",
    Icon: GraduationCap,
  },
  {
    title: "Meals",
    description: "Provide nourishing meals during every session.",
    Icon: UtensilsCrossed,
  },
  {
    title: "Enrichment",
    description: "Fund guest educators, field experiences, and materials.",
    Icon: Palette,
  },
  {
    title: "Technology",
    description: "Equip students with the devices and tools they need to learn.",
    Icon: Laptop,
  },
  {
    title: "Community Programming",
    description: "Expand family events and neighborhood-level initiatives.",
    Icon: Users,
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support Focus + FLEX Academy"
        title="Your gift becomes a student's next chapter."
        description="Every dollar directly supports scholarships, meals, enrichment, technology, and community programming for students and families."
      >
        <div className="mt-10">
          <Button asChild size="lg" variant="academy">
            <a href={site.donationUrl} target="_blank" rel="noopener noreferrer">
              Donate Now
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Purpose */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Where It Goes"
            title="Your donation supports educational access, directly."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {purposes.map(({ title, description, Icon }, i) => (
              <AnimatedSection
                key={title}
                delay={i * 0.06}
                className="rounded-2xl border border-ink/8 bg-mist/60 p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-charcoal/70">
                  {description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Giving */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedSection>
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-dark">
                <HeartHandshake className="size-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
                Individual Giving
              </h2>
              <p className="mt-4 text-lg leading-7 text-charcoal/70">
                One-time and recurring gifts of any size help fund
                scholarships and enrichment for students today. Every giver
                becomes part of a student&apos;s story.
              </p>
              <Button asChild size="lg" className="mt-6">
                <a href={site.donationUrl} target="_blank" rel="noopener noreferrer">
                  Give Now
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </AnimatedSection>
            <AnimatedSection
              delay={0.1}
              className="rounded-2xl border border-ink/8 bg-white p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange-dark">
                Secure Giving
              </p>
              <p className="mt-3 text-charcoal/70">
                Donations are processed securely through Square. You&apos;ll
                be redirected to complete your gift, and a receipt will be
                sent to your email automatically.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Corporate Sponsorship */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedSection
              className="order-2 rounded-2xl bg-ink p-8 text-white lg:order-1"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
                For Businesses & Foundations
              </p>
              <p className="mt-3 text-white/70">
                Sponsorships can be tailored to align with your organization&apos;s
                giving priorities — from named scholarships to program-wide
                support. We provide impact reporting for every partnership.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="order-1 lg:order-2">
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-dark">
                <Building2 className="size-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
                Corporate Sponsorship
              </h2>
              <p className="mt-4 text-lg leading-7 text-charcoal/70">
                Sponsor a cohort, an initiative, or an entire session. Corporate
                partners help us reach more students while building a
                meaningful connection to the community.
              </p>
              <Button asChild size="lg" variant="outline" className="mt-6">
                <Link href="/contact">
                  Start a Conversation
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Volunteer */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <AnimatedSection className="flex flex-col items-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-dark">
              <HandHeart className="size-7" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
              Volunteer Opportunities
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-7 text-charcoal/70">
              Guest educators, mentors, and event volunteers make Focus + FLEX
              Academy possible. If you have time, expertise, or energy to
              share, we&apos;d love to hear from you.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/contact">
                Volunteer With Us
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
