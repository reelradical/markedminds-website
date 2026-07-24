import { Html, Head, Preview, Body, Container } from "@react-email/components";

import { emailBrand } from "@/emails/brand";

// Shared outer shell for every Marked Minds email template. Does not
// include Header/Footer itself — compose those explicitly inside
// children so individual templates can opt out (e.g. a plain-text-style
// transactional note) without fighting the layout.
export function BaseEmail({
  previewText,
  children,
}: {
  /** Shown as the inbox preview snippet — keep under ~150 characters. */
  previewText?: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body
        style={{
          backgroundColor: emailBrand.mist,
          fontFamily: emailBrand.fontFamily,
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: emailBrand.white,
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${emailBrand.silver}`,
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}
