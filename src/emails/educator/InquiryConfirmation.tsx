import { Section, Text } from "@react-email/components";

import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { Signature } from "@/emails/components/Signature";
import { Footer } from "@/emails/components/Footer";
import { CTA } from "@/emails/components/CTA";
import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Sent to an educator confirming a campaign inquiry was received
// (Educator Strategy Consultation, AI-Supported Planning Session, Coding
// Integration Planning Session, or a custom/inquiry-only service). Every
// fact here (Payment Link vs. custom scoping, offer code/percent/
// expiration) must stay accurate — see docs/EDUCATIONAL_SERVICES_PRICING.md
// and the on-page success message in campaign-inquiry-form.tsx, which
// this should stay consistent with even as the wording here is warmer.
export function InquiryConfirmation({
  firstName,
  partnerName,
  offerCode,
  discountPercent,
  expirationDate,
}: {
  firstName: string;
  partnerName: string;
  offerCode: string;
  discountPercent: number;
  expirationDate: string | null;
}) {
  return (
    <BaseEmail previewText="Your Marked Minds educator inquiry has been received.">
      <Header />
      <Section style={{ padding: "28px 40px 8px" }}>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal, margin: "0 0 16px" }}>
          Hi {firstName},
        </Text>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal }}>
          Thank you for reaching out to Marked Minds — I&apos;m excited to learn more
          about what you&apos;re working on, and I really appreciate you taking the
          time to connect.
        </Text>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal }}>
          I&apos;ll personally review your request and follow up soon. If you selected
          a fixed-price session, you may receive a direct Square Payment Link; if it&apos;s
          a custom or team request, we&apos;ll take a bit more time to scope it together
          so it truly fits what you need.
        </Text>
        <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal }}>
          As a {partnerName} conference participant, your {offerCode} benefit is already
          on file — {discountPercent}% off fixed-price sessions, or a complimentary
          strategy consultation for anything custom
          {expirationDate ? `, valid through ${expirationDate}.` : "."}
        </Text>
      </Section>
      <CTA href={site.url}>Visit Marked Minds</CTA>
      <Signature />
      <Footer />
    </BaseEmail>
  );
}
