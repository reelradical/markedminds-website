import { NextResponse } from "next/server";

import { sendEmail, buildFieldListEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 200;

type CampaignLeadPayload = {
  firstName?: string;
  email?: string;
  campaign?: string;
  source?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

// Lightweight lead-capture endpoint for campaign lead magnets (e.g. a
// future Starter Kit release — currently hidden on /black2school until
// the resource files exist, see ASSET_CHECKLIST.md). Email-only for now —
// intentionally NOT wired to the Airtable Intake Queue yet (out of scope
// for the current Black2School-only integration pass); never returns a
// false success on email failure.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CampaignLeadPayload | null;

  const firstName = clean(body?.firstName);
  const email = clean(body?.email);
  const campaign = clean(body?.campaign);
  const source = clean(body?.source);

  if (!firstName || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const { html, text } = buildFieldListEmail(`New ${campaign || "campaign"} lead: ${firstName}`, [
    ["First name", firstName],
    ["Email", email],
    ["Campaign", campaign || "Not specified"],
    ["Referral source", source || "Not specified"],
  ]);

  const emailResult = await sendEmail({
    subject: `New ${campaign || "campaign"} lead: ${firstName}`,
    html,
    text,
    replyTo: email,
  });

  if (!emailResult.ok) {
    console.error("[campaign-lead] Email delivery failed:", emailResult.error);
    return NextResponse.json(
      { error: "We couldn't record your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
