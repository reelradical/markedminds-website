import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Quote } from "lucide-react";

import { metrics } from "@/lib/data/metrics";
import { pickGalleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { MetricsPanel } from "@/components/shared/metrics-panel";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Community Impact",
  description:
    "See the measurable impact of Marked Minds' community programming — students served, families supported, scholarships awarded, and more.",
  alternates: { canonical: "/impact" },
};

// A third distinct subset — emphasizes impact on students/families
// (community joy, individual academic growth, everyday classroom moments)
// rather than repeating /focus-flex's or /our-work's selections.
const impactPhotos = pickGalleryItems(["g5", "g3", "g1"]);

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Community Impact"
        title="Impact we're building, one relationship at a time."
        description="These figures represent real students, families, and partners who have invested their time and trust in Marked Minds. Numbers below will be added as program data is confirmed."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MetricsPanel metrics={metrics} />
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <SectionHeading
            eyebrow="In Their Words"
            title="Stories from families and partners are on their way."
            align="center"
            className="mx-auto"
          />
          <AnimatedSection className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white p-10">
            <Quote className="mx-auto size-8 text-brand-orange/30" aria-hidden="true" />
            <p className="mt-4 text-charcoal/70">
              We&apos;re collecting real stories from the families,
              partners, and educators we work with. This section will
              grow as those conversations come in.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Photo Highlights"
              title="Moments from our sessions."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/gallery">
                View Full Gallery
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10">
            <GalleryGrid items={impactPhotos} />
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
