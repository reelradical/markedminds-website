import { NextResponse } from "next/server";

import { saveIntake } from "@/lib/airtable";

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
// postponed (see src/lib/data/academy.ts). Routes straight into the
// Airtable Intake Queue as its own intake source — no Resend notification
// for these yet (intentional, per direct instruction). Never blocks the
// user-facing response on Airtable being unavailable; logs a sanitized
// error server-side instead. Does not touch Black2School's flow or
// /api/contact.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as InterestPayload | null;

  const name = clean(body?.name);
  const email = clean(body?.email);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { firstName, lastName } = parseName(name);

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
