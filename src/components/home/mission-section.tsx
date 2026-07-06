import { AnimatedSection } from "@/components/shared/animated-section";

export function MissionSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
            Our Mission
          </p>
          <p className="mt-6 text-balance text-2xl font-medium leading-relaxed tracking-tight text-ink sm:text-3xl">
            We believe every learner deserves an education that meets them
            where they are and shows them how far they can go. Marked Minds
            builds programs, partnerships, and creative experiences that turn
            curiosity into capability — and potential into purpose.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
