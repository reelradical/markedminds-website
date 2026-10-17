# MAPS private-beta insights

**Audience:** Marked Minds internal administrators only

**Route:** `/planner/admin/beta`

**Data source:** existing MAPS operational records in Supabase

## Purpose and limits

The dashboard measures private-beta product participation and workflow behavior.
It does not measure teaching quality, learning quality, student outcomes, or the
educational effectiveness of a generated plan. Those claims require separate
evidence and cannot be inferred from usage counts or teacher button responses.

MAPS does not add page analytics, session replay, login events, or plan-open
events for this dashboard. A login or reopened plan therefore does not count as
activity unless the teacher completes a persisted action.

## Authorization model

Migration `202610150001_maps_beta_insights.sql` adds:

- `public.maps_beta_admins`, a UUID-only allowlist keyed to `auth.users.id`
- `public.get_maps_beta_insights()`, a `SECURITY DEFINER` aggregate RPC

The allowlist stores no email address or other PII. Direct access is revoked
from `public`, `anon`, and `authenticated`, and it has no client RLS policies.
The RPC uses an empty `search_path`, checks `auth.uid()` against the allowlist
before reading beta data, raises PostgreSQL `42501` for non-admins, and can be
executed only by the `authenticated` role. The application translates `42501`
into a non-disclosing 404.

The RPC returns no raw user UUID, email, lesson input/output snapshot, student-
needs text, teacher-profile note, teacher revision direction, or feedback
comment. User rows contain the existing profile display name and a short stable
opaque identifier derived from the UUID.

No service-role key or new environment variable is required. The dashboard
uses the existing authenticated Supabase cookie and public server client.

## Manual administrator seed

Find the intended administrator UUID under Supabase **Authentication → Users**.
Do not paste it into source control or chat. In a Supabase SQL Editor query
running as `postgres`, execute:

```sql
reset role;

insert into public.maps_beta_admins (user_id)
values ('PASTE-THE-COMPLETE-USER-UUID-HERE'::uuid)
on conflict (user_id) do nothing;
```

Never grant allowlist access to `authenticated`. To remove an administrator,
delete that UUID manually as `postgres`.

## Metric definitions

### Beta user

A user whose `profiles.onboarding_completed` value is true.

### Active user

A beta user with at least one qualifying persisted action: creating a saved
plan, creating a guided revision, submitting feedback, or updating feedback on
a later UTC day. Profile creation, login, logout, and page views do not count.

### Active day

A distinct UTC calendar date on which a beta user completed at least one
qualifying persisted action. Multiple actions on one UTC day count as one active
day for that user.

### Returning user

An active user with a qualifying persisted action on at least two distinct UTC
days. This means another saved action on a different UTC day—not merely another
login, browser session, plan reopen, or page view.

### Active in the last 7 days

A beta user with at least one qualifying persisted action on the current UTC
date or the six preceding UTC dates.

### Saved plan

A plan with status `active` or `archived`. Draft rows are excluded.

### Total revisions

Guided regenerated revisions only. The initial immutable version is represented
by its saved plan and is not counted as a guided revision.

### Plans per active user

Total saved plans divided by users with at least one qualifying persisted
action.

### Revision rate

Saved plans with at least one guided revision divided by all saved plans.
Multiple revisions of one plan do not increase the numerator.

### Feedback response rate

Immutable plan versions with a stored feedback response divided by all
immutable plan versions. The one-response-per-user/plan/revision constraint
means each version contributes at most one response.

### Teachability rate

`Yes` responses divided by all feedback responses. The dashboard separately
shows `Yes + Mostly` as a broader usability signal; neither rate is an
educational-quality or student-outcome claim.

### First and last activity

The earliest and latest qualifying persisted action for a beta user. Onboarding,
login, logout, and passive reopening are not represented in existing data.

## Feedback privacy

The main dashboard shows only response counts for `Yes`, `Mostly`, and `No`,
split by original/revised version and the allowlisted guided-revision intent.
Optional feedback comments are not returned by the RPC and are not displayed.
There is no bulk comment-review page in this checkpoint.

## Latency, tokens, and cost

Latency and token averages include successful generation records with available
metadata. Initial Plan Tomorrow calls and guided revisions are reported
separately. Failed runs may not have token metadata, so their cost can be absent.

The cost estimate recognizes `gpt-5.4-mini` and its dated snapshots. It uses the
standard uncached text-token rates published in the official OpenAI model
documentation and checked on October 16, 2026:

- input: `$0.75` per million tokens
- output: `$4.50` per million tokens

Source: [GPT-5.4 Mini model documentation](https://developers.openai.com/api/docs/models/gpt-5.4-mini)

MAPS does not currently persist cached-input-token detail, so all recorded input
tokens are priced at the standard input rate. The displayed result is therefore
an upper-bound estimate for the recorded successful calls; actual billed cost
may be lower. Regional-processing uplifts and unmetered failed calls are not
included. Pricing is a dated assumption and must be rechecked before financial
forecasting.

## Validation requirements

Before release:

1. An allowlisted administrator can load `/planner/admin/beta`.
2. An ordinary authenticated account receives a non-disclosing 404.
3. Anonymous callers cannot read `maps_beta_admins` or execute the RPC.
4. Aggregate totals match read-only direct database checks.
5. The default response and rendered page contain no lesson snapshots, student-
   needs text, teacher notes, revision directions, feedback comments, emails, or
   raw user UUIDs.
6. Existing teacher-owned RLS tests continue to pass.
