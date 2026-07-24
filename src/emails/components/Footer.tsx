import { Section, Text, Link, Hr } from "@react-email/components";

import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Deliberately does not include a physical mailing address — none exists
// in site.ts today (only site.address.locality = "United States"). Add
// one here if/when a real address is confirmed; do not fabricate one for
// CAN-SPAM-style footer completeness.
export function Footer() {
  return (
    <Section style={{ padding: "24px 40px 32px" }}>
      <Hr style={{ borderColor: emailBrand.silver, margin: "0 0 20px" }} />
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: emailBrand.charcoal,
          margin: "0 0 4px",
        }}
      >
        {site.legalName}
      </Text>
      <Text
        style={{
          fontSize: "13px",
          lineHeight: "20px",
          color: emailBrand.charcoal,
          margin: 0,
        }}
      >
        Questions? Email{" "}
        <Link href={`mailto:${site.email}`} style={{ color: emailBrand.orangeDark }}>
          {site.email}
        </Link>
      </Text>
    </Section>
  );
}
