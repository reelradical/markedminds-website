import { testimonials } from "@/lib/data/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { AnimatedSection } from "@/components/shared/animated-section";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Voices"
          title="Families and partners in their own words."
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial, i) => (
            <AnimatedSection key={testimonial.name} delay={i * 0.08}>
              <TestimonialCard testimonial={testimonial} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
