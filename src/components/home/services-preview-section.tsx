import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { serviceCategories } from "@/lib/data/services";
import { iconMap } from "@/lib/icon-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";

export function ServicesPreviewSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Four disciplines. One creative studio."
          description="Marked Minds works across production, design, education, and strategy — often on the same project."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category, i) => {
            const Icon = iconMap[category.icon];
            return (
              <AnimatedSection key={category.slug} delay={i * 0.06}>
                <Link
                  href="/services"
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-ink/8 bg-mist/60 p-7 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="orange">{category.pillar}</Badge>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1.5 font-display font-semibold tracking-tight text-ink">
                      {category.name}
                      <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-charcoal/70">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
