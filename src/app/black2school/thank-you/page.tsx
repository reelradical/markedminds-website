import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  CalendarClock,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

import { site } from "@/lib/data/site";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { SentenceBreak } from "@/components/shared/sentence-break";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

// Post-purchase confirmation for the 3 Black2School fixed-price Square
// Payment Links. Public but unlisted — not in nav.ts, not in sitemap.ts —
// matching the black2school page's own pattern. See
// SQUARE_APPOINTMENTS_INTEGRATION.md for the redirect-URL setup this page
// is meant to receive traffic from.
export const metadata: Metadata = {
  title: { absolute: "Thank You | Marked Minds LLC" },
  description: "Your Marked Minds educator session purchase has been received.",
  robots: {
    index: false,
    follow: true,
  },
};

const steps = [
  {
    title: "Payment Received",
    description: "Your Square payment has been successfully processed.",
    icon: CheckCircle2,
    done: true,
  },
  {
    title: "We'll Reach Out",
    description:
      "Within one business day, we'll personally reach out using the email provided during checkout.",
    icon: Mail,
    done: false,
  },
  {
    title: "We'll Schedule Together",
    description: "Together we'll select the best date and time for your session.",
    icon: CalendarClock,
    done: false,
  },
  {
    title: "You're Confirmed",
    description:
      "You'll receive your confirmation along with any preparation materials before your session.",
    icon: FileCheck2,
    done: false,
  },
];

const prepItems = [
  "Think about your biggest challenge.",
  "Gather any curriculum, lesson plans, or materials you'd like to discuss.",
  "Write down your questions beforehand.",
  "Bring an open mind—we'll build practical solutions together.",
];

export default function Black2SchoolThankYouPage() {
  return (
    <>
      <PageHero
        eyebrow="Purchase Confirmed"
        title="Thank You!"
        description={
          <SentenceBreak text="Your purchase has been received. We're excited to partner with you." />
        }
      />

      {/* What Happens Next */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Next Steps"
            title="What happens next?"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 flex flex-col gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection
                  key={step.title}
                  delay={i * 0.08}
                  className="relative flex gap-6 border-l-2 border-ink/10 pl-8"
                >
                  <span
                    className={`absolute -left-4.5 top-0 flex size-8 items-center justify-center rounded-full border-2 border-white ${
                      step.done ? "bg-brand-orange" : "bg-ink"
                    }`}
                  >
                    <Icon className="size-4 text-white" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-charcoal/70">{step.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Need to Change Something */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Need to change something?
            </h2>
            <p className="mt-3 text-charcoal/70">
              If you entered incorrect information or need to update your
              availability, contact us:
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-brand-orange-dark hover:text-brand-orange"
            >
              <Mail className="size-5" aria-hidden="true" />
              {site.email}
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Getting the Most from Your Session */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Prepare"
            title="Getting the most from your session."
            align="center"
            className="mx-auto"
          />
          <ul className="mx-auto mt-10 flex max-w-xl flex-col gap-3">
            {prepItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-ink/8 bg-mist/60 px-5 py-4 text-charcoal/80"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-ink py-24 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-xl -translate-x-1/2 rounded-full bg-brand-orange/20 blur-[100px]"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            We&apos;ll see you soon.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="orange">
              <Link href="/">
                Return to Marked Minds
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-inverse">
              <Link href="/services">Back to Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
