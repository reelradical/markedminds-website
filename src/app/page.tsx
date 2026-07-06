import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { MissionSection } from "@/components/home/mission-section";
import { ProgramsSection } from "@/components/home/programs-section";
import { WhyMarkedMinds } from "@/components/home/why-marked-minds";
import { FocusFlexTeaser } from "@/components/home/focus-flex-teaser";
import { ImpactTeaser } from "@/components/home/impact-teaser";
import { TestimonialsSection } from "@/components/home/testimonials-section";
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
      <MissionSection />
      <ProgramsSection />
      <WhyMarkedMinds />
      <FocusFlexTeaser />
      <ImpactTeaser />
      <TestimonialsSection />
      <PartnerLogosSection />
      <CtaSection />
    </>
  );
}
