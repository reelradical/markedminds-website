# Marked Minds Planner — V1 Data Model and Infrastructure Decision

**Status:** Approved logical design target; no database exists yet  
**Phase:** 1B — documentation only  
**Last updated:** October 6, 2026

This document translates the V1 product contract into a provider-neutral
logical schema, defines generation metadata, and reassesses auth/database
options. It does not create migrations or install packages.

See also:

- `docs/PLANNER_PRODUCT_CONTRACT.md`
- `docs/PLANNER_PRIVACY_BOUNDARY.md`
- `docs/PLANNER_ARCHITECTURE.md`

## Modeling rules

- Use application-generated UUIDs for application entities.
- Use typed relational columns for ownership, relationships, statuses,
  versions, ordering, and timestamps.
- Use JSON/JSONB only for versioned structured snapshots or genuinely evolving
  provider-specific usage details.
- Store all timestamps in UTC as timezone-aware timestamps.
- Use database constraints in addition to application validation.
- Revisions are immutable. Database permissions/triggers may enforce this if
  application conventions alone are insufficient.
- Authorization is evaluated at the plan boundary. Child records never invent
  separate ownership.
- Every user-accessible query also passes through a server-only Data Access
  Layer, even when database row-level security is enabled.

## Logical schema

The names and types below are a contract, not migration-ready SQL. Exact enum,
index, deletion, and RLS syntax belongs in the future infrastructure phase.

### External auth identity

The future auth provider owns credentials, OAuth connections, email
verification, session state, and recovery. Marked Minds must not store password
hashes or provider refresh tokens in its application tables.

The application maps the provider identity to `profiles` using:

- `auth_provider`: stable provider namespace, such as `supabase`
- `auth_subject`: provider-issued stable subject identifier

The pair is unique. Application foreign keys use the internal `profiles.id`,
not the provider subject. This keeps planner content from depending directly on
one vendor's ID shape. Account linking is deferred; if later required, move
these two fields into a one-to-many `auth_identities` table.

### `profiles`

Application identity and lifecycle record.

| Column | Logical type | Rules |
|---|---|---|
| `id` | UUID | Primary key; application-generated |
| `auth_provider` | text | Required |
| `auth_subject` | text | Required; unique with `auth_provider` |
| `display_name` | varchar(80) | Required once onboarding is complete |
| `onboarding_status` | enum | `not_started`, `in_progress`, `complete` |
| `created_at` | timestamptz | Required, immutable |
| `updated_at` | timestamptz | Required |

Do not duplicate email in this table unless the application later needs a
verified contact snapshot independent of the auth provider. Email is not an
ownership key.

### `teacher_profiles`

One-to-one planning defaults for a profile.

| Column | Logical type | Rules |
|---|---|---|
| `user_id` | UUID | Primary key and FK → `profiles.id`; cascade on user deletion |
| `role` | enum | Required |
| `role_custom_label` | varchar(80), nullable | Required only when role is `other` |
| `subject_areas` | text[] | Required; 1–5 normalized values |
| `grade_levels` | text[] | Required; 1–8 stable grade codes |
| `typical_class_duration_minutes` | smallint | Required; 10–240 |
| `typical_class_size` | smallint, nullable | 1–100 |
| `common_materials` | text[] | Required array; 0–20 entries |
| `plan_detail_preference` | enum | Required; default `balanced` |
| `transition_cleanup_preference` | enum | Required; default `standard` |
| `low_prep_preference` | enum | Required; default `neutral` |
| `movement_preference` | enum | Required; default `neutral` |
| `differentiation_preference` | enum | Required; default `when_relevant` |
| `teaching_context_notes` | varchar(1000), nullable | Privacy-screened before persistence |
| `created_at` | timestamptz | Required, immutable |
| `updated_at` | timestamptz | Required |

These stable preferences are typed columns rather than a general preferences
JSON object. That keeps defaults queryable and validates their allowed states.

### `plans`

Stable container for a planning task and all its revisions.

