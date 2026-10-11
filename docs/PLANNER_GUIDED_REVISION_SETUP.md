# MAPS guided revision setup

**Phase:** 1F

**Last updated:** October 11, 2026

Phase 1F adds one teacher-directed revision behavior to an existing saved Plan
Tomorrow lesson. It does not add standalone quick actions, manual plan editing,
billing, sharing, organizations, or new planning modes.

## Migration

Apply the migrations through:

1. `202610090002_maps_plan_tomorrow.sql`
2. `202610110001_fix_maps_plan_finalize_ambiguity.sql`
3. `202610110002_maps_guided_revisions.sql`

The Phase 1F migration:

- adds `generation_runs.source_revision_id`
- permits `regeneration` revision sources
- requires later revisions to have an in-plan parent
- adds `finalize_guided_plan_revision(...)` for an atomic revision insert, run
  completion, title update, and current-pointer advance

Do not edit the original Phase 1E migrations in an environment where they have
already been applied.

## Runtime behavior

The saved-plan detail page lets a teacher choose one revision intent and add an
optional direction of at most 600 characters. The Server Action:

1. validates and privacy-screens the direction
2. authenticates the teacher and re-reads the selected owner-scoped revision
3. creates an owner-scoped generation run linked to that source revision
4. calls the provider through the server-only planning service
5. validates output privacy, structure, and duration, with at most one timing
   retry
6. atomically appends the immutable revision and advances the current pointer

The browser receives no API credentials, provider payloads, token counts, or
raw infrastructure errors.

## Live acceptance check

After applying the migration in the target Supabase project:

1. Sign in as test teacher A and open an existing saved plan.
2. Create one guided revision and confirm the new version becomes current.
3. Reopen revision 1 from history and confirm it is unchanged.
4. Create a revision while viewing revision 1 and confirm it branches without
   deleting the existing revision.
5. Sign out and back in; reopen every version and confirm persistence.
6. Sign in as test teacher B and verify teacher A's plan and revision IDs cannot
   be read, used as a revision source, or modified.
7. Submit a privacy-blocked direction and confirm no run or revision containing
   that text is saved.
8. Exercise a provider failure and confirm the current revision remains
   unchanged.

Private-beta invitations should wait until this migration and live acceptance
check pass in the production project.
