import Link from "next/link";

import { serviceCategories } from "@/lib/data/services";
import { iconMap } from "@/lib/icon-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const category = serviceCategories.find(
  (c) => c.slug === "education-workshops",
)!;
const Icon = iconMap[category.icon];

export function EducationWorkshopsSection() {
  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Education + Workshops"
            title="Learning experiences grounded in real practice."
            description={category.description}
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item, i) => (
            <AnimatedSection
              key={item}
              delay={i * 0.05}
              className="flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-ink">
                <Icon className="size-5" />
              </div>
              <p className="font-medium tracking-tight text-ink">{item}</p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection
          delay={0.2}
          className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-ink/8 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Badge variant="outline">Upcoming</Badge>
            <p className="mt-2 font-medium tracking-tight text-ink">
              Educator Workshops — classroom AI use, lesson design, and
              creative technology training for teachers.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/contact">Book a Workshop</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
