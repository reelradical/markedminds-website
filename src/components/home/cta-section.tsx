import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-orange/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Help us turn potential into purpose for more students.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-7 text-white/70">
          Whether you give, partner, or volunteer, every contribution moves a
          student closer to who they&apos;re meant to become.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/donate">
              Support Our Mission
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/partners">Become a Partner</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