| Column | Logical type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `owner_user_id` | UUID | Required FK → `profiles.id`; V1 access owner |
| `created_by_user_id` | UUID | Required FK → `profiles.id`; equals owner in V1 |
| `workflow` | enum | V1 value `plan_tomorrow` |
| `status` | enum | `draft`, `active`, `archived` |
| `current_revision_id` | UUID, nullable | FK → `plan_revisions.id`; null until first valid revision |
| `created_at` | timestamptz | Required, immutable |
| `updated_at` | timestamptz | Required |

`current_revision_id` must reference a revision belonging to the same plan.
Enforce this with a composite foreign key or a deferred constraint/trigger, not
only application code.

Do not add `organization_id` in V1. Future workspaces can be backfilled from
`owner_user_id` as defined in the product contract.

### `plan_revisions`

Immutable, versioned plan content.

| Column | Logical type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `plan_id` | UUID | Required FK → `plans.id`; cascade when a plan is permanently deleted |
| `revision_number` | integer | Required; unique with `plan_id`; monotonically increasing |
| `parent_revision_id` | UUID, nullable | FK → `plan_revisions.id`; null only for original revision; parent must belong to same plan |
| `created_by_user_id` | UUID | Required FK → `profiles.id` |
| `source_kind` | enum | `initial_generation`, `regeneration`, `quick_action`, `manual_edit`, `format_transform` |
| `action_key` | text, nullable | Stable quick-action identifier when applicable |
| `input_schema_version` | text | Required; e.g. `plan_tomorrow_input.v1` |
| `output_schema_version` | text | Required; e.g. `generated_plan_output.v1` |
| `input_snapshot` | JSONB | Required; normalized input plus separately namespaced default provenance |
| `output_snapshot` | JSONB | Required; validated canonical generated plan |
| `generation_run_id` | UUID, nullable | Unique FK → `generation_runs.id`; absent for a future purely manual edit |
| `created_at` | timestamptz | Required, immutable |

No `updated_at` is needed because the row is immutable. Teacher edits create a
new revision.

Recommended checks/indexes:

- unique `(plan_id, revision_number)`
- index `(plan_id, created_at desc)`
- parent revision belongs to the same plan and is not self-referential
- `action_key` is present for `quick_action` and absent otherwise unless a
  future source kind explicitly defines it
- validated snapshot shapes and time invariant before insertion

### `generation_runs`

One record per model-call attempt, including failures that produce no revision.

| Column | Logical type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `plan_id` | UUID | Required FK → `plans.id` |
| `requested_by_user_id` | UUID | Required FK → `profiles.id` |
| `source_revision_id` | UUID, nullable | FK → selected existing revision for regeneration/quick action |
| `provider` | text | Required; internal provider identifier |
| `model_alias` | text | Required; internal alias such as `planner_primary`, not a UI promise |
| `provider_model_id` | text, nullable | Actual resolved model identifier for support/reproducibility |
| `prompt_version` | text | Required; e.g. `plan_tomorrow_prompt.v1` |
| `input_schema_version` | text | Required |
| `output_schema_version` | text | Required |
| `status` | enum | `queued`, `running`, `succeeded`, `failed`, `cancelled` |
| `started_at` | timestamptz, nullable | Set when provider work starts |
| `completed_at` | timestamptz, nullable | Terminal states only |
| `latency_ms` | integer, nullable | Non-negative; provider/application definition must stay consistent |
| `input_tokens` | integer, nullable | Non-negative when provider reports it |
| `output_tokens` | integer, nullable | Non-negative when provider reports it |
| `total_tokens` | integer, nullable | Non-negative when provider reports it |
| `provider_usage` | JSONB, nullable | Small allowlisted object for non-token usage units; never raw response content |
| `finish_reason` | text, nullable | Normalized allowlisted reason |
| `safe_error_category` | enum, nullable | Terminal failures only; no raw teacher/model content |
| `retry_of_run_id` | UUID, nullable | FK → `generation_runs.id` |
| `provider_request_id` | text, nullable | For vendor support; treat as operational metadata |
| `created_at` | timestamptz | Required, immutable |

Suggested safe error categories:

