create table public.plans (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  created_by_user_id uuid not null references public.profiles (user_id) on delete cascade,
  title varchar(160) not null,
  workflow_type text not null,
  status text not null default 'active',
  current_revision_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_owner_is_creator check (owner_user_id = created_by_user_id),
  constraint plans_title_valid check (char_length(btrim(title)) between 1 and 160),
  constraint plans_workflow_valid check (workflow_type = 'plan_tomorrow'),
  constraint plans_status_valid check (status in ('draft', 'active', 'archived'))
);

create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans (id) on delete cascade,
  revision_id uuid,
  requested_by_user_id uuid not null references public.profiles (user_id) on delete cascade,
  retry_of_run_id uuid,
  provider text not null,
  model_alias text not null,
  provider_model_id text,
  prompt_version text not null,
  input_schema_version text not null,
  output_schema_version text not null,
  status text not null default 'pending',
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  provider_usage jsonb,
  finish_reason text,
  safe_error_category text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint generation_runs_provider_valid check (char_length(btrim(provider)) between 1 and 80),
  constraint generation_runs_alias_valid check (char_length(btrim(model_alias)) between 1 and 80),
  constraint generation_runs_prompt_version_valid check (char_length(btrim(prompt_version)) between 1 and 120),
  constraint generation_runs_input_schema_valid check (char_length(btrim(input_schema_version)) between 1 and 120),
  constraint generation_runs_output_schema_valid check (char_length(btrim(output_schema_version)) between 1 and 120),
  constraint generation_runs_status_valid check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  constraint generation_runs_latency_valid check (latency_ms is null or latency_ms >= 0),
  constraint generation_runs_input_tokens_valid check (input_tokens is null or input_tokens >= 0),
  constraint generation_runs_output_tokens_valid check (output_tokens is null or output_tokens >= 0),
  constraint generation_runs_total_tokens_valid check (total_tokens is null or total_tokens >= 0),
  constraint generation_runs_error_category_valid check (
    safe_error_category is null
    or safe_error_category in (
      'missing_configuration',
      'rate_limited',
      'provider_unavailable',
      'provider_timeout',
      'content_policy_blocked',
      'structured_output_invalid',
      'duration_validation_failed',
      'privacy_output_blocked',
      'persistence_failed',
      'unknown_safe'
    )
  ),
  constraint generation_runs_terminal_state_valid check (
    (status in ('pending', 'running') and completed_at is null and safe_error_category is null)
    or (status = 'succeeded' and completed_at is not null and safe_error_category is null)
    or (status in ('failed', 'cancelled') and completed_at is not null and safe_error_category is not null)
  ),
  constraint generation_runs_revision_requires_plan check (revision_id is null or plan_id is not null),
  constraint generation_runs_not_own_retry check (retry_of_run_id is null or retry_of_run_id <> id),
  unique (plan_id, id),
  unique (requested_by_user_id, id)
);

alter table public.generation_runs
  add constraint generation_runs_retry_same_requester
  foreign key (requested_by_user_id, retry_of_run_id)
  references public.generation_runs (requested_by_user_id, id);

create table public.plan_revisions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  revision_number integer not null,
  parent_revision_id uuid,
  created_by_user_id uuid not null references public.profiles (user_id) on delete cascade,
  source_kind text not null,
  input_schema_version text not null,
  output_schema_version text not null,
  input_snapshot jsonb not null,
  output_snapshot jsonb not null,
  generation_run_id uuid not null unique,
  created_at timestamptz not null default now(),
  constraint plan_revisions_number_valid check (revision_number >= 1),
  constraint plan_revisions_source_valid check (source_kind = 'initial_generation'),
  constraint plan_revisions_input_schema_valid check (char_length(btrim(input_schema_version)) between 1 and 120),
  constraint plan_revisions_output_schema_valid check (char_length(btrim(output_schema_version)) between 1 and 120),
  constraint plan_revisions_input_object check (jsonb_typeof(input_snapshot) = 'object'),
  constraint plan_revisions_output_object check (jsonb_typeof(output_snapshot) = 'object'),
  constraint plan_revisions_initial_parent check (revision_number <> 1 or parent_revision_id is null),
  constraint plan_revisions_not_own_parent check (parent_revision_id is null or parent_revision_id <> id),
  unique (plan_id, revision_number),
  unique (plan_id, id)
);

alter table public.plan_revisions
  add constraint plan_revisions_parent_same_plan
  foreign key (plan_id, parent_revision_id)
  references public.plan_revisions (plan_id, id)
  deferrable initially deferred;

alter table public.plan_revisions
  add constraint plan_revisions_generation_run_same_plan
  foreign key (plan_id, generation_run_id)
  references public.generation_runs (plan_id, id)
  deferrable initially deferred;

alter table public.generation_runs
  add constraint generation_runs_revision_same_plan
  foreign key (plan_id, revision_id)
  references public.plan_revisions (plan_id, id)
  deferrable initially deferred;

alter table public.plans
  add constraint plans_current_revision_same_plan
  foreign key (id, current_revision_id)
  references public.plan_revisions (plan_id, id)
  deferrable initially deferred;

