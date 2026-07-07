import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/data/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-15%] size-lg rounded-full bg-brand-orange/25 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-104 rounded-full bg-white/6 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[64px_64px]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-28 pt-40 text-center sm:pt-48 sm:pb-36 lg:px-8">
        <span
          className="opacity-0 [animation-delay:0ms] animate-fade-up rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
        >
          {site.legalName} &middot; Creative Innovation Studio
        </span>

        <h1 className="opacity-0 [animation-delay:120ms] animate-fade-up mt-8 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {site.tagline}
        </h1>

        <p className="opacity-0 [animation-delay:260ms] animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-white/70 sm:text-xl">
          {site.description}
        </p>

        <p className="opacity-0 [animation-delay:320ms] animate-fade-up mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
          {site.pillarsLine}
        </p>

        <div className="opacity-0 [animation-delay:400ms] animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/our-work">
              Explore Our Work
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/services">View Services</Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/donate">Support Focus + FLEX</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
