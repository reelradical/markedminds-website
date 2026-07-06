import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AcademyBadge } from "@/components/academy/academy-badge";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

const highlights = [
  "Small-group, project-based learning",
  "AI literacy, coding, reading, writing & math",
  "Social-emotional learning & movement",
  "Family partnership at every step",
];

export function FocusFlexTeaser() {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <AnimatedSection>
          <AcademyBadge />
          <h2 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Focus + FLEX Academy is where potential gets structure.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-7 text-white/70">
            Our flagship initiative pairs small-group mentorship with
            project-based learning across academics, AI literacy, and
            social-emotional growth — built for students who need more than
            one-size-fits-all instruction.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/focus-flex">
              Explore Focus + FLEX
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-white/80"
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
