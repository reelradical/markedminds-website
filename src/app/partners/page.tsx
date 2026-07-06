import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { partners, partnerCategories, partnerCategoryPlurals } from "@/lib/data/partners";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Meet the schools, businesses, community organizations, and sponsors partnering with Marked Minds to expand educational access.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Community Partners"
        title="Built alongside our community, not apart from it."
        description="Marked Minds partners with schools, businesses, and organizations who share a commitment to student potential."
      />

      {partnerCategories.map((category) => {
        const items = partners.filter((p) => p.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category} className="border-b border-ink/8 bg-white py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionHeading
                eyebrow={partnerCategoryPlurals[category]}
                title={`Our ${category} Partners`}
              />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((partner, i) => (
                  <AnimatedSection key={partner.name} delay={i * 0.04}>
                    <PartnerLogo partner={partner} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Future Partner Logos */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <AnimatedSection className="flex flex-col items-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-sm">
              <Plus className="size-6" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
              This space is reserved for you.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-7 text-charcoal/70">
              We&apos;re building new partnerships with schools, businesses,
              and organizations that want to invest in students directly.
              Future partner logos will appear here as those relationships
              grow.
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
