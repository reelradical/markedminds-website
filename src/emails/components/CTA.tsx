import { Button, Section } from "@react-email/components";

import { emailBrand } from "@/emails/brand";

export function CTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Section style={{ textAlign: "center", padding: "8px 40px 32px" }}>
      <Button
        href={href}
        style={{
          backgroundColor: emailBrand.orange,
          color: emailBrand.white,
          fontSize: "15px",
          fontWeight: 600,
          padding: "14px 28px",
          borderRadius: "9999px",
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
