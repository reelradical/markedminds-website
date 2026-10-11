# MAPS — Phase 1E Plan Tomorrow Generation

**Status:** Repository implementation complete; migration and live provider
validation are required per environment

Phase 1E adds one vertical slice:

> Teacher request → structured Plan Tomorrow generation → atomic save → reopen

It does not add revisions beyond the initial generated version, quick actions,
Emergency Plan, Fix My Lesson, Differentiate, sharing, organizations, billing,
or classroom integrations.

## Dependencies

The provider boundary uses exact package versions:

```json
"openai": "7.31.0",
"zod": "4.6.5"
```

The OpenAI SDK is used only in server-only modules. The browser never calls a
model provider directly.

## Environment

Add the provider credential to `.env.local` for local development and to the
corresponding Vercel environment for deployments:

```bash
MARKEDMINDS_PLANNING_OPENAI_API_KEY=
```

Do not prefix it with `NEXT_PUBLIC_`. Do not paste the key into chat, source
control, logs, screenshots, or support messages. No service-role Supabase key
is required by the generation path.

If the variable is missing, MAPS creates safe failed-run metadata, creates no
plan or revision, and returns a configuration message to the teacher.

## Provider and model alias

- Provider: `openai`
- Internal alias: `planner-primary`
- Phase 1E provider model mapping: `gpt-5.4-mini`
- API: Responses API
- Provider storage request: `store: false`

Only the provider registry knows the provider/model mapping. UI, persistence,
and orchestration use the internal alias. Adding or switching providers must be
a separate reviewed change; callers must not import the OpenAI SDK directly.

The integration uses strict Structured Outputs through `responses.parse` and
`zodTextFormat`, followed by independent local validation. See the official
[OpenAI Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses)
and [text generation guide](https://developers.openai.com/api/docs/guides/text).

## Versioned contracts

- Input: `plan_tomorrow_input.v1`
- Output: `generated_plan_output.v1`
- Prompt: `plan_tomorrow_prompt.v2`
- Learning quality layer: `learning_quality.v1`

Prompt source lives in
`src/server/planning/prompts/plan-tomorrow-v2.ts`. It is assembled from distinct
sections for core planning rules, the versioned learning quality layer, profile
preferences, Plan Tomorrow behavior, the normalized request, constraints,
timing correction, and output rules. The quality contract and framework
influences are documented in `docs/PLANNER_LEARNING_QUALITY.md`. Rendered
prompts and provider payloads are never stored.

The immutable input snapshot contains normalized teacher input and provenance
for defaultable values using `user`, `profile`, or `system`. The immutable
output snapshot contains only the locally validated canonical lesson plan.

## Migration

Apply:

```text
supabase/migrations/202610090002_maps_plan_tomorrow.sql
supabase/migrations/202610110001_fix_maps_plan_finalize_ambiguity.sql
```

The migration creates:

- `plans` — stable owner-scoped plan containers
- `plan_revisions` — immutable versioned input/output snapshots
- `generation_runs` — safe operational attempt metadata
- `finalize_plan_tomorrow_generation(...)` — the short atomic finalize RPC

It also adds ownership and lookup indexes, same-plan composite foreign keys,
status/value checks, RLS policies, and explicit authenticated grants.

Preview and apply through the normal migration workflow:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Do not reproduce the schema manually in the dashboard.

## Generation flow

1. The Server Action re-verifies authentication and completed onboarding.
2. Input is normalized, schema-validated, and conservatively privacy-screened.
3. A pending `generation_runs` row is created and moved to `running`.
4. The provider is called outside a database transaction.
5. Structured output is normalized and locally validated.
6. Output receives the same conservative privacy screen.
7. Lesson-flow timing is compared with the requested duration using a
   one-minute tolerance.
8. One targeted provider retry is allowed only for invalid timing. It receives
   a separate run linked with `retry_of_run_id`.
9. One short RPC transaction creates the plan and immutable revision, links the
   successful run, and advances `current_revision_id`.
10. The teacher is redirected to the owner-scoped plan detail page.

Failures create no successful revision and no valid-looking plan. Failed runs
retain only allowlisted operational metadata and a safe error category.

## Privacy boundary

The form repeats the approved student-data warning beside classroom-context
fields. A conservative deterministic server screen runs before persistence and
before any provider request. It catches only some obvious patterns and must not
be described as comprehensive sensitive-data detection.

Never log or store in generation metadata:

- teacher request text
- student-needs text
- generated lesson content
- rendered prompts
- raw provider responses
- chain-of-thought or hidden reasoning
- cookies, auth tokens, or provider credentials

Safe metadata includes provider, model alias, resolved provider model,
version identifiers, status, latency, token totals, and safe error category.

Before beta, complete the provider-retention, data-processing, and legal review
required by `docs/PLANNER_PRIVACY_BOUNDARY.md`.

## Live verification

After applying the migration and configuring
`MARKEDMINDS_PLANNING_OPENAI_API_KEY`:

1. Sign in to a completed teacher account.
2. Open `/planner/plans/new/tomorrow`.
3. Generate one plan and confirm redirect to its detail page.
4. Open `/planner/plans` and reopen the plan.
5. Sign out and back in; confirm the plan remains available.
6. Use a second account to verify first-account plans, revisions, and runs are
   invisible and cannot be updated.
7. Verify anonymous table reads and writes are rejected.

Use aggregate assertions or synthetic content for database security tests. Do
not print profile inputs or generated plan snapshots into terminal output.
