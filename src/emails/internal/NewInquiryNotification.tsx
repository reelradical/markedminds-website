import { Fragment } from "react";
import { Section, Heading, Text, Hr } from "@react-email/components";

import { BaseEmail } from "@/emails/layouts/BaseEmail";
import { Header } from "@/emails/components/Header";
import { emailBrand } from "@/emails/brand";

// Internal-only notification sent to Dani (never to the submitter) when
// any form creates an Airtable Intake Queue record. Shared across forms —
// content is a flat label/value list so it works for Black2School
// inquiries, Focus + FLEX interest signups, and future forms without a
// template per source. Replaces the plain-string buildFieldListEmail()
// HTML with a real branded template; the field-list shape is unchanged so
// existing callers only need to change how they build the email, not the
// data they already have on hand.
export function NewInquiryNotification({
  title,
  fields,
}: {
  title: string;
  fields: Array<{ label: string; value: string }>;
}) {
  return (
    <BaseEmail>
      <Header />
      <Section style={{ padding: "8px 40px 32px" }}>
        <Heading as="h2" style={{ fontSize: "18px", color: emailBrand.ink, margin: "0 0 16px" }}>
          {title}
        </Heading>
        {fields.map((field, i) => (
          <Fragment key={field.label}>
            <Text
              style={{ fontSize: "14px", lineHeight: "22px", color: emailBrand.charcoal, margin: 0 }}
            >
              <strong>{field.label}:</strong> {field.value}
            </Text>
            {i < fields.length - 1 && (
              <Hr style={{ borderColor: emailBrand.mist, margin: "8px 0" }} />
            )}
          </Fragment>
        ))}
      </Section>
    </BaseEmail>
  );
}
