# Marked Minds OS — Airtable Schema & Integration

This documents the **actual, live-verified** schema of the Marked Minds OS
v1.0 Airtable base, and exactly how the website integrates with it. Base
structure, table names, and field names below were pulled directly from
Airtable's Meta API (`GET /v0/meta/bases/{baseId}/tables`), not designed
in advance — this doc describes what's really there.

**The website only ever writes to one table: Intake Queue.** Everything
else in the base (Organizations, Contacts, Interactions, Opportunities,
Projects, Programs, Tasks, Creative Studio, Operations) is part of the
broader Marked Minds OS and is populated/managed manually or via Airtable
automations, not by website code.

---

## Base

**Marked Minds OS** — 10 tables total: Organizations, Contacts,
Interactions, Opportunities, Projects, Tasks, Programs, Creative Studio,
Operations, **Intake Queue**.

---

## Intake Queue — the only table the website writes to

Table ID: `tbl8SXWDJ6eaf9kqx`. Primary field: `Description`.

Design intent: a lightweight, human-triaged inbox. The website drops a
record here on every successful submission; a human (or an Airtable
automation) reviews it, updates `Intake Status`, and eventually links it
to a proper `Contacts`/`Organizations`/`Opportunities` record via one of
the `Converted To...` fields.

| Field | Type | Set by website? | Notes |
|---|---|---|---|
| Description | Long text (primary) | ✅ always | Formatted human-readable summary — see `buildDescription()` in `airtable.ts` |
| Intake Source | Single select | ✅ always | See options below |
| Date Received | Date (no time) | ✅ always | Submission date |
| Received By | Collaborator | ❌ never | Requires a real Airtable user email — left blank |
| Business Unit | Single select | ✅ always | See options below |
| Intake Status | Single select | ✅ always `New` | See options below |
| Assigned To | Collaborator | ❌ never | Left blank for manual triage |
| Next Action | Single line text | ✅ always | Fixed per intake source, e.g. "Review educator inquiry and respond" |
| Next Action Due | Date (no time) | ✅ always | Computed: next business day (Sat/Sun skipped) from Date Received |
| Converted To (→ Opportunities) | Linked record | ❌ never | Set manually during triage |
| Converted To (Projects) | Linked record | ❌ never | Set manually |
| Converted To (Programs) | Linked record | ❌ never | Set manually |
| Converted To (Contacts) | Linked record | ❌ never | Set manually |
| Converted To (Organizations) | Linked record | ❌ never | Set manually |
| Converted To (Tasks) | Linked record | ❌ never | Set manually |
| Converted To (Interactions) | Linked record | ❌ never | Set manually |
| Date Processed | Date (no time) | ❌ never | Set manually when triaged |
| Processed By | Collaborator | ❌ never | Set manually |
| First Name | Single line text | Only if confidently known | Left unset (not sent as empty string) when unavailable/unparseable — see below |
| Last Name | Single line text | Only if confidently known | Same as above |
| Email | Email | ✅ always | |
| Organization | Single line text | When collected | |
| Role | Single line text | When collected | |
| Grade Level / Audience | Single line text | When collected | |
| Service Requested | Single select | When applicable | Black2School values match its form dropdown exactly (typecast will add new options if a value doesn't match an existing choice) |
| Preferred Format | Single select | When applicable | `Virtual`, `In Person`, `Either` — website form wording (`In-person`, `No preference`) is transformed before sending |
| Goals / Challenge | Long text | When collected | |
| Preferred Timing | Single line text | When collected | |
| Discount Code | Single line text | When collected | |
| Campaign | Single line text | ✅ always | Free text, e.g. `black2school-2026`, `focus-flex-interest` |
| Referral Source | Single line text | ✅ always | Free text, e.g. `black2school-conference`, `Website` |
| Inquiry Type | Single select | ✅ always | See options below |

**Formula fields:** none exist in Intake Queue.

### Select field options (live, verified)

- **Intake Source**: `Website Inquiry`, `Black2School Submission`, `Contact Form`, `Partnership Inquiry`, `Speaking Request`, `Idea`, `Note`, `Referral`, `Email Requiring Action`, `Potential Project`, `Other`
- **Business Unit**: `Marked Minds`, `Focus + FLEX Academy`, `Dream Deferred`, `Remnants`, `Internal Operations`, `Research & Development`, `Shared`, `Future Initiative`
- **Intake Status**: `New`, `Reviewing`, `Waiting`, `Ready to Convert`, `Converted`, `Archived`
- **Inquiry Type**: `Educator Experience`, `General Inquiry`, `Partnership`, `Speaking`, `Program`, `Creative Services`, `Other`
- **Service Requested**: `One-on-one educator consultation`, `AI-supported lesson-planning session`, `Classroom coding integration session`, `Team or small-group training`, `Custom workshop`, `Resource-development request`, `Not sure—I need help choosing`, plus `Focus + FLEX Interest List` (auto-created via `typecast: true` when the Focus + FLEX interest form submits — not manually added to the base)

---

## Integration architecture — `src/lib/airtable.ts`

One reusable function, `saveIntake(intake: IntakeInput)`, called by every
form that writes to Airtable. Required env vars: `AIRTABLE_API_KEY`,
`AIRTABLE_BASE_ID`, `AIRTABLE_INTAKE_TABLE`. Missing any of the three
returns a clear failure — never throws, never fabricates success.

**`IntakeInput` fields that are always required:** `email`, `campaign`,
`referralSource`, `intakeSource`, `businessUnit`, `inquiryType`,
`nextAction`. Everything else (`firstName`, `lastName`, `service`,
`preferredFormat`, `goal`, `organization`, `role`, `gradeLevel`,
`preferredTiming`, `discountCode`) is optional — omitted fields are simply
not sent to Airtable rather than sent as empty strings, so the schema
stays clean per-intake-source.

**Name handling:** if a caller can't confidently split a name into
first/last (e.g. a single word, or nothing submitted), it should leave
`firstName`/`lastName` unset and pass the raw text as `submittedName`
instead — `buildDescription()` falls back to that for the Description
text, so nothing is lost even when the structured fields stay blank.

### Current callers

| Caller | Route | Intake Source | Business Unit | Inquiry Type | Resend email? |
|---|---|---|---|---|---|
| Black2School conference form | `/api/campaign-inquiry` | `Black2School Submission` | `Marked Minds` | `Educator Experience` | ✅ Yes — email sent first; Airtable write only happens after email succeeds |
| Focus + FLEX interest list | `/api/focus-flex-interest` | `Website Inquiry` | `Focus + FLEX Academy` | `Program` | ❌ No — intentionally deferred, Airtable-only for now |

Both follow the same non-blocking principle: **a failed Airtable write
never turns a real submission into a user-facing error.** The difference
is what gates the Airtable write — Black2School requires the email to
succeed first (so no orphaned record exists without a notification);
the interest list has no email step at all, so it writes to Airtable
directly.

### Duplicate prevention

`saveIntake()` queries Airtable itself (not local/in-memory state, which
isn't reliable across serverless invocations) before creating a record:

```text
AND({Email}='...', {Campaign}='...', IS_AFTER(CREATED_TIME(), DATEADD(NOW(), -5, 'minutes')))
```

If a match exists, record creation is skipped and the result is marked
`duplicate: true` (still returns success to the caller). **Fails open** —
if the check itself errors, it proceeds to create rather than risk
silently dropping a real submission over an unrelated Airtable hiccup.

**Known limitation:** this is a check-then-write pattern, not an atomic
lock. Two near-simultaneous requests (true concurrent double-clicks
within milliseconds) could both pass the check before either record
exists, producing two records. Low likelihood in practice; not airtight.

### Automation

An "Intake Status = New" automation exists in the base (per Marked Minds
OS v1.0 verification) and creates a follow-up Task. **Airtable's public
API has no endpoint for reading automation configuration** — this can't
be verified programmatically from the website's side; if the automation
ever needs debugging, that has to happen in the Airtable UI directly.

---

## Not yet automated

- Organizations/Contacts/Opportunities/Projects/Programs/Tasks/
  Interactions/Creative Studio/Operations tables are never written to by
  the website — only read indirectly via the `Converted To...` linked
  fields once a human triages an Intake Queue record.
- No automatic linking/dedup against existing Organizations or Contacts
  records (e.g. a second inquiry from the same school doesn't get linked
  to an existing Organizations record automatically).
- `Last Name`-only or free-text names beyond simple "First Last" parsing
  aren't split further (e.g. "Dr. Maria Gonzalez-Smith" would parse as
  first="Dr." last="Maria Gonzalez-Smith" — imperfect but harmless, full
  text is always preserved in Description regardless).
