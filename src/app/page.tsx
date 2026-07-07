import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { WhatWeDoSection } from "@/components/home/what-we-do-section";
import { CreativeProductionSection } from "@/components/home/creative-production-section";
import { EducationWorkshopsSection } from "@/components/home/education-workshops-section";
import { FocusFlexTeaser } from "@/components/home/focus-flex-teaser";
import { DreamDeferredTeaser } from "@/components/home/dream-deferred-teaser";
import { TimelineSection } from "@/components/home/timeline-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { ImpactTeaser } from "@/components/home/impact-teaser";
import { PartnerLogosSection } from "@/components/home/partner-logos-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDoSection />
      <CreativeProductionSection />
      <EducationWorkshopsSection />
      <FocusFlexTeaser />
      <DreamDeferredTeaser />
      <TimelineSection />
      <ServicesPreviewSection />
      <ImpactTeaser />
      <PartnerLogosSection />
      <CtaSection />
    </>
  );
}
