import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-xl -translate-x-1/2 rounded-full bg-brand-orange/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Create, teach, build, or connect with us.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-7 text-white/70">
          Whether you need a creative partner, want to support Focus + FLEX,
          or are booking a workshop, every project moves the work forward.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/our-work">
              Explore Our Work
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/donate">Support Focus + FLEX</Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/contact">Book a Workshop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
