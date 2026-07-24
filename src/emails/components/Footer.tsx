import { Section, Text, Link, Hr } from "@react-email/components";

import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Subtle brand-recall footer — the pillars line is the same one used
// sitewide (site.pillarsLine, e.g. the homepage hero), reused here rather
// than inventing new footer copy, so the email stays recognizably
// "Marked Minds" even without the logo. Contact info lives in Signature,
// not here, so it isn't repeated twice in one email.
export function Footer() {
  return (
    <Section style={{ padding: "8px 40px 32px", textAlign: "center" }}>
      <Hr style={{ borderColor: emailBrand.silver, margin: "0 0 20px" }} />
      <Text
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: emailBrand.charcoal,
          opacity: 0.55,
          margin: "0 0 6px",
        }}
      >
        {site.pillarsLine}
      </Text>
      <Text style={{ fontSize: "13px", color: emailBrand.charcoal, opacity: 0.7, margin: 0 }}>
        <Link href={site.url} style={{ color: emailBrand.charcoal, textDecoration: "none" }}>
          markedminds.com
        </Link>
      </Text>
    </Section>
  );
}