- `rate_limited`
- `provider_unavailable`
- `provider_timeout`
- `content_policy_blocked`
- `structured_output_invalid`
- `duration_validation_failed`
- `persistence_failed`
- `cancelled_by_user`
- `unknown_safe`

Privacy-blocked or structurally invalid input is rejected before a generation
run is created. Those outcomes use the separate minimal non-content request or
security event described in the privacy contract.

Do not store provider credentials, full prompts, raw provider request/response
bodies, chain-of-thought/reasoning, or full lesson content in generation runs.
The accepted input and output already belong in the access-controlled revision
snapshot. Failed attempts retain metadata, not rejected raw content.

## Transaction boundaries

### Initial generation

1. Authorize the user against the plan.
2. Privacy-screen and validate normalized input.
3. Insert a `generation_runs` record.
4. Call the provider outside a long database transaction.
5. Validate the structured output and duration invariant.
6. In one short transaction: mark the run succeeded, insert the immutable
   revision, and update `plans.current_revision_id`/status.

If step 4 or 5 fails, update only the safe generation status/error fields. Do
not create a revision or move the current pointer.

### Later revision

The same flow applies, with `source_revision_id` and `parent_revision_id`
pointing to the explicitly selected revision. Use optimistic concurrency or a
row lock when allocating `revision_number` and updating the current pointer.

## Authorization contract

V1 permissions are deliberately small:

- An authenticated user can read/update their own profile and teacher profile.
- A user can create and list plans only where `owner_user_id = current_user.id`.
- A user can read a revision or generation run only through a plan they own.
- A user cannot transfer ownership in V1.
- Archived plans remain owner-readable; archive is not deletion.
- Every server mutation rechecks authorization close to the data operation.

If Supabase is selected, mirror these rules with PostgreSQL RLS and test allow
and deny behavior for every operation. RLS is defense in depth, not a
replacement for the server-only DAL.

## Infrastructure comparison

This comparison was reviewed against first-party documentation on October 6,
2026. Pricing and feature limits must be rechecked immediately before purchase.

| Criterion | Supabase Auth + Postgres | Clerk + separate Postgres | Auth0 + separate Postgres | Auth.js + managed Postgres |
|---|---|---|---|---|
| Implementation complexity | **Low–medium.** One project supplies auth and relational storage; SSR cookie setup still requires care. | **Medium.** Excellent auth UI/SDK, but requires a second database vendor plus identity synchronization/webhooks. | **Medium–high.** Mature hosted identity plus a separate database and more tenant/dashboard configuration. | **Medium–high.** Fewer SaaS dependencies, but the application owns more session, email, adapter, and security integration work. |
| Next.js App Router fit | Supported through cookie-based SSR; current `@supabase/ssr` package is documented as beta. | First-class App Router, Server Component, Route Handler, Server Action, and middleware helpers. | Official Next.js SDK and quickstarts; hosted Universal Login. | Deep Next.js integration, but current Auth.js v5 documentation identifies the package line as beta. |
| Individual-teacher V1 | Strong fit; simple identity-to-profile mapping. | Strong fit with polished account UI. | Capable but heavier than V1 requires. | Capable, with more implementation responsibility. |
| Google sign-in | Supported. | Supported. | Supported social connection. | Supported OAuth provider. |
| Email fallback | Magic link/OTP supported. | Email code/link flows supported. | Passwordless email supported. | Magic-link provider supported; application configures an email service. |
| Relational data | Native managed PostgreSQL in the same platform. | Requires Neon, Supabase Database, or another Postgres provider. | Requires separate Postgres. | Requires separate managed Postgres. |
| RLS/authorization | Native PostgreSQL RLS integrates naturally with Supabase identity claims. | Clerk authorization does not automatically protect external database rows; implement DAL checks and optional database claim integration. | Auth0 roles/org context do not automatically protect external database rows; implement DAL checks. | Fully application-defined; PostgreSQL RLS is possible but token/session integration is custom. |
| Migration workflow | Supabase CLI produces versioned SQL migrations and supports local reset/test/push. | Determined by chosen DB/ORM; auth config lives separately. | Determined by chosen DB/ORM; auth tenant config lives separately. | Determined by chosen DB/ORM/adapter. |
| Vendor lock-in | **Low for data** because it is PostgreSQL; **moderate for auth** APIs/session integration. | **Moderate–high for auth UI/org workflows** plus operational coupling between two vendors; DB remains portable. | **High for identity workflows/configuration**; DB remains portable. | **Lowest auth SaaS lock-in**, but framework/library and adapter behavior still require migration work. |
| Operational burden | Low for a small team; one platform, one billing surface, one identity/data relationship. | Low auth burden, medium total burden from two services and user synchronization. | Low identity infrastructure burden, medium total configuration/monitoring burden. | Highest application responsibility for auth correctness, email delivery, abuse controls, upgrades, and incident response. |
| Small beta cost | Free plan supports initial exploration with project limits; paid plans combine fixed and usage costs. | Published free allowance is generous for retained users and includes a limited number of retained organizations; separate DB cost still applies. | Current free tier is generous for MAU and includes limited organizations; paid B2C/B2B feature jumps should be modeled before district rollout. | Library is open source; pay for Postgres/email/hosting and engineering time. |
| Future organizations | Requires custom organization/membership/workspace tables, which matches the proposed domain-owned model. | Strong built-in organization switching, invitations, roles, and permissions; membership can remain optional for personal accounts. | Mature organizations and enterprise identity, but availability/limits vary by plan. | Entire organization model is custom. |
| Future school/district fit | Good if custom domain rules and RLS are sufficient; enterprise SSO/SCIM may require another identity layer later. | Strong productized org experience; enterprise connection economics and district requirements need review. | Strongest established enterprise identity posture of these options; likely more than an individual beta needs. | Maximum control, maximum responsibility; district SSO becomes custom integration work. |

