alter table public.generation_runs
  add column source_revision_id uuid;

alter table public.generation_runs
  add constraint generation_runs_source_requires_plan
  check (source_revision_id is null or plan_id is not null);

alter table public.generation_runs
  add constraint generation_runs_source_same_plan
  foreign key (plan_id, source_revision_id)
  references public.plan_revisions (plan_id, id)
  deferrable initially deferred;

create index generation_runs_source_revision_idx
on public.generation_runs (source_revision_id)
where source_revision_id is not null;

alter table public.plan_revisions
  drop constraint plan_revisions_source_valid;

alter table public.plan_revisions
  add constraint plan_revisions_source_valid
  check (source_kind in ('initial_generation', 'regeneration'));

alter table public.plan_revisions
  drop constraint plan_revisions_initial_parent;

alter table public.plan_revisions
  add constraint plan_revisions_parent_matches_source
  check (
    (
      revision_number = 1
      and parent_revision_id is null
      and source_kind = 'initial_generation'
    )
    or (
      revision_number > 1
      and parent_revision_id is not null
      and source_kind = 'regeneration'
    )
  );

create function public.finalize_guided_plan_revision(
  run_id uuid,
  plan_id uuid,
  source_revision_id uuid,
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
  next_revision_number integer;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  perform 1
  from public.plans
  where plans.id = finalize_guided_plan_revision.plan_id
    and plans.owner_user_id = actor_id
    and plans.status = 'active'
  for update;

  if not found then
    raise exception 'Plan is not available.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.plan_revisions
    where plan_revisions.id = finalize_guided_plan_revision.source_revision_id
      and plan_revisions.plan_id = finalize_guided_plan_revision.plan_id
  ) then
    raise exception 'Source revision is not available.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.generation_runs
    where generation_runs.id = finalize_guided_plan_revision.run_id
      and generation_runs.plan_id = finalize_guided_plan_revision.plan_id
      and generation_runs.source_revision_id = finalize_guided_plan_revision.source_revision_id
      and generation_runs.requested_by_user_id = actor_id
      and generation_runs.status = 'running'
  ) then
    raise exception 'Generation run is not available.' using errcode = '42501';
  end if;

  select coalesce(max(plan_revisions.revision_number), 0) + 1
  into next_revision_number
  from public.plan_revisions
  where plan_revisions.plan_id = finalize_guided_plan_revision.plan_id;

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
    finalize_guided_plan_revision.revision_id,
    finalize_guided_plan_revision.plan_id,
    next_revision_number,
    finalize_guided_plan_revision.source_revision_id,
    actor_id,
    'regeneration',
    generation_runs.input_schema_version,
    generation_runs.output_schema_version,
    finalize_guided_plan_revision.input_snapshot,
    finalize_guided_plan_revision.output_snapshot,
    finalize_guided_plan_revision.run_id
  from public.generation_runs
  where generation_runs.id = finalize_guided_plan_revision.run_id;

  update public.generation_runs
  set
    revision_id = finalize_guided_plan_revision.revision_id,
    provider_model_id = finalize_guided_plan_revision.provider_model_id,
    latency_ms = finalize_guided_plan_revision.latency_ms,
    input_tokens = finalize_guided_plan_revision.input_tokens,
    output_tokens = finalize_guided_plan_revision.output_tokens,
    total_tokens = finalize_guided_plan_revision.total_tokens,
    status = 'succeeded',
    finish_reason = 'completed',
    completed_at = now()
  where generation_runs.id = finalize_guided_plan_revision.run_id
    and generation_runs.requested_by_user_id = actor_id;

  update public.plans
  set
    title = finalize_guided_plan_revision.plan_title,
    current_revision_id = finalize_guided_plan_revision.revision_id
  where plans.id = finalize_guided_plan_revision.plan_id
    and plans.owner_user_id = actor_id;

  return finalize_guided_plan_revision.revision_id;
end;
$$;

revoke all on function public.finalize_guided_plan_revision(
  uuid, uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) from public;

grant execute on function public.finalize_guided_plan_revision(
  uuid, uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) to authenticated;

comment on function public.finalize_guided_plan_revision(
  uuid, uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) is 'Atomically appends an immutable owner-scoped MAPS guided revision and advances the current revision pointer.';
