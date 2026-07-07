import Link from "next/link";

import { site } from "@/lib/data/site";
import { iconMap } from "@/lib/icon-map";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";

const pillars = [
  {
    name: "Create",
    description:
      "Photography, video, podcasts, graphics, apparel, branding, and creative production.",
    href: "/services",
    icon: "camera",
  },
  {
    name: "Teach",
    description:
      "Focus + FLEX Academy, educator workshops, AI classroom support, curriculum design, and youth programming.",
    href: "/focus-flex",
    icon: "graduation-cap",
  },
  {
    name: "Build",
    description:
      "Programs, partnerships, workshops, community initiatives, and strategic consulting.",
    href: "/services",
    icon: "briefcase",
  },
  {
    name: "Connect",
    description:
      "Dream Deferred, storytelling, events, collaboration, networking, and community-centered projects.",
    href: "/dream-deferred",
    icon: "handshake",
  },
] as const;

export function WhatWeDoSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
            What Marked Minds Does
          </p>
          <p className="mt-6 text-balance font-display text-2xl font-medium leading-relaxed tracking-tight text-ink sm:text-3xl">
            {site.pillarsLine}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg leading-7 text-charcoal/70">
            Marked Minds curates culture through media, education, design,
            storytelling, workshops, creative production, community
            connection, and program development.
          </p>
        </AnimatedSection>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Four Pillars"
          title="One practice, four ways it shows up."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon];
            return (
              <AnimatedSection key={pillar.name} delay={i * 0.08}>
                <Link
                  href={pillar.href}
                  className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-ink/8 bg-mist/60 p-7 text-center transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {pillar.name}
                  </h3>
                  <p className="text-sm leading-6 text-charcoal/70">
                    {pillar.description}
                  </p>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
