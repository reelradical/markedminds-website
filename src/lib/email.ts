// Minimal Resend REST API client — no SDK dependency, just fetch(). Shared
// by campaign endpoints (campaign-inquiry, campaign-lead) that need real
// email delivery. /api/contact is intentionally left on its existing
// log-only behavior; this does not touch it.
//
// Required environment variables (server-only, never NEXT_PUBLIC_):
//   RESEND_API_KEY            — Resend API key (https://resend.com/api-keys)
//   CAMPAIGN_INQUIRY_TO_EMAIL — recipient inbox for campaign submissions
//   CAMPAIGN_FROM_EMAIL       — verified sender address in Resend
//     (Resend requires the sending domain to be verified before you can
//     send from an address on it — see https://resend.com/domains)
//
// If any are unset, sendEmail() returns a clear failure — it never throws
// and never fabricates success.

import { render } from "@react-email/render";
import type { ReactElement } from "react";

const RESEND_API_URL = "https://api.resend.com/emails";

// Bridges the src/emails/ React Email templates into sendEmail()'s plain
// {html, text} contract, so there's one send pathway regardless of whether
// the caller built its HTML by hand (buildFieldListEmail) or as a
// component tree.
export async function renderEmail(element: ReactElement): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  return { html, text };
}

export type EmailResult = { ok: true } | { ok: false; error: string };

export async function sendEmail({
  subject,
  html,
  text,
  replyTo,
}: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CAMPAIGN_INQUIRY_TO_EMAIL;
  const from = process.env.CAMPAIGN_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return {
      ok: false,
      error:
        "Email delivery is not configured — missing RESEND_API_KEY, CAMPAIGN_INQUIRY_TO_EMAIL, or CAMPAIGN_FROM_EMAIL.",
    };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Email provider returned ${res.status}: ${body.slice(0, 300)}`,
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email delivery error",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildFieldListEmail(
  title: string,
  fields: Array<[label: string, value: string | null]>,
): { html: string; text: string } {
  const rows = fields.filter(([, value]) => value !== null) as Array<[string, string]>;

  const html = `
    <h2>${escapeHtml(title)}</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="font-weight:600;vertical-align:top;padding-right:12px;">${escapeHtml(label)}</td>
          <td>${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`,
        )
        .join("")}
    </table>
  `.trim();

  const text = [title, "", ...rows.map(([label, value]) => `${label}: ${value}`)].join("\n");

  return { html, text };
}
