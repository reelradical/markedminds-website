# Marked Minds OS — Architecture Reference

Living reference for the website ↔ email ↔ CRM system. For the detailed
Airtable field-by-field schema, see `docs/AIRTABLE_CRM_SCHEMA.md`. For
photo/asset gaps, see `docs/ASSET_CHECKLIST.md`. For version history, see
`docs/CHANGELOG.md` and `docs/RELEASES.md`.

---

## Status: Resend + Transactional Email Workflows — COMPLETE

- ✅ Resend connected and live
- ✅ React Email templates built (`src/emails/` — see `STYLE_GUIDE.md` for the shared voice/design conventions)
- ✅ Black2School confirmation + internal notification live
- ✅ Focus + FLEX confirmation + internal notification live
- ✅ Airtable + Task creation verified (multiple live end-to-end tests, both local and production)
- ✅ Production deployment verified (`fed6851`, confirmed via GitHub deployment status, not assumed)
- ⚠️ Mobile rendering — **not independently verified.** No real device or browser-automation tool (Playwright) was available in this environment; a headless-Chrome CLI screenshot attempt at a narrow viewport was inconclusive and confirmed (via a plain-HTML control test) to be a limitation of that specific tool, not a template bug. The markup uses standard responsive email patterns (max-width container, fluid table-based Sections), but this should get a real manual check (e.g. forward a test email to a phone) before being treated as fully confirmed.
- ⚠️ QA records — **partially deleted.** All 5 test Intake Queue records were deleted and confirmed gone via search. Their 5 linked Task records could **not** be deleted — the Airtable API token has no write (or even read) access to the Tasks table, only Intake Queue. These are now orphaned and need manual deletion in Airtable's UI: `rec171cPgx4UdNpzH`, `rec8yCTSb39D2twBv`, `recAt6eZkE5xj9jqZ`, `rechkfkvbNHgnTovX`, `rec7WSC0ESqH47uID`.

**Status:** Complete
**Deployed:** `fed6851`
**Owner:** Dani
**Last verified:** July 24, 2026
**Next review:** when adding a new form or email template

---

## Current architecture

```
                    ┌─────────────────┐
   Website forms →  │  Next.js API     │
                    │  route (validate)│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Resend (email)   │  ← notification layer
                    │  src/lib/email.ts │
                    └────────┬─────────┘
                             │ (only on success, where applicable)
                    ┌────────▼─────────┐
                    │  Airtable Intake  │  ← system of record
                    │  Queue (saveIntake)│
                    │ src/lib/airtable.ts│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Airtable          │  human triage,
                    │ automation +      │  "New Inquiry"
                    │ manual conversion │  → Tasks, Intake
                    │ to Contacts/Orgs/ │    Status updates
                    │ Opportunities     │
                    └───────────────────┘
```

Two independent pieces, deliberately decoupled:
- **Resend** = notification (someone gets emailed a submission happened)
- **Airtable Intake Queue** = system of record (the submission is durably captured, triage-able, and feeds the "New Inquiry" automation)

A form can use either, both, or neither layer — see the per-form table
below.

---

## Website flow (per form)

| Form | Page | API route | Email? | Airtable? |
|---|---|---|---|---|
| Black2School conference inquiry | `/black2school` | `/api/campaign-inquiry` | ✅ Resend, gates the Airtable write | ✅ Intake Queue |
| Focus + FLEX Session II interest list | `/focus-flex` | `/api/focus-flex-interest` | ❌ not wired (by design, for now) | ✅ Intake Queue |
| Starter Kit (lead magnet) | hidden (`campaign.features.starterKit = false`) | `/api/campaign-lead` | ✅ Resend only | ❌ not wired |
| General Contact | `/contact` | `/api/contact` | ❌ log-only, never wired to Resend | ❌ not wired |
| Newsletter signup | homepage footer | `/api/newsletter` | ❌ log-only | ❌ not wired |

See Phase 3 of the latest Production Readiness Report (chat history) for
the full CONNECTED/PARTIALLY CONNECTED/NOT CONNECTED audit across every
form, including ones that don't exist yet (Speaking, Consulting,
Partnership).

---

## CRM flow (Airtable Intake Queue)

1. Form submits → API route validates + sanitizes.
2. (If applicable) Resend sends a notification email.
3. `saveIntake()` checks Airtable for a same-email/same-campaign record
   created in the last 5 minutes (duplicate guard) — skips if found.
4. Otherwise, creates one Intake Queue record: `Intake Status = New`,
   `Next Action` + `Next Action Due` (next business day) pre-filled,
   source-specific `Intake Source`/`Business Unit`/`Inquiry Type` set.
5. Airtable's "New Inquiry" automation (configured in the Airtable UI —
   not readable via API) fires on `Intake Status = New` and creates a
   follow-up Task.
6. A human triages: updates `Intake Status` (New → Reviewing → ... →
   Converted), and eventually links the record to Contacts/
   Organizations/Opportunities via the `Converted To...` fields.

Steps 1–4 are automated by the website. Steps 5–6 are Airtable-side
(automation + human), outside the website's control or visibility.

---

## Automation flow — known limitation

