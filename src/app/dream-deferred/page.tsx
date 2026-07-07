import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

import { listenLinks } from "@/lib/data/dream-deferred";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Dream Deferred",
  description:
    "Dream Deferred is a Marked Minds cultural storytelling platform connecting creative-minded people, sharing stories, promoting purpose, and building community.",
  alternates: { canonical: "/dream-deferred" },
};

export default function DreamDeferredPage() {
  return (
    <>
      <PageHero
        eyebrow="A Marked Minds Initiative · Cultural Storytelling Platform"
        title="Dream Deferred"
        description="A cultural storytelling platform born from the original Marked Minds vision: connecting creative-minded people, sharing stories, promoting purpose, and building community."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-mist text-ink">
              <Mic className="size-6" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
              Born from the original Marked Minds vision.
            </h2>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">
              Dream Deferred grew out of the same conviction that started
              Marked Minds: creative-minded people connecting, reflecting,
              promoting, educating, and building together. Every episode is a
              conversation about the dream someone carried, paused, reshaped,
              or is still chasing.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Listen"
            title="Listen to available episodes."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {listenLinks.map((link) =>
              link.url ? (
                <Button asChild key={link.platform} size="lg" variant="outline">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              ) : (
                <div
                  key={link.platform}
                  className="flex h-14 items-center justify-center rounded-full border border-dashed border-ink/15 px-6 text-sm font-medium text-charcoal/40"
                >
                  {link.platform} — link coming soon
                </div>
              ),
            )}
          </div>
          <p className="mt-6 text-center text-sm text-charcoal/50">
            New episodes and listening links are added here as they become
            available.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 text-center">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <p className="text-lg leading-7 text-charcoal/70">
            Have a story to share, or want Dream Deferred to visit your
            community?
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
