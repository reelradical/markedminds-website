import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { currentInitiatives, futureInitiatives } from "@/lib/data/initiatives";
import { galleryItems } from "@/lib/data/gallery";
import { partners } from "@/lib/data/partners";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { InitiativeCard } from "@/components/shared/initiative-card";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore Marked Minds' portfolio of initiatives, creative production, and community collaborations.",
  alternates: { canonical: "/our-work" },
};

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="A portfolio built across media, education, and community."
        description="Every Marked Minds initiative — live, in development, or on the horizon — is part of the same creative practice."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Initiatives" title="What we're building right now." />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentInitiatives.map((initiative, i) => (
              <AnimatedSection key={initiative.name} delay={i * 0.06}>
                <InitiativeCard initiative={initiative} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="On the Horizon"
            title="In early development."
            description="These initiatives are being shaped alongside the families and partners we already work with."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {futureInitiatives.map((initiative, i) => (
              <AnimatedSection key={initiative.name} delay={i * 0.06}>
                <InitiativeCard initiative={initiative} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Photo & Video Highlights" title="Moments from our work." />
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/gallery">
                View Full Gallery
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10">
            <GalleryGrid items={galleryItems.slice(0, 6)} />
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Organizations & Collaborations"
              title="Trusted By, Built With, and Connected Through"
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/partners">
                View All
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner, i) => (
              <AnimatedSection key={partner.name} delay={i * 0.04}>
                <PartnerLogo partner={partner} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
