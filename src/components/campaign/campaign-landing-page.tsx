"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { formatOfferExpiration, type Campaign } from "@/lib/data/campaigns";
import {
  heroContent,
  empathyContent,
  helpCards,
  starterKit,
  supportOptions,
  formatStartingAt,
  realWorldExperience,
  aboutDani,
  faqItems,
  finalCta,
} from "@/lib/data/campaign-content";
import { iconMap } from "@/lib/icon-map";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { CopyCodeButton } from "@/components/campaign/copy-code-button";
import { CampaignInquiryForm } from "@/components/campaign/campaign-inquiry-form";
import { StarterKitForm } from "@/components/campaign/starter-kit-form";
import { trackEvent } from "@/lib/analytics";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CampaignLandingPage({ campaign }: { campaign: Campaign }) {
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    trackEvent(`${campaign.slug}_page_view`, {
      campaign: campaign.analytics.campaign,
    });
    // Fire once per page load — not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOfferClick() {
    trackEvent(`${campaign.slug}_offer_click`, {
      campaign: campaign.analytics.campaign,
    });
    scrollToId("conference-offer");
  }

  function handleChooseSupport(serviceValue: string) {
    setSelectedService(serviceValue);
    trackEvent(`${campaign.slug}_service_select`, {
      service: serviceValue,
      via: "card",
    });
    scrollToId("inquiry-form");
  }

  return (
    <>
      {/* 1. Exclusive Offer Banner */}
      <div className="bg-ink px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white sm:text-sm">
        Exclusive for {campaign.partnerName} {campaign.eventName} Participants
      </div>

      {/* 2. Hero */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-[-10%] h-80 w-80 rounded-full bg-academy-purple/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
            {heroContent.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heroContent.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-7 text-white/70">
            {heroContent.supporting}
          </p>
          <p className="mt-3 text-sm font-medium text-white/50">
            {heroContent.secondaryLine}
          </p>

          <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-5 py-2 text-sm font-medium text-brand-orange">
            <Sparkles className="size-4" aria-hidden="true" />
            {campaign.heroBadge}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={handleOfferClick}>
              Claim Your Conference Offer
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline-inverse"
              onClick={() => scrollToId("choose-your-support")}
            >
              Explore Educator Support
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Empathy */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {empathyContent.headline}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {empathyContent.acknowledgments.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-ink/10 bg-white px-4 py-1.5 text-sm text-charcoal/70"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-8 text-balance font-display text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl">
              {empathyContent.featureLine}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. How Dani Can Help */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="How Dani Can Help"
            title="Practical support, built around your classroom."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {helpCards.map((card, i) => {
              const Icon = iconMap[card.icon];
              return (
                <AnimatedSection
                  key={card.name}
                  delay={i * 0.06}
                  className="flex flex-col gap-4 rounded-2xl border border-ink/8 bg-mist/60 p-7"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-ink text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {card.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/40">
                      Best for: {card.idealAudience}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-sm leading-6 text-charcoal/70">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {card.note && (
                    <p className="mt-auto border-t border-ink/8 pt-4 text-sm font-medium italic text-charcoal/60">
                      {card.note}
                    </p>
                  )}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free AI Classroom Starter Kit — hidden until the resource files
          themselves are authored (see ASSET_CHECKLIST.md). The section,
          form, and analytics stay in place so re-enabling later is a
          one-line data change (campaign.features.starterKit = true). */}
      {campaign.features.starterKit && (
        <section id="starter-kit" className="bg-ink py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
                Free for Conference Participants
              </p>
              <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {starterKit.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-7 text-white/70">
                {starterKit.supporting}
              </p>
              <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {starterKit.includes.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mx-auto mt-10 max-w-lg">
                <StarterKitForm campaign={campaign} />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* 5. Conference Exclusive Offer */}
      <section id="conference-offer" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection className="overflow-hidden rounded-2xl bg-ink px-8 py-14 text-center text-white sm:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
              Conference Exclusive
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Your {campaign.partnerName} Conference Exclusive
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-7 text-white/70">
              Receive {campaign.offer.discountPercent}% off one qualifying
              Marked Minds educator session, consultation, or training.
            </p>

            <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-4 rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-6">
              <p className="text-4xl font-semibold tracking-[0.1em] text-brand-orange">
                {campaign.offer.code}
              </p>
              <CopyCodeButton
                code={campaign.offer.code}
                onCopy={() =>
                  trackEvent(`${campaign.slug}_copy_code`, {
                    campaign: campaign.analytics.campaign,
                  })
                }
              />
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 text-left sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                  Eligible services
                </h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-white/80">
                  {campaign.offer.eligibleServices.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                  Terms
                </h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-white/60">
                  {formatOfferExpiration(campaign.offer) && (
                    <li>Offer valid through {formatOfferExpiration(campaign.offer)}</li>
                  )}
                  {campaign.offer.otherTerms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-md text-sm text-academy-purple/80">
              This offer connects to Focus + FLEX Academy — Marked Minds&apos;
              small-group, educator-designed learning model.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 6. Choose Your Support */}
      <section id="choose-your-support" className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Get Started"
            title="Choose your support."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportOptions.map((option, i) => {
              const Icon = iconMap[option.icon];
              return (
                <AnimatedSection
                  key={option.name}
                  delay={i * 0.06}
                  className="flex flex-col gap-4 rounded-2xl border border-ink/8 bg-white p-7"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-dark">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {option.name}
                    </h3>
                    {option.duration && (
                      <p className="mt-1 text-sm text-charcoal/50">{option.duration}</p>
                    )}
                    {formatStartingAt(option) && (
                      <p className="mt-1 text-sm font-medium text-brand-orange-dark">
                        {formatStartingAt(option)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-auto"
                    onClick={() => handleChooseSupport(option.serviceValue)}
                  >
                    {option.ctaLabel}
                  </Button>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Real-World Experience */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Real Classrooms"
            title={realWorldExperience.heading}
            description={realWorldExperience.body}
          />
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-wrap gap-2">
              {realWorldExperience.verifiedExamples.map((example) => (
                <span
                  key={example}
                  className="rounded-full border border-ink/10 bg-mist px-4 py-1.5 text-sm text-charcoal/70"
                >
                  {example}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {realWorldExperience.images.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-3/4 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 21vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. About Dani */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <AnimatedSection className="relative aspect-4/5 overflow-hidden rounded-2xl">
            <Image
              src={aboutDani.portrait}
              alt={`${aboutDani.name}, founder of Marked Minds.`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
              About
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
              {aboutDani.name}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-charcoal/60">
              {aboutDani.titles.map((title, i) => (
                <li key={title} className="flex items-center gap-3">
                  {title}
                  {i < aboutDani.titles.length - 1 && (
                    <span className="text-ink/20" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-lg leading-7 text-charcoal/70">{aboutDani.bio}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* 9. Inquiry Form */}
      <section id="inquiry-form" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHeading
            eyebrow={`${campaign.partnerName} Conference Offer`}
            title="Tell us about your classroom."
            description="Submit your request. Dani will review your goals, confirm availability and scope, and send the appropriate booking and payment details."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <CampaignInquiryForm
              campaign={campaign}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 flex flex-col gap-6">
            {faqItems.map((item, i) => (
              <AnimatedSection
                key={item.question}
                delay={i * 0.04}
                className="rounded-2xl border border-ink/8 bg-white p-6"
              >
                <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">{item.answer}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="bg-ink py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {finalCta.headline}
          </h2>
          <p className="max-w-xl text-balance text-lg leading-7 text-white/80">
            {finalCta.supporting}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" variant="orange" onClick={handleOfferClick}>
              Claim My {campaign.offer.discountPercent}% Conference Offer
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline-inverse"
              onClick={() => handleChooseSupport("Custom workshop")}
            >
              {finalCta.secondaryButtonLabel}
            </Button>
          </div>
          <Link
            href="/contact"
            className="text-sm font-medium text-white/50 underline-offset-4 hover:text-white hover:underline"
          >
            Or reach out through our general contact page
          </Link>
        </div>
      </section>
    </>
  );
}
