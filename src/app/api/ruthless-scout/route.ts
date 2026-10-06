import { NextResponse } from "next/server";

import { buildFieldListEmail, sendEmail } from "@/lib/email";
import { saveIntake } from "@/lib/airtable";
import { isBotSubmission } from "@/lib/spam-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 2000;

type ScoutPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentRole?: string;
  compensationFloor?: string;
  location?: string;
  workMode?: string;
  travelLimit?: string;
  desiredShift?: string;
  whyNow?: string;
  acknowledgement?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ScoutPayload | null;

  if (isBotSubmission(body as Record<string, unknown> | null)) {
    return NextResponse.json({ ok: true });
  }

  const firstName = clean(body?.firstName);
  const lastName = clean(body?.lastName);
  const email = clean(body?.email);
  const currentRole = clean(body?.currentRole);
  const compensationFloor = clean(body?.compensationFloor);
  const location = clean(body?.location);
  const workMode = clean(body?.workMode);
  const travelLimit = clean(body?.travelLimit);
  const desiredShift = clean(body?.desiredShift);
  const whyNow = clean(body?.whyNow);
  const acknowledgement = clean(body?.acknowledgement);

  if (
    !firstName || !lastName || !email || !EMAIL_RE.test(email) || !currentRole ||
    !compensationFloor || !location || !workMode || !travelLimit || !desiredShift ||
    !whyNow || acknowledgement !== "accepted"
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const subject = `Ruthless Scout founding-pilot request: ${firstName} ${lastName}`;
  const { html, text } = buildFieldListEmail(subject, [
    ["Name", `${firstName} ${lastName}`],
    ["Email", email],
    ["Current role or field", currentRole],
    ["Minimum compensation", compensationFloor],
    ["Location limits", location],
    ["Preferred work mode", workMode],
    ["Maximum travel", travelLimit],
    ["Moving toward", desiredShift],
    ["Why now", whyNow],
  ]);

  const emailResult = await sendEmail({ subject, html, text, replyTo: email });
  if (!emailResult.ok) {
    console.error("[ruthless-scout] Email delivery failed:", emailResult.error);
    return NextResponse.json(
      { error: "We couldn't record your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  const intakeResult = await saveIntake({
    firstName,
    lastName,
    email,
    role: currentRole,
    service: "Ruthless Scout Founding Transition Sprint",
    preferredFormat: "Virtual",
    goal: [
      `Desired shift: ${desiredShift}`,
      `Why now: ${whyNow}`,
      `Compensation floor: ${compensationFloor}`,
      `Location: ${location}`,
      `Work mode: ${workMode}`,
      `Travel limit: ${travelLimit}`,
    ].join("\n"),
    campaign: "ruthless-scout-founding-pilot",
    referralSource: "markedminds.com/ruthless-scout",
    intakeSource: "Ruthless Scout Submission",
    businessUnit: "Marked Minds",
    inquiryType: "Career Transition",
    nextAction: "Review founding-pilot request and send decision/payment link",
  });

  if (!intakeResult.ok) {
    console.error("[ruthless-scout] Airtable intake creation failed:", intakeResult.error);
  } else if (intakeResult.duplicate) {
    console.info("[ruthless-scout] Skipped duplicate Airtable intake.");
  }

  return NextResponse.json({ ok: true });
}
