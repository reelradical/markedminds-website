import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceCategories } from "@/lib/data/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

const category = serviceCategories.find(
  (c) => c.slug === "creative-production",
)!;

export function CreativeProductionSection() {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Creative Production"
            title="Media that captures a moment and makes it last."
            description={category.description}
            invert
          />
          <Button asChild size="lg" className="mt-8">
            <Link href="/services">
              See All Services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {category.items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/4 p-5 text-sm leading-6 text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
