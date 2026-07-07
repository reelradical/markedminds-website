import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export function DreamDeferredTeaser() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection className="flex flex-col items-center gap-6 rounded-2xl bg-ink px-8 py-14 text-center text-white sm:px-14">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
            <Mic className="size-7" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            A Marked Minds Initiative &middot; Cultural Storytelling Platform
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Dream Deferred
          </h2>
          <p className="max-w-xl text-balance text-lg leading-7 text-white/70">
            Born from the original Marked Minds vision: connecting
            creative-minded people, sharing stories, promoting purpose, and
            building community.
          </p>
          <Button asChild size="lg">
            <Link href="/dream-deferred">
              Listen to Available Episodes
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
