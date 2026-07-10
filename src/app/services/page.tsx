import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceCategories } from "@/lib/data/services";
import { iconMap } from "@/lib/icon-map";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Creative production, design and brand support, education and workshops, and consulting and strategy from Marked Minds LLC.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four disciplines. One creative studio."
        description="Marked Minds works across production, design, education, and strategy — for individuals, brands, schools, and community organizations."
      />

      {serviceCategories.map((category, i) => {
        const Icon = iconMap[category.icon];
        return (
          <section
            key={category.slug}
            id={category.slug}
            className={i % 2 === 0 ? "bg-white py-20 sm:py-24" : "bg-mist py-20 sm:py-24"}
          >
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <AnimatedSection className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full bg-ink text-white">
                    <Icon className="size-6" />
                  </div>
                  <Badge variant="orange">Pillar: {category.pillar}</Badge>
                </div>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                  {category.name}
                </h2>
                <p className="max-w-2xl text-lg leading-7 text-charcoal/70">
                  {category.description}
                </p>
              </AnimatedSection>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {category.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-ink/8 bg-white px-5 py-4 text-sm font-medium tracking-tight text-ink"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <p className="text-lg leading-7 text-charcoal/70">
            Not sure which service fits your project? Tell us what you&apos;re
            trying to build.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">
              Start a Conversation
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
