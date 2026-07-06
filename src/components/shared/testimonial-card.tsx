import { Quote } from "lucide-react";

import type { Testimonial } from "@/lib/data/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-ink/8 bg-white p-8 shadow-sm">
      <Quote className="size-8 text-brand-orange/40" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-balance text-lg leading-7 text-ink">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-ink/8 pt-4">
        <p className="font-semibold text-ink">{testimonial.name}</p>
        <p className="text-sm text-charcoal/60">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}
