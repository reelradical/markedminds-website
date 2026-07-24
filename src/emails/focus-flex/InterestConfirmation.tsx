import { Section, Text } from "@react-email/components";

import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Signature } from "@/emails/components/Signature";
import { Footer } from "@/emails/components/Footer";
import { CTA } from "@/emails/components/CTA";
import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Confirms an interest-list signup only — Session II is postponed, so
// this must not promise a specific enrollment date. Wording mirrors the
// postponement messaging already public on /focus-flex (src/lib/data/
// academy.ts) — do not promise more than that page already commits to.
export function InterestConfirmation({ firstName }: { firstName?: string }) {
  return (
    <BaseEmail previewText="You're on the Focus + FLEX Academy interest list.">
      <Header />
      <Section style={{ padding: "28px 40px 8px" }}>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal, margin: "0 0 16px" }}>
          Hi {firstName || "there"},
        </Text>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal }}>
          Thank you for your interest in Focus + FLEX Academy — I&apos;m so glad you
          reached out.
        </Text>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal }}>
          Session II is on pause right now so we can keep delivering the same quality
          experience our scholars had in Session I. You&apos;re on the interest list,
          and you&apos;ll be among the first to know the moment enrollment reopens.
        </Text>
      </Section>
      <CTA href={`${site.url}/focus-flex`}>Learn more about Focus + FLEX</CTA>
      <Signature />
      <Footer />
    </BaseEmail>
  );
}