create index plans_owner_created_at_idx on public.plans (owner_user_id, created_at desc);
create index plan_revisions_plan_created_at_idx on public.plan_revisions (plan_id, created_at desc);
create index generation_runs_requester_created_at_idx on public.generation_runs (requested_by_user_id, created_at desc);

create function public.set_maps_plan_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_maps_plan_updated_at();

alter table public.plans enable row level security;
alter table public.plan_revisions enable row level security;
alter table public.generation_runs enable row level security;

revoke all on table public.plans from anon;
revoke all on table public.plan_revisions from anon;
revoke all on table public.generation_runs from anon;

grant select, insert, update on table public.plans to authenticated;
grant select, insert on table public.plan_revisions to authenticated;
grant select, insert, update on table public.generation_runs to authenticated;

create policy "plans_select_own"
on public.plans
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

create policy "plans_insert_own"
on public.plans
for insert
to authenticated
with check (
  (select auth.uid()) = owner_user_id
  and (select auth.uid()) = created_by_user_id
);

create policy "plans_update_own"
on public.plans
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check (
  (select auth.uid()) = owner_user_id
  and (select auth.uid()) = created_by_user_id
);

create policy "plan_revisions_select_through_plan"
on public.plan_revisions
for select
to authenticated
using (
  exists (
    select 1
    from public.plans
    where plans.id = plan_revisions.plan_id
      and plans.owner_user_id = (select auth.uid())
  )
);

create policy "plan_revisions_insert_through_plan"
on public.plan_revisions
for insert
to authenticated
with check (
  created_by_user_id = (select auth.uid())
  and exists (
    select 1
    from public.plans
    where plans.id = plan_revisions.plan_id
      and plans.owner_user_id = (select auth.uid())
  )
);

create policy "generation_runs_select_own"
on public.generation_runs
for select
to authenticated
using ((select auth.uid()) = requested_by_user_id);

create policy "generation_runs_insert_own"
on public.generation_runs
for insert
to authenticated
with check (
  (select auth.uid()) = requested_by_user_id
  and (
    plan_id is null
    or exists (
      select 1
      from public.plans
      where plans.id = generation_runs.plan_id
        and plans.owner_user_id = (select auth.uid())
    )
  )
);

create policy "generation_runs_update_own"
on public.generation_runs
for update
to authenticated
using ((select auth.uid()) = requested_by_user_id)
with check (
  (select auth.uid()) = requested_by_user_id
  and (
    plan_id is null
    or exists (
      select 1
      from public.plans
      where plans.id = generation_runs.plan_id
        and plans.owner_user_id = (select auth.uid())
    )
  )
);

create function public.finalize_plan_tomorrow_generation(
  run_id uuid,
  plan_id uuid,
  revision_id uuid,
  plan_title text,
  input_snapshot jsonb,
  output_snapshot jsonb,
  provider_model_id text,
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.generation_runs
    where id = run_id
      and requested_by_user_id = actor_id
      and status = 'running'
  ) then
    raise exception 'Generation run is not available.' using errcode = '42501';
  end if;

  insert into public.plans (
    id,
    owner_user_id,
    created_by_user_id,
    title,
    workflow_type,
    status
  ) values (
    plan_id,
    actor_id,
    actor_id,
    plan_title,
    'plan_tomorrow',
    'active'
  );

  insert into public.plan_revisions (
    id,
    plan_id,
    revision_number,
    parent_revision_id,
    created_by_user_id,
    source_kind,
    input_schema_version,
    output_schema_version,
    input_snapshot,
    output_snapshot,
    generation_run_id
  )
  select
    revision_id,
    plan_id,
    1,
    null,
    actor_id,
    'initial_generation',
    generation_runs.input_schema_version,
    generation_runs.output_schema_version,
    input_snapshot,
    output_snapshot,
    run_id
  from public.generation_runs
  where id = run_id;

  update public.generation_runs
  set
    plan_id = finalize_plan_tomorrow_generation.plan_id,
    revision_id = finalize_plan_tomorrow_generation.revision_id,
    provider_model_id = finalize_plan_tomorrow_generation.provider_model_id,
    latency_ms = finalize_plan_tomorrow_generation.latency_ms,
    input_tokens = finalize_plan_tomorrow_generation.input_tokens,
    output_tokens = finalize_plan_tomorrow_generation.output_tokens,
    total_tokens = finalize_plan_tomorrow_generation.total_tokens,
    status = 'succeeded',
    finish_reason = 'completed',
    completed_at = now()
  where id = run_id
    and requested_by_user_id = actor_id;

  update public.plans
  set current_revision_id = finalize_plan_tomorrow_generation.revision_id
  where id = finalize_plan_tomorrow_generation.plan_id
    and owner_user_id = actor_id;

  return plan_id;
end;
$$;

revoke all on function public.finalize_plan_tomorrow_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) from public;
grant execute on function public.finalize_plan_tomorrow_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) to authenticated;

comment on table public.plans is 'MAPS plan containers owned by one authenticated teacher.';
comment on table public.plan_revisions is 'Immutable, validated MAPS plan input and output snapshots.';
comment on table public.generation_runs is 'Safe operational metadata for MAPS generation attempts; never raw provider payloads or lesson content.';
