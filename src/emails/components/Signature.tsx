import { Section, Text, Link } from "@react-email/components";

import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// A real, human sign-off — not a system notice. Used in every
// customer-facing template, right after the main message and before the
// branded Footer. `closing` is the one line most likely to vary by
// message (e.g. "Looking forward to connecting," vs. "Talk soon,").
export function Signature({ closing = "Looking forward to connecting," }: { closing?: string }) {
  return (
    <Section style={{ padding: "0 40px 8px" }}>
      <Text style={{ fontSize: "15px", lineHeight: "24px", color: emailBrand.charcoal, margin: "0 0 20px" }}>
        {closing}
      </Text>
      <Text style={{ fontSize: "15px", lineHeight: "22px", color: emailBrand.ink, margin: 0, fontWeight: 600 }}>
        Dani Cummings
      </Text>
      <Text style={{ fontSize: "14px", lineHeight: "20px", color: emailBrand.charcoal, margin: "2px 0 0" }}>
        Founder &amp; Creative Director
        <br />
        Marked Minds LLC
      </Text>
      <Text style={{ fontSize: "13px", lineHeight: "20px", color: emailBrand.charcoal, margin: "16px 0 0" }}>
        Questions?{" "}
        <Link href={`mailto:${site.email}`} style={{ color: emailBrand.orangeDark }}>
          {site.email}
        </Link>
      </Text>
    </Section>
  );
}
