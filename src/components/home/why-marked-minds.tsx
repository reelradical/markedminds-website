import { ShieldCheck, Sparkles, Users2, Rocket } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";

const pillars = [
  {
    title: "Human-Centered",
    description:
      "Every program starts with the learner, not the curriculum. We design around real students and real families.",
    Icon: Users2,
  },
  {
    title: "Rigorously Designed",
    description:
      "Our approach draws on research in project-based learning, cognitive science, and social-emotional development.",
    Icon: ShieldCheck,
  },
  {
    title: "Creatively Delivered",
    description:
      "We treat education as a creative discipline — sessions feel more like a studio than a worksheet.",
    Icon: Sparkles,
  },
  {
    title: "Built to Scale",
    description:
      "From one academy to a portfolio of initiatives, Marked Minds is architected to grow without losing quality.",
    Icon: Rocket,
  },
];

export function WhyMarkedMinds() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Marked Minds"
          title="Credibility isn't a claim. It's a design choice."
          description="From the way we structure a session to the way we report our impact, every detail is built to earn trust."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ title, description, Icon }, i) => (
            <AnimatedSection key={title} delay={i * 0.08} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-mist text-ink">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/70">
                {description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
