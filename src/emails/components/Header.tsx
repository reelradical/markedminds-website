import { Section, Img } from "@react-email/components";

import { emailBrand } from "@/emails/brand";
import { site } from "@/lib/data/site";

// Email images must be absolute URLs — most clients (Gmail, Outlook,
// Apple Mail) block or fail to load relative/localhost paths.
const LOGO_URL = `${site.url}/logos/marked-minds-logo-white-black-orange.png`;

export function Header() {
  return (
    <Section
      style={{
        padding: "32px 40px 24px",
        borderBottom: `1px solid ${emailBrand.silver}`,
      }}
    >
      <Img
        src={LOGO_URL}
        alt={site.legalName}
        width="180"
        style={{ height: "auto", display: "block" }}
      />
    </Section>
  );
}
