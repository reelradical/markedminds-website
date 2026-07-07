import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, ArrowUpRight, Mic, ImageIcon } from "lucide-react";

import {
  listenLinks,
  publicStats,
  supporterUrl,
  conversationHighlight,
  socialPreview,
  xProfile,
  getInvolvedItems,
} from "@/lib/data/dream-deferred";
import { iconMap } from "@/lib/icon-map";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedSection } from "@/components/shared/animated-section";
import { InstagramIcon, XIcon } from "@/components/shared/social-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";

const honestTags = [
  "Available Now",
  "New Conversations",
  "Culture-Centered Storytelling",
  "Independent Storytelling",
];

const streamingPlatforms = ["Spotify", "Apple Podcasts", "YouTube", "Metacast"];

export const metadata: Metadata = {
  title: "Dream Deferred",
  description:
    "Dream Deferred is a Marked Minds cultural storytelling platform connecting creative-minded people, sharing stories, promoting purpose, and building community.",
  alternates: { canonical: "/dream-deferred" },
};

export default function DreamDeferredPage() {
  const spreaker = listenLinks.find((link) => link.embedHtml);
  const applePodcasts = listenLinks.find((link) => link.platform === "Apple Podcasts");

  return (
    <>
      {/* 1. Hero / intro */}
      <PageHero
        eyebrow="A Marked Minds Initiative · Cultural Storytelling Platform"
        title="Dream Deferred"
        description="A cultural storytelling platform born from the original Marked Minds vision: connecting creative-minded people, sharing stories, promoting purpose, and building community."
      />

      <section className="bg-white pt-16 pb-0">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 px-6 lg:px-8">
          {honestTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      {/* 2. Verified stats */}
      <section className="bg-white pt-10 pb-16 sm:pb-20">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-4 px-6 lg:px-8">
          {publicStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-ink/8 bg-mist/60 px-4 py-6 text-center"
            >
              <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Spreaker player */}
      {spreaker && (
        <section id="listen-now" className="bg-mist py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              Listen Now
            </p>
            <div
              className="mx-auto rounded-2xl border border-ink/8 bg-white p-4 shadow-sm"
              // Trusted, developer-authored widget markup, not user input.
              dangerouslySetInnerHTML={{ __html: spreaker.embedHtml! }}
            />
          </div>
        </section>
      )}
      {/* Renders the Spreaker embed above into its interactive player
          widget. */}
      <Script src="https://widget.spreaker.com/widgets.js" strategy="lazyOnload" />

      {/* 4. Origin section */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-mist text-ink">
              <Mic className="size-6" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
              Born from the dreams we deferred.
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

      {/* 5. The Conversation Continues */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Community"
            title="The Conversation Continues"
            description="Dream Deferred doesn't end when an episode ends. The conversations continue through our community—where listeners reflect, respond, challenge ideas, and encourage one another to keep pursuing the dreams they've deferred."
            align="center"
            className="mx-auto"
          />
          {conversationHighlight.embedUrl ? (
            <AnimatedSection className="mt-10 flex justify-center">
              <iframe
                title={`Community post from ${conversationHighlight.source}`}
                src={conversationHighlight.embedUrl}
                width={500}
                height={558}
                style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
                scrolling="no"
                frameBorder={0}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </AnimatedSection>
          ) : null}
          {conversationHighlight.postUrl && (
            <p className="mt-4 text-center">
              <a
                href={conversationHighlight.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-orange-dark underline underline-offset-4"
              >
                View original post on Facebook
              </a>
            </p>
          )}
          {!conversationHighlight.embedUrl && (
            <AnimatedSection className="mt-10 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
              {/* TODO: swap this placeholder for the real kg.codes.social
                  Facebook quote/post once conversationHighlight.embedUrl
                  is set (see src/lib/data/dream-deferred.ts). */}
              <div className="flex h-48 w-full items-center justify-center bg-charcoal/5 text-charcoal/30">
                <ImageIcon className="size-10" strokeWidth={1.25} />
              </div>
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-charcoal/50">
                  Community quote coming soon from {conversationHighlight.source}.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* 6. Instagram / social preview */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col items-center gap-4 rounded-2xl border border-ink/8 bg-mist/60 p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-sm">
              <InstagramIcon className="size-6" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-ink">
                {socialPreview.handle}
              </p>
              <p className="mt-2 max-w-md text-charcoal/70">
                {socialPreview.description}
              </p>
            </div>
            <Button asChild variant="outline">
              <a href={socialPreview.url} target="_blank" rel="noopener noreferrer">
                Follow on {socialPreview.platform}
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <a
              href={xProfile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-charcoal/60 transition-colors hover:text-ink"
            >
              <XIcon className="size-4" />
              Also on X: {xProfile.handle}
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* 7. Get Involved */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Get Involved"
            title="There's more than one way to be part of this."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getInvolvedItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              const content = (
                <>
                  <div className="flex size-11 items-center justify-center rounded-full bg-mist text-ink">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-4 font-medium tracking-tight text-ink">
                    {item.label}
                  </p>
                </>
              );
              return (
                <AnimatedSection key={item.label} delay={i * 0.05}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      {content}
                    </Link>
                  )}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Support Independent Storytelling */}
      <section id="support" className="bg-ink py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 text-center lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Support Independent Storytelling
          </p>
          <p className="text-lg leading-7 text-white/70">
            Dream Deferred is independently produced through Marked Minds
            LLC. Your support helps sustain thoughtful conversations,
            improve production quality, and create new opportunities for
            meaningful storytelling.
          </p>
          <Button asChild size="lg" variant="orange">
            {supporterUrl ? (
              <a href={supporterUrl} target="_blank" rel="noopener noreferrer">
                Become a Supporter — $4.99/month
              </a>
            ) : (
              <Link href="/contact">Become a Supporter — $4.99/month</Link>
            )}
          </Button>
        </div>
      </section>

      {/* 9. Listen Wherever You Stream Podcasts */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Listen"
            title="Listen wherever you stream podcasts."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listenLinks
              .filter((link) => streamingPlatforms.includes(link.platform))
              .map((link) => (
                <Button asChild key={link.platform} size="lg" variant="outline">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              ))}
          </div>
        </div>
      </section>

      {/* 10. Apple Podcasts embedded player, last */}
      {applePodcasts?.embedUrl && (
        <section className="bg-mist py-16 sm:py-20">
          <div className="mx-auto flex max-w-2xl justify-center px-6 lg:px-8">
            <iframe
              title="Apple Podcasts — Dream Deferred"
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              frameBorder={0}
              height={450}
              style={{
                width: "100%",
                maxWidth: "660px",
                overflow: "hidden",
                borderRadius: "10px",
              }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={applePodcasts.embedUrl}
            />
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
