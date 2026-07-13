// Minimal Airtable REST client — no SDK dependency, just fetch(). Airtable's
// Intake Queue is the permanent, human-triaged inbox for every lead
// generated through the site; Resend (see email.ts) is the notification
// layer, not the database. See docs/AIRTABLE_CRM_SCHEMA.md for the full
// Intake Queue field reference.
//
// Required environment variables (server-only, never NEXT_PUBLIC_):
//   AIRTABLE_API_KEY      — personal access token (airtable.com/create/tokens)
//     Needs data.records:read + data.records:write on the Marked Minds OS base.
//   AIRTABLE_BASE_ID      — base id, starts with "app..."
//   AIRTABLE_INTAKE_TABLE — Intake Queue table name or id
//
// If any are unset, saveIntake() returns a clear failure — it never throws
// and never fabricates success. Callers must log this failure but must NOT
// block the user-facing response on it — Airtable being down should never
// make an already-emailed lead look like it failed to submit.

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

// How long to look back for a matching (email + campaign) record before
// treating a new submission as a duplicate. Short enough to only catch
// accidental route retries/double-submits, not a genuinely new inquiry
// from the same person later.
const DUPLICATE_WINDOW_MINUTES = 5;

export type IntakeInput = {
  /** Omit when a name can't be confidently parsed into first/last — pass `submittedName` instead so it still shows up in Description. */
  firstName?: string;
  lastName?: string;
  /** Raw submitted name, shown in Description only when firstName/lastName aren't set. */
  submittedName?: string;
  email: string;
  organization?: string;
  role?: string;
  gradeLevel?: string;
  service?: string;
  /** Already transformed to the Airtable Preferred Format choice (e.g. "In Person", not "In-person") by the caller. */
  preferredFormat?: string;
  goal?: string;
  preferredTiming?: string;
  discountCode?: string;
  /** Specific campaign id, e.g. "black2school-2026". */
  campaign: string;
  referralSource: string;
  /** Must match an Intake Source select option exactly, e.g. "Black2School Submission". */
  intakeSource: string;
  /** Must match a Business Unit select option exactly, e.g. "Marked Minds". */
  businessUnit: string;
  /** Must match an Inquiry Type select option exactly, e.g. "Educator Experience". */
  inquiryType: string;
  /** Fixed triage instruction for this submission type, e.g. "Review educator inquiry and respond". */
  nextAction: string;
};

export type AirtableResult =
  | { ok: true; recordId: string; duplicate?: boolean }
  | { ok: false; error: string };

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Next business day (skips Saturday/Sunday), as a date-only ISO string. */
function nextBusinessDay(from: Date): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + 1);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return toDateOnly(d);
}

function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function buildDescription(intake: IntakeInput): string {
  const parsedName = [intake.firstName, intake.lastName].filter(Boolean).join(" ");
  const name = parsedName || intake.submittedName || "Not provided";
  const lines = [
    `Participant: ${name}`,
    `Email: ${intake.email}`,
    intake.organization && `Organization: ${intake.organization}`,
    intake.role && `Role: ${intake.role}`,
    intake.gradeLevel && `Grade Level / Audience: ${intake.gradeLevel}`,
    intake.service && `Service Requested: ${intake.service}`,
    intake.preferredFormat && `Preferred Format: ${intake.preferredFormat}`,
    intake.goal && `Goals / Challenge: ${intake.goal}`,
    intake.preferredTiming && `Preferred Timing: ${intake.preferredTiming}`,
    intake.discountCode && `Discount Code: ${intake.discountCode}`,
    `Campaign: ${intake.campaign}`,
    `Referral Source: ${intake.referralSource}`,
  ].filter((line): line is string => Boolean(line));
  return lines.join("\n");
}

// Checks Airtable itself (not local/in-memory state, which isn't reliable
// across serverless invocations) for a record with the same email +
// campaign created within the dedup window. Fails OPEN on error — if the
// check itself can't be performed, we proceed to create the record rather
// than risk silently dropping a real submission over an unrelated Airtable
// hiccup.
async function findRecentDuplicate(
  apiKey: string,
  baseId: string,
  table: string,
  email: string,
  campaign: string,
): Promise<boolean> {
  const formula = `AND({Email}='${escapeFormulaValue(email)}', {Campaign}='${escapeFormulaValue(campaign)}', IS_AFTER(CREATED_TIME(), DATEADD(NOW(), -${DUPLICATE_WINDOW_MINUTES}, 'minutes')))`;
  const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(table)}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return false;
    const data = (await res.json()) as { records?: unknown[] };
    return Array.isArray(data.records) && data.records.length > 0;
  } catch {
    return false;
  }
}

export async function saveIntake(intake: IntakeInput): Promise<AirtableResult> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_INTAKE_TABLE;

  if (!apiKey || !baseId || !table) {
    return {
      ok: false,
      error:
        "Airtable is not configured — missing AIRTABLE_API_KEY, AIRTABLE_BASE_ID, or AIRTABLE_INTAKE_TABLE.",
    };
  }

  const isDuplicate = await findRecentDuplicate(apiKey, baseId, table, intake.email, intake.campaign);
  if (isDuplicate) {
    return { ok: true, recordId: "skipped-duplicate", duplicate: true };
  }

  const now = new Date();

  // Fields left unset on purpose: Received By, Assigned To, Processed By,
  // Date Processed, and every "Converted To..." linked-record field — all
  // are set later, by a human, during triage/conversion.
  const fields: Record<string, string> = {
    Description: buildDescription(intake),
    "Intake Source": intake.intakeSource,
    "Date Received": toDateOnly(now),
    "Business Unit": intake.businessUnit,
    "Intake Status": "New",
    "Next Action": intake.nextAction,
    "Next Action Due": nextBusinessDay(now),
    Email: intake.email,
    Campaign: intake.campaign,
    "Referral Source": intake.referralSource,
    "Inquiry Type": intake.inquiryType,
  };
  // First Name is intentionally left unset when it can't be confidently
  // parsed — the raw submitted name still shows up in Description via
  // buildDescription()'s submittedName fallback.
  if (intake.firstName) fields["First Name"] = intake.firstName;
  if (intake.lastName) fields["Last Name"] = intake.lastName;
  if (intake.organization) fields.Organization = intake.organization;
  if (intake.role) fields.Role = intake.role;
  if (intake.gradeLevel) fields["Grade Level / Audience"] = intake.gradeLevel;
  if (intake.service) fields["Service Requested"] = intake.service;
  if (intake.preferredFormat) fields["Preferred Format"] = intake.preferredFormat;
  if (intake.goal) fields["Goals / Challenge"] = intake.goal;
  if (intake.preferredTiming) fields["Preferred Timing"] = intake.preferredTiming;
  if (intake.discountCode) fields["Discount Code"] = intake.discountCode;

  try {
    const res = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields, typecast: true }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Airtable returned ${res.status}: ${body.slice(0, 300)}` };
    }

    const data = (await res.json()) as { id: string };
    return { ok: true, recordId: data.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown Airtable error",
    };
  }
}
