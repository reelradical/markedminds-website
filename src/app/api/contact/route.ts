import { NextResponse } from "next/server";

import { site } from "@/lib/data/site";
import { isBotSubmission } from "@/lib/spam-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: string;
  email?: string;
  organization?: string;
  inquiryType?: string;
  message?: string;
};

// Wire this up to a transactional email provider (e.g. Resend, Postmark) to
// deliver inquiries to `site.email`. The client contract (POST JSON, 2xx on
// success) is stable so ContactForm never needs to change.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (isBotSubmission(body as Record<string, unknown> | null)) {
    return NextResponse.json({ ok: true });
  }

  if (
    !body?.name?.trim() ||
    !body?.email?.trim() ||
    !EMAIL_RE.test(body.email) ||
    !body?.message?.trim() ||
    !body?.inquiryType?.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  console.info(`[contact] New inquiry for ${site.email}:`, {
    name: body.name,
    email: body.email,
    organization: body.organization ?? null,
    inquiryType: body.inquiryType,
  });

  return NextResponse.json({ ok: true });
}