**Airtable's public REST API has no endpoint for reading automation
configuration.** Confirmed by direct API probe (`GET /v0/meta/bases/{id}/automations`
→ `403 INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND`, which is Airtable's way of
saying the endpoint doesn't exist for any token, not a permissions issue).

This means the website's code can create a record with `Intake Status =
New`, but **cannot verify from the API whether the automation actually
fired, what it's watching, or where its output goes.** All automation
verification has to happen manually in the Airtable UI (Automations tab),
or by checking downstream effects (e.g. querying the Tasks table for a
new record after a test submission, which is what was done for QA).

---

## Environment variables

| Variable | Purpose | Local (`.env.local`) | Vercel Production |
|---|---|---|---|
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID | ✅ set | ✅ confirmed |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID | ✅ set | ✅ confirmed |
| `RESEND_API_KEY` | Resend API key | ✅ set | ✅ confirmed |
| `CAMPAIGN_INQUIRY_TO_EMAIL` | Notification recipient | ✅ set (`markedminds@gmail.com`) | ✅ confirmed |
| `CAMPAIGN_FROM_EMAIL` | Verified sender | ✅ set (`dani@markedminds.com`, domain verified) | ✅ confirmed |
| `AIRTABLE_API_KEY` | Airtable personal access token | ✅ set | ⚠️ **not yet confirmed** |
| `AIRTABLE_BASE_ID` | Marked Minds OS base id | ✅ set | ⚠️ **not yet confirmed** |
| `AIRTABLE_INTAKE_TABLE` | Intake Queue table name | ✅ set (`Intake Queue`) | ⚠️ **not yet confirmed** |

No `AIRTABLE_LEADS_TABLE`, `AIRTABLE_ORGANIZATIONS_TABLE`,
`AIRTABLE_CAMPAIGNS_TABLE`, or `AIRTABLE_INTERACTIONS_TABLE` — those were
early placeholders from before the real schema was inspected and don't
match the actual base (there is no "Campaigns" table); removed from
`.env.example` to avoid confusion.

---

## Deployment checklist

- [ ] Confirm all 3 `AIRTABLE_*` variables are set in Vercel Production (only variable outstanding — everything else already confirmed)
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] Smoke test `/black2school` submission on production after deploy
- [ ] Smoke test `/focus-flex` interest-list submission on production after deploy
- [ ] Confirm `/api/contact` still returns 200 on production
- [ ] Verify no `.env.local` values or secrets appear in the git diff being pushed

## Testing checklist (repeat after any Airtable/email code change)

- [ ] Invalid submission → 400, both `/api/campaign-inquiry` and `/api/focus-flex-interest`
- [ ] Valid Black2School submission → email received at `CAMPAIGN_INQUIRY_TO_EMAIL`, exactly one Intake Queue record, all fields correct, `Preferred Format` transform correct
- [ ] Valid Focus + FLEX interest submission → exactly one Intake Queue record, no email sent, name parsing correct (both parseable and single-word cases)
- [ ] Immediate resubmission of identical data → no second record created (query Airtable directly to confirm count)
- [ ] `/api/contact` still returns `{ok:true}` on a valid payload
- [ ] `git status` / `git diff --cached` show no secrets and `.env.local` excluded

---

## Known limitations

1. **Duplicate-check race condition**: check-then-write, not atomic. True concurrent (millisecond-apart) submissions could both pass the check. Low likelihood, not zero.
2. **UTC date computation**: `Date Received`/`Next Action Due` are computed in UTC (`toISOString().slice(0,10)`), not the business's local timezone. Submissions near midnight UTC (~8pm Eastern) could be dated a day off from local expectation.
3. **Automation opacity**: no programmatic way to verify the "New Inquiry" automation's trigger condition or confirm it's still enabled — see "Automation flow" above.
4. **`typecast: true` on select fields**: resilient (a new/unexpected value auto-creates a select option instead of failing the request), but means a code typo could silently pollute an Airtable select field's option list without anyone noticing immediately.
5. **No analytics on the Focus + FLEX interest form**: `session-interest-form.tsx` has zero `trackEvent()` calls — no visibility into interest-list conversion via GA4/Clarity.
6. **Starter Kit fully built but unused**: page section, form, API wiring, and analytics events all exist but are hidden — the 8 promised resource files were never authored (see `docs/ASSET_CHECKLIST.md`).
7. **General Contact form has no CRM/email wiring**: still exactly the log-only behavior from before this entire CRM effort — every inquiry through `/contact` today is only visible in server logs.

## Future roadmap

- Add analytics tracking to the Focus + FLEX interest form (page view, form start, form submit at minimum, matching the Black2School pattern).
- Wire `/api/contact` to the same `saveIntake()` helper once field mapping is decided (its current field shape — name/email/org/inquiryType/message — doesn't map cleanly to Intake Queue's granular fields; likely needs most of `message` folded into `Description`).
- Build dedicated forms for Speaking, Consulting, and Partnership inquiries — schema-ready (`Intake Source`/`Inquiry Type` options exist for Speaking; Consulting has no exact `Inquiry Type` match yet and needs a decision).
- Author the 8 AI Classroom Starter Kit resources, then flip `campaign.features.starterKit = true`.
- Decide and implement Organizations/Contacts auto-linking logic (dedup by school/email) once there's enough real intake volume to know what the right behavior is.
- Consider timezone-aware date computation if the UTC-boundary edge case ever causes a real triage confusion.
