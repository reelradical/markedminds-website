# Marked Minds Planner — V1 Privacy and Data Boundary

**Status:** Required product behavior for future implementation  
**Phase:** 1B — documentation only  
**Last updated:** October 6, 2026

This document defines what Marked Minds Planner V1 may collect, persist, send
to an AI provider, log, analyze, and delete. It is a product/engineering
contract, not a claim of FERPA, COPPA, HIPAA, district-policy, or other legal
compliance. Formal legal and school-procurement review remains necessary before
institutional deployment.

## 1. V1 privacy posture

- The product is for adult teacher accounts, not student accounts.
- V1 must not intentionally collect student-identifying information.
- Classroom needs are described in aggregate and with the minimum detail needed
  to shape a plan.
- Accepted lesson content stays inside access-controlled plan/revision records.
- Full planning content is excluded from operational logs, analytics, and AI
  generation metadata.
- Rejected sensitive text is not persisted or sent to a model provider.
- Marketing analytics remain separate from the Planner application as defined
  in `docs/PLANNER_ARCHITECTURE.md`.

## 2. Student data boundary

### Allowed classroom descriptions

Teachers may describe aggregate, non-identifying instructional needs, such as:

- “8 students are below grade level.”
- “Several students need movement breaks.”
- “Two students use visual supports.”
- “The class benefits from short directions and worked examples.”
- “A small group needs additional decoding practice.”
- “Avoid activities that require students to read aloud individually.”

Counts and broad group-level needs are allowed when they do not make a student
reasonably identifiable in context.

### Disallowed content

Teachers must not enter or paste:

- student names, initials used as identifiers, email addresses, usernames, or
  photographs
- student IDs, roster numbers, device IDs, or other unique identifiers
- specific diagnostic, disability, behavioral, disciplinary, or evaluation
  records tied to an individual
- medical information, medication details, health plans, or emergency records
- individualized records copied or closely paraphrased from an IEP, 504 plan,
  behavior plan, evaluation, student information system, or case notes
- grades, attendance, family information, or communications attributable to a
  particular student
- combinations of details that identify a student even without a name
- any other directly identifying student information

The application must not offer fields for rosters, student profiles, or student
document uploads in V1.

### Required helper text

Show this concise text beside every free-text field likely to receive classroom
context, including student needs, teaching-context notes, constraints, and
additional notes:

> Describe needs in groups, not by student. Do not include names, IDs,
> diagnoses, medical details, or text copied from IEPs or 504 plans.

Where space permits, link to a short explanation with allowed and disallowed
examples. Do not rely on Terms of Service alone to communicate this boundary.

## 3. Response to potentially identifying content

Privacy screening must run before persistence and before any request is sent to
an AI provider.

### Screening behavior

1. Screen all relevant free-text fields on the server. Client-side warnings may
   improve usability but are not the enforcement boundary.
2. Use conservative deterministic checks for obvious identifiers and record
   formats, supplemented by a privacy classifier only if its own data handling
   is approved. Do not send suspect text to the planning model for screening.
3. If content appears identifying, stop the request before creating a plan
   revision or provider call.
4. Do not store the rejected raw text, matched excerpts, or a full request body.
5. Record only a minimal security event such as category
   `privacy_input_blocked`, field name, timestamp, request correlation ID, and
   authenticated user ID where necessary for abuse/support operations.
6. Never include the rejected text in logs, error trackers, analytics, support
   notifications, or generation metadata.

### Teacher-facing response

Use neutral, actionable language:

> This may include information that identifies a student. Remove names, IDs,
> diagnoses, medical details, and text copied from an IEP or 504 plan. Describe
> the need at a group level, then try again.

Return the teacher to the field so they can revise locally. If technically
possible, indicate the category—not the sensitive excerpt—that triggered the
warning. Do not provide a V1 “submit anyway” override. Provide a support path
for repeated false positives without asking the teacher to email the sensitive
text.

### Output screening

Generated output must also pass structural and privacy validation before it is
shown or saved. If a provider introduces identifying-looking or diagnostic
content that was not present in the accepted input, reject the output, record a
safe error category, and retry only under the approved retry policy. Never show
an invalid draft as a successful plan.

### Limitations

No automated detector is perfect. Product copy must not promise that the system
can identify every form of student data. The teacher-facing policy, data
minimization, provider settings, access controls, and deletion behavior remain
necessary even with screening.

## 4. Data retention categories

Exact time periods are intentionally deferred. Before beta launch, every
category must receive an approved default period, backup-expiration behavior,
and documented support procedure.

