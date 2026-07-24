import { NextResponse } from "next/server";
import { createElement } from "react";

import { sendEmail, renderEmail } from "@/lib/email";
import { saveIntake } from "@/lib/airtable";
import { NewInquiryNotification } from "@/emails/internal/NewInquiryNotification";
import { InterestConfirmation } from "@/emails/focus-flex/InterestConfirmation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 200;

type InterestPayload = {
  name?: string;
  email?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

// Splits a free-text name into first/last only when confident (exactly
// "First Last" or "First Middle Last" shape). A single word or empty
// input is left unparsed — the raw text still reaches Airtable via
// Description (see submittedName in saveIntake()), per the instruction to
// leave structured name fields blank rather than guess.
function parseName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return {};
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

// Focus + FLEX Session II interest-list capture, added while Session II is
// postponed (see src/lib/data/academy.ts). Does not touch Black2School's
// flow or /api/contact.
//
// Submission flow (mirrors campaign-inquiry's, do not reorder):
//   1. Validate + sanitize.
//   2. Send the internal Resend notification (NewInquiryNotification). If
//      this fails, stop and return an error — never create an Intake
//      Queue record without a corresponding notification.
//   3. Best-effort: send the customer-facing InterestConfirmation.
//      Failure here does NOT block the response.
//   4. Write to the Airtable Intake Queue. Never blocks the user-facing
//      response on Airtable being unavailable; logs a sanitized error
//      server-side instead.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as InterestPayload | null;

  const name = clean(body?.name);
  const email = clean(body?.email);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { firstName, lastName } = parseName(name);

  const { html, text } = await renderEmail(
    createElement(NewInquiryNotification, {
      title: `New Focus + FLEX interest signup: ${name || email}`,
      fields: [
        { label: "Name", value: name || "Not provided" },
        { label: "Email", value: email },
        { label: "Campaign", value: "focus-flex-interest" },
        { label: "Referral source", value: "Website" },
      ],
    }),
  );

  const emailResult = await sendEmail({
    subject: `New Focus + FLEX interest signup: ${name || email}`,
    html,
    text,
    replyTo: email,
  });

  if (!emailResult.ok) {
    console.error("[focus-flex-interest] Notification email delivery failed:", emailResult.error);
    return NextResponse.json(
      { error: "We couldn't process your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  // Best-effort customer-facing confirmation — never blocks the response.
  const confirmationResult = await sendEmail({
    to: email,
    subject: "You're on the Focus + FLEX Academy interest list",
    ...(await renderEmail(createElement(InterestConfirmation, { firstName }))),
  });
  if (!confirmationResult.ok) {
    console.error(
      "[focus-flex-interest] Confirmation email delivery failed:",
      confirmationResult.error,
    );
  }

  const intakeResult = await saveIntake({
    firstName,
    lastName,
    submittedName: name || undefined,
    email,
    service: "Focus + FLEX Interest List",
    campaign: "focus-flex-interest",
    referralSource: "Website",
    intakeSource: "Website Inquiry",
    businessUnit: "Focus + FLEX Academy",
    inquiryType: "Program",
    nextAction: "Review Focus + FLEX interest signup and follow up",
  });

  if (!intakeResult.ok) {
    console.error("[focus-flex-interest] Airtable intake creation failed:", intakeResult.error);
  } else if (intakeResult.duplicate) {
    console.info("[focus-flex-interest] Skipped duplicate Airtable intake (recent retry detected).");
  }

  return NextResponse.json({ ok: true });
}
