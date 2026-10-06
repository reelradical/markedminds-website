import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { partners } from "@/lib/data/partners";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The organizations, collaborators, and community connections Marked Minds is trusted by, built with, and connected through.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Organizations & Collaborations"
        title="Trusted By, Built With, and Connected Through"
        description="Marked Minds works alongside real partners, collaborators, and community connections — not a client-list wall."
      />

      <section className="border-b border-ink/8 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner, i) => (
              <AnimatedSection key={partner.name} delay={i * 0.04}>
                <PartnerLogo partner={partner} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Future Partner Logos */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <AnimatedSection className="flex flex-col items-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-sm">
              <Plus className="size-6" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
              This space is reserved for you.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-7 text-charcoal/70">
              We&apos;re building new collaborations with schools,
              businesses, and organizations that want to invest in creative
              and educational work directly. New connections will appear
              here as those relationships grow.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/contact">
                Become a Partner
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
