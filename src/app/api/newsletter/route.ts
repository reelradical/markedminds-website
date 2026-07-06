import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Wire this up to a real email marketing provider (e.g. Mailchimp,
// ConvertKit, or a Resend audience) by adding the provider's API call here.
// The request/response contract for the client is intentionally stable so
// that swap can happen without touching NewsletterForm.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
