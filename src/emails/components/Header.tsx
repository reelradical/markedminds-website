import { Section, Img, Text } from "@react-email/components";

import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Email images must be absolute URLs — most clients (Gmail, Outlook,
// Apple Mail) block or fail to load relative/localhost paths.
const LOGO_URL = `${site.url}/logos/marked-minds-wordmark-only.png`;

// Centered wordmark + a small real-text tagline beneath (not baked into
// the logo image) — subtle, not a hero banner. Real text rather than
// image pixels so the brand voice still comes through even in clients
// that block images by default.
export function Header() {
  return (
    <Section
      style={{
        padding: "36px 40px 20px",
        textAlign: "center",
        borderBottom: `1px solid ${emailBrand.silver}`,
      }}
    >
      <Img
        src={LOGO_URL}
        alt={site.legalName}
        width="140"
        style={{ height: "auto", margin: "0 auto", display: "block" }}
      />
      <Text
        style={{
          margin: "10px 0 0",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: emailBrand.charcoal,
          opacity: 0.6,
        }}
      >
        {site.tagline.replace(/\.$/, "")}
      </Text>
    </Section>
  );
}
