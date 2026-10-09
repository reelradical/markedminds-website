# MAPS — Phase 1D Profile Persistence

**Status:** Repository implementation complete; migration must be applied and
validated in each target Supabase project

Phase 1D adds only the authenticated teacher profile and onboarding state used
by MAPS. It does not add plans, generation runs, AI services, billing,
organizations, schools, rosters, or student records.

## Migration

The schema is defined by the committed migration:

```text
supabase/migrations/202610090001_maps_teacher_profiles.sql
```

Do not reproduce these changes manually in the Supabase dashboard. Every
environment should receive the same migration file.

### `public.profiles`

- `user_id uuid` — primary key and foreign key to `auth.users(id)` with cascade
  deletion
- `display_name varchar(80)` — nullable until onboarding is submitted
- `onboarding_completed boolean` — defaults to `false`
- `created_at` and `updated_at` — timezone-aware timestamps

The primary key supplies the only index needed for current lookups. Email is
not duplicated from Supabase Auth.

### `public.teacher_profiles`

- `user_id uuid` — primary key and foreign key to `public.profiles(user_id)`
  with cascade deletion
- typed text fields for role and stable preference concepts
- constrained text arrays for multiple subject areas and grade levels
- constrained numeric fields for typical duration and optional class size
- a text array for common materials
- optional `teaching_context_notes`, limited to 1,000 characters
- `created_at` and `updated_at` — timezone-aware timestamps

The `user_id` primary key enforces one teacher profile per account and supplies
the index needed by the current access pattern. No secondary index is created
because Phase 1D performs no cross-user filtering or profile search.

Both tables use triggers to update `updated_at` after a change. The settings
flow uses the two timestamps as an optimistic version token so a stale form is
rejected before it overwrites a newer edit.

## Row Level Security

RLS is enabled on both tables. Anonymous access is revoked. The authenticated
role receives only `select`, `insert`, and `update`; Phase 1D exposes no delete
operation.

Each operation has a separate policy. Every policy compares `auth.uid()` with
the row's `user_id`:

- `profiles_select_own`
- `profiles_insert_own`
- `profiles_update_own`
- `teacher_profiles_select_own`
- `teacher_profiles_insert_own`
- `teacher_profiles_update_own`

The insert and update policies include `with check` ownership enforcement, so
changing a request body or calling Supabase outside the MAPS UI cannot assign a
row to another authenticated user. The application also derives the current
user ID server-side and never accepts it from profile form data.

## Apply locally

The Supabase CLI is not installed as an application dependency. Use a current
CLI through your normal developer tooling.

If this repository has not yet been initialized for local Supabase development,
initialize it without replacing the migration, then start the local stack:

```bash
npx supabase init
npx supabase start
```

For a disposable local database, apply all migrations from a clean state:

```bash
npx supabase db reset
```

For an existing local database that should retain its data, apply pending
migrations:

```bash
npx supabase migration up
```

Run the application with the local project URL and publishable key in
`.env.local`. Never add a service-role key to a `NEXT_PUBLIC_` variable.

## Apply to a hosted Supabase project

Review the target project and pending migration before changing remote state:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration list
npx supabase db push --dry-run
```

After reviewing the dry run, apply the migration deliberately:

```bash
npx supabase db push
```

Use the same process for staging before production. Do not paste access tokens,
database passwords, service-role keys, or connection strings into chat, source
control, command output, or issue trackers.

## Verification after applying the migration

Use two ordinary authenticated test accounts and an unauthenticated browser:

1. Account A completes `/onboarding`, reaches `/planner`, and sees its saved
   display name.
2. Sign out and back in as Account A; `/planner` loads directly and
   `/settings/profile` contains the saved values.
3. Update Account A's settings, reload, and confirm the new values persist.
4. Account B can create and read only its own rows.
5. While authenticated as Account B, direct `select`, `update`, and `insert`
   attempts targeting Account A's `user_id` return no Account A data and make
   no changes.
6. With no authenticated session, both tables return no profile data and reject
   writes.

Inspect the table editor only for confirmation; do not weaken or disable RLS to
perform the test. Profile contents must not be copied into logs or analytics.

Official references:

- [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
