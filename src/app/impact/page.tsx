import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { metrics } from "@/lib/data/metrics";
import { testimonials } from "@/lib/data/testimonials";
import { galleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { MetricCard } from "@/components/shared/metric-card";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Community Impact",
  description:
    "See the measurable impact of Marked Minds' community programming — students served, families supported, scholarships awarded, and more.",
  alternates: { canonical: "/impact" },
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Community Impact"
        title="Impact you can point to."
        description="These numbers represent real students, real families, and real partners who chose to invest their time and trust in Marked Minds."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {metrics.map((metric, i) => (
              <AnimatedSection key={metric.label} delay={i * 0.05}>
                <MetricCard metric={metric} />
              </AnimatedSection>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-charcoal/50">
            Figures reflect cumulative program activity and are updated
            regularly.
          </p>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="In Their Words"
            title="What families and partners are saying."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} delay={i * 0.08}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
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
            <GalleryGrid items={galleryItems.slice(0, 6)} />
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