### Primary documentation reviewed

- [Supabase SSR auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase PostgreSQL RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase billing model](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Clerk Next.js SDK](https://clerk.com/docs/reference/nextjs/overview)
- [Clerk organizations](https://clerk.com/docs/guides/organizations/overview)
- [Clerk personal/organization configuration](https://clerk.com/docs/guides/organizations/configure)
- [Clerk pricing](https://clerk.com/pricing)
- [Auth0 Next.js SDK](https://auth0.github.io/nextjs-auth0/)
- [Auth0 organizations](https://auth0.com/docs/manage-users/organizations/create-first-organization)
- [Auth0 pricing](https://auth0.com/pricing)
- [Auth.js overview](https://authjs.dev/getting-started)

## Recommendation

**Choose Supabase Auth + Supabase Postgres for the first implementation, subject
to a short auth proof-of-concept before committing migrations.**

Why it remains the best fit after defining the contract:

1. Planner data is inherently relational: users own plans, plans have immutable
   revision graphs, and generation runs require transactional linkage.
2. One platform provides Google sign-in, email fallback, PostgreSQL, RLS, and a
   reproducible SQL migration workflow with less synchronization burden.
3. PostgreSQL keeps the actual planner data portable.
4. RLS maps directly to the V1 `owner_user_id` rule and can later evolve to
   workspace membership.
5. The small beta does not yet need a productized organization dashboard,
   enterprise SSO, or the second-vendor complexity of Clerk/Auth0 plus Postgres.

Conditions and caveats:

- Pin and test the SSR package because Supabase currently labels
  `@supabase/ssr` beta.
- Keep application IDs/provider subjects separated as described above.
- Use both a server-only DAL and tested RLS policies.
- Use Google sign-in plus email magic link/OTP fallback; do not build password
  storage.
- Store migration SQL in the repository; do not make untracked production
  schema changes through a dashboard.
- Before implementation, verify callback behavior on both `/planner` and the
  future `maps.markedminds.com` hostname.
- Reassess Clerk or Auth0 before implementation if district SAML/OIDC, SCIM,
  managed invitations, organization switching, or administrator roles become
  near-term launch requirements rather than future possibilities.

This is a design recommendation, not authorization to install or configure the
stack in Phase 1B.