| Category | Exists in V1? | Store full content? | Application-log rule | Sensitivity | Deletion expectation |
|---|---|---|---|---|---|
| Account/auth data | Yes | Auth provider stores the minimum identity/session data required; application stores only identity reference and lifecycle state | Never log tokens, magic links, provider claims, or full auth payloads | High | Account deletion revokes sessions and schedules removal of provider/application identity data, subject to narrowly defined security/legal exceptions |
| Profile data | Yes | Store the approved profile contract | Exclude notes and profile values; IDs may appear only where operationally necessary | Moderate–high | Deleted with the account; editable at any time |
| Teacher-entered planning inputs | Yes | Store accepted, privacy-screened normalized input snapshots so plans can be reopened and revised | Never log full fields, request bodies, or matched text | High | Deleted when the containing plan is permanently deleted or when the account is deleted |
| Generated plans | Yes | Store validated canonical output snapshots | Never log full generated output | High | Deleted with the containing plan/account |
| Revision history | Yes | Store every accepted immutable input/output version | Logs may contain plan/revision IDs and status only | High | Permanent plan deletion removes the complete revision graph; deleting only the current revision is not supported |
| AI generation metadata | Yes | Store allowlisted operational fields only; no full prompt or response | Safe metadata/error categories may be logged; no lesson content | Moderate | Delete user-linked run metadata with the plan/account unless an approved, de-identified aggregate is retained |
| Rejected privacy-sensitive input | No | Do not persist raw content | Never log content or excerpts | Critical | Discard immediately; retain only minimal non-content block event if required |
| Application logs | Yes | Store minimal operational events, identifiers, timing, and safe error categories | Redact headers, cookies, tokens, request/response bodies, profile notes, lesson content, and provider payloads | Moderate | Use the shortest operational period that supports incident response; define before beta |
| Planner analytics | No in V1 | None | No Planner analytics SDK/events in Phase 1B/V1 initial slice | N/A | Reassess only with an explicit event allowlist and privacy review |
| Marketing analytics | Existing, outside Planner | Governed by the marketing-site policy; no Planner content | Must remain outside Planner layout | Separate boundary | Follow marketing analytics policy |
| Backups | Future infrastructure behavior | Encrypted backup copies may temporarily contain retained database records | Never expose through logs | Same as source data | Deleted records may persist only until the documented backup-expiration window; define before beta |

### Data minimization rules

- Do not duplicate revision content into generation runs, logs, analytics, email,
  notifications, or support tools.
- Do not store full rendered prompts. Store prompt version identifiers; prompt
  templates live in version-controlled server code.
- Do not store chain-of-thought or hidden provider reasoning.
- Do not retain raw provider request/response bodies by default.
- Do not use teacher content for product analytics event properties.
- Do not use production planning content as an evaluation dataset without a
  separate, explicit consent and de-identification decision.
- Do not use teacher or classroom content for model training unless a later
  explicit opt-in policy is approved; default is no.

## 5. AI provider boundary

Before selecting or enabling a provider, verify and document:

- API inputs/outputs are not used to train provider models by default under the
  chosen account terms
- provider-side retention and any available zero-retention controls
- data-processing terms and subprocessors
- region/residency options if school customers require them
- whether provider abuse monitoring can retain content
- deletion/support procedures and breach notification terms

Only the server-side planning service may access provider credentials. The
browser sends a structured request to Marked Minds, never directly to a model
provider.

## 6. Logging and observability allowlist

Operational telemetry may include:

- request correlation ID
- internal user, plan, revision, and generation-run IDs
- route/action name
- safe status and error category
- duration/latency
- normalized provider/model aliases
- token counts or other allowlisted usage totals
- timestamp and deployment/environment identifier

Operational telemetry must not include:

- cookies, authorization headers, provider keys, or auth tokens
- email addresses or display names
- teacher profile notes
- Plan Tomorrow inputs
- generated plan output
- rendered prompts or raw provider payloads
- student-data warning excerpts
- stack traces containing serialized request bodies

Error-reporting integrations must use explicit before-send redaction and an
allowlist approach. “Do not log this intentionally” is insufficient if a
framework automatically captures request bodies or component props.

## 7. Deletion contract

### Plan deletion

- Archive and permanent deletion are distinct actions.
- Archive hides a plan from the default list but retains all data.
- Permanent deletion removes the plan, every revision, linked generation-run
  metadata, and user-facing derived artifacts.
- The UI must clearly warn that revision history will also be deleted.
- Backups expire deleted content according to the future documented backup
  window; they are not used to restore a user-deleted individual plan.

### Account deletion

- Revoke active sessions promptly.
- Remove profile, teacher profile, plans, revisions, and linked generation
  metadata through a tested deletion workflow.
- Remove or irreversibly de-identify support/operational references where they
  are not required for security or legal obligations.
- Tell the user what is deleted immediately versus what expires from backups.
- Failed partial deletions must be retryable and observable without logging the
  deleted content.

### Organization-era deletion

Do not define organization retention in V1. When organizations are introduced,
separately define ownership, export, member-removal, admin-deletion, litigation
hold, and district-contract requirements before moving personal plans into an
organization workspace.

## 8. Analytics boundary

The current Planner layout contains no GA4, Microsoft Clarity, Vercel Web
Analytics, or Planner-specific tracking. Preserve that state through the first
vertical slice unless a separate analytics contract is approved.

If Planner analytics are later approved:

- begin with an explicit event-name/property allowlist
- prohibit free text, titles, objectives, materials, constraints, plan content,
  profile values, and stable provider request IDs in event properties
- use coarse workflow/status events and short pseudonymous identifiers
- keep session replay prohibited on authenticated Planner routes
- document consent, retention, deletion, and vendor behavior before activation

## 9. Pre-beta privacy decisions still required

- exact retention periods for logs, generation metadata, deleted records, and
  backups
- privacy notice and Terms of Use
- incident-response and deletion-support ownership
- selected auth/database/AI vendor agreements and settings
- whether any school/district contract changes residency, SSO, audit, export,
  or deletion requirements
- approved privacy-screening implementation and false-positive review process
- policy for exports/downloaded plans outside Marked Minds systems
