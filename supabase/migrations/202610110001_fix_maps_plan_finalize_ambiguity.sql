create or replace function public.finalize_plan_tomorrow_generation(
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
    where generation_runs.id = finalize_plan_tomorrow_generation.run_id
      and generation_runs.requested_by_user_id = actor_id
      and generation_runs.status = 'running'
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
    finalize_plan_tomorrow_generation.plan_id,
    actor_id,
    actor_id,
    finalize_plan_tomorrow_generation.plan_title,
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
    finalize_plan_tomorrow_generation.revision_id,
    finalize_plan_tomorrow_generation.plan_id,
    1,
    null,
    actor_id,
    'initial_generation',
    generation_runs.input_schema_version,
    generation_runs.output_schema_version,
    finalize_plan_tomorrow_generation.input_snapshot,
    finalize_plan_tomorrow_generation.output_snapshot,
    finalize_plan_tomorrow_generation.run_id
  from public.generation_runs
  where generation_runs.id = finalize_plan_tomorrow_generation.run_id;

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
  where generation_runs.id = finalize_plan_tomorrow_generation.run_id
    and generation_runs.requested_by_user_id = actor_id;

  update public.plans
  set current_revision_id = finalize_plan_tomorrow_generation.revision_id
  where plans.id = finalize_plan_tomorrow_generation.plan_id
    and plans.owner_user_id = actor_id;

  return finalize_plan_tomorrow_generation.plan_id;
end;
$$;
