// Shared honeypot + timing guard for public form endpoints. Real users
// never see or fill HONEYPOT_FIELD (it's visually hidden off-screen, not
// just display:none, so even bots that read the rendered DOM find it).
// Bots that POST directly to the API without rendering the page at all
// get caught by the timing check instead, since they won't have a valid
// recent RENDERED_AT_FIELD timestamp. Detected bots should get the exact
// same {ok:true} response a real success would — never reveal that they
// were caught.
export const HONEYPOT_FIELD = "org_website";
export const RENDERED_AT_FIELD = "form_rendered_at";
const MIN_SUBMIT_MS = 1500;

export function isBotSubmission(body: Record<string, unknown> | null | undefined): boolean {
  if (!body) return true;

  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const renderedAt = Number(body[RENDERED_AT_FIELD]);
  if (!Number.isFinite(renderedAt)) return true;

  return Date.now() - renderedAt < MIN_SUBMIT_MS;
}
