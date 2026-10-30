alter table public.plans
  drop constraint plans_workflow_valid;

alter table public.plans
  add constraint plans_workflow_valid
  check (workflow_type in ('plan_tomorrow', 'rotation_plan_template'));

create function public.finalize_rotation_plan_generation(
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
    where generation_runs.id = finalize_rotation_plan_generation.run_id
      and generation_runs.requested_by_user_id = actor_id
      and generation_runs.status = 'running'
      and generation_runs.plan_id is null
      and generation_runs.revision_id is null
      and generation_runs.input_schema_version = 'rotation_plan_input.v1'
      and generation_runs.output_schema_version = 'rotation_plan_output.v1'
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
    finalize_rotation_plan_generation.plan_id,
    actor_id,
    actor_id,
    finalize_rotation_plan_generation.plan_title,
    'rotation_plan_template',
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
    finalize_rotation_plan_generation.revision_id,
    finalize_rotation_plan_generation.plan_id,
    1,
    null,
    actor_id,
    'initial_generation',
    generation_runs.input_schema_version,
    generation_runs.output_schema_version,
    finalize_rotation_plan_generation.input_snapshot,
    finalize_rotation_plan_generation.output_snapshot,
    finalize_rotation_plan_generation.run_id
  from public.generation_runs
  where generation_runs.id = finalize_rotation_plan_generation.run_id
    and generation_runs.requested_by_user_id = actor_id
    and generation_runs.status = 'running';

  update public.generation_runs
  set
    plan_id = finalize_rotation_plan_generation.plan_id,
    revision_id = finalize_rotation_plan_generation.revision_id,
    provider_model_id = finalize_rotation_plan_generation.provider_model_id,
    latency_ms = finalize_rotation_plan_generation.latency_ms,
    input_tokens = finalize_rotation_plan_generation.input_tokens,
    output_tokens = finalize_rotation_plan_generation.output_tokens,
    total_tokens = finalize_rotation_plan_generation.total_tokens,
    status = 'succeeded',
    finish_reason = 'completed',
    completed_at = now()
  where generation_runs.id = finalize_rotation_plan_generation.run_id
    and generation_runs.requested_by_user_id = actor_id
    and generation_runs.status = 'running';

  update public.plans
  set current_revision_id = finalize_rotation_plan_generation.revision_id
  where plans.id = finalize_rotation_plan_generation.plan_id
    and plans.owner_user_id = actor_id;

  return finalize_rotation_plan_generation.plan_id;
end;
$$;

revoke all on function public.finalize_rotation_plan_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) from public;

grant execute on function public.finalize_rotation_plan_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) to authenticated;

comment on function public.finalize_rotation_plan_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) is 'Atomically persists an owner-scoped MAPS rotation-plan generation using the existing plans and immutable revisions model.';
