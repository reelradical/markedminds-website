import { NextResponse } from "next/server";
import { createElement } from "react";

import { sendEmail, renderEmail } from "@/lib/email";
import { saveIntake } from "@/lib/airtable";
import { campaigns, formatOfferExpiration } from "@/lib/data/campaigns";
import { NewInquiryNotification } from "@/emails/internal/NewInquiryNotification";
import { InquiryConfirmation } from "@/emails/educator/InquiryConfirmation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 2000;

type CampaignInquiryPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  role?: string;
  gradeLevel?: string;
  service?: string;
  format?: string;
  goal?: string;
  timing?: string;
  offerCode?: string;
  campaign?: string;
  source?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

// Website form values → Airtable "Preferred Format" select options. Lives
// here (not in airtable.ts) because it's specific to how this form words
// its options, not a generic Airtable concern.
const PREFERRED_FORMAT_MAP: Record<string, string> = {
  Virtual: "Virtual",
  "In-person": "In Person",
  "No preference": "Either",
};

// Black2School-specific Intake Queue values, approved 2026-07. Fixed here
// rather than in airtable.ts so the helper itself stays generic/reusable
// for future campaigns with different values.
const INTAKE_SOURCE = "Black2School Submission";
const BUSINESS_UNIT = "Marked Minds";
const INQUIRY_TYPE = "Educator Experience";
const NEXT_ACTION = "Review educator inquiry and respond";

// Generic campaign-inquiry endpoint, reused by every partner/conference
// landing page (Black2School and future campaigns) — separate from
// /api/contact so the general contact form's contract never changes.
//
// Submission flow (do not reorder):
//   1. Validate + sanitize.
//   2. Send the internal Resend notification (NewInquiryNotification). If
//      this fails, stop and return an error — never create an Intake
//      Queue record without a corresponding notification, and never claim
//      success when nothing was delivered.
//   3. Best-effort: send the customer-facing InquiryConfirmation. Failure
//      here does NOT block the response — staff already have the
//      notification from step 2, so this is a degraded experience, not a
//      lost inquiry.
//   4. Write the lead to the Airtable Intake Queue (saveIntake() itself
//      checks for a same-email/same-campaign record created in the last
//      few minutes and skips creating a duplicate). If Airtable fails,
//      still return success to the caller (the lead WAS captured via
//      email) but log a short, sanitized error server-side — never the
//      full payload, never credentials.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CampaignInquiryPayload | null;

  const firstName = clean(body?.firstName);
  const lastName = clean(body?.lastName);
  const email = clean(body?.email);
  const organization = clean(body?.organization);
  const role = clean(body?.role);
  const gradeLevel = clean(body?.gradeLevel);
  const service = clean(body?.service);
  const format = clean(body?.format);
  const goal = clean(body?.goal);
  const timing = clean(body?.timing);
  const offerCode = clean(body?.offerCode);
  const campaign = clean(body?.campaign);
  const source = clean(body?.source);

  if (
    !firstName ||
    !lastName ||
    !email ||
    !EMAIL_RE.test(email) ||
    !organization ||
    !role ||
    !gradeLevel ||
    !service ||
    !format ||
    !goal
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const subject = `New ${campaign || "campaign"} inquiry: ${firstName} ${lastName}`;
  const { html, text } = await renderEmail(
    createElement(NewInquiryNotification, {
      title: subject,
      fields: [
        { label: "Participant name", value: `${firstName} ${lastName}` },
        { label: "Email", value: email },
        { label: "Organization", value: organization },
        { label: "Role", value: role },
        { label: "Grade/age group", value: gradeLevel },
        { label: "Service of interest", value: service },
        { label: "Preferred format", value: format },
        { label: "Goal / challenge", value: goal },
        { label: "Preferred timing", value: timing || "Not specified" },
        { label: "Offer code", value: offerCode || "None" },
        { label: "Campaign", value: campaign || "Not specified" },
        { label: "Referral source", value: source || "Not specified" },
      ],
    }),
  );

  const emailResult = await sendEmail({
    subject,
    html,
    text,
    replyTo: email,
  });

  if (!emailResult.ok) {
    console.error("[campaign-inquiry] Email delivery failed:", emailResult.error);
    return NextResponse.json(
      { error: "We couldn't deliver your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  // Best-effort customer-facing confirmation — never blocks the response.
  // Internal staff already have the notification above, so a failure here
  // is a degraded experience, not a lost inquiry.
  const matchedCampaign = Object.values(campaigns).find((c) => c.analytics.campaign === campaign);
  if (matchedCampaign) {
    const { html: confirmationHtml, text: confirmationText } = await renderEmail(
      createElement(InquiryConfirmation, {
        firstName,
        partnerName: matchedCampaign.partnerName,
        offerCode: matchedCampaign.offer.code,
        discountPercent: matchedCampaign.offer.discountPercent,
        expirationDate: formatOfferExpiration(matchedCampaign.offer),
      }),
    );
    const confirmationResult = await sendEmail({
      to: email,
      subject: "Your Marked Minds educator inquiry has been received",
      html: confirmationHtml,
      text: confirmationText,
    });
    if (!confirmationResult.ok) {
      console.error(
        "[campaign-inquiry] Confirmation email delivery failed:",
        confirmationResult.error,
      );
    }
  } else {
    console.error(`[campaign-inquiry] No matching campaign for analytics id "${campaign}" — confirmation email skipped.`);
  }

  const intakeResult = await saveIntake({
    firstName,
    lastName,
    email,
    organization,
    role,
    gradeLevel,
    service,
    preferredFormat: PREFERRED_FORMAT_MAP[format] ?? format,
    goal,
    preferredTiming: timing,
    discountCode: offerCode,
    campaign: campaign || "Not specified",
    referralSource: source || "Not specified",
    intakeSource: INTAKE_SOURCE,
    businessUnit: BUSINESS_UNIT,
    inquiryType: INQUIRY_TYPE,
    nextAction: NEXT_ACTION,
  });

  if (!intakeResult.ok) {
    // Intentional: the user already got a real, working notification
    // email — do not make Airtable being down look like a failed
    // submission. Log a short error only, never the payload/credentials.
    console.error("[campaign-inquiry] Airtable intake creation failed:", intakeResult.error);
  } else if (intakeResult.duplicate) {
    console.info("[campaign-inquiry] Skipped duplicate Airtable intake (recent retry detected).");
  }

  return NextResponse.json({ ok: true });
}
