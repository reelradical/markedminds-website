alter table public.profiles
  add column planning_context text not null default 'school_classroom';

alter table public.profiles
  add constraint profiles_planning_context_valid
  check (planning_context in ('school_classroom', 'adult_creator'));

comment on column public.profiles.planning_context is
  'The MAPS planning context selected for onboarding and workspace defaults. This does not change plan ownership or access.';

alter table public.plans
  drop constraint plans_workflow_valid;

alter table public.plans
  add constraint plans_workflow_valid
  check (workflow_type in ('plan_tomorrow', 'rotation_plan_template', 'creator_lesson'));

create function public.finalize_creator_lesson_generation(
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
    where generation_runs.id = finalize_creator_lesson_generation.run_id
      and generation_runs.requested_by_user_id = actor_id
      and generation_runs.status = 'running'
      and generation_runs.plan_id is null
      and generation_runs.revision_id is null
      and generation_runs.source_revision_id is null
      and generation_runs.prompt_version = 'creator_lesson_prompt.v1'
      and generation_runs.input_schema_version = 'creator_lesson_input.v1'
      and generation_runs.output_schema_version = 'creator_lesson_output.v1'
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
    finalize_creator_lesson_generation.plan_id,
    actor_id,
    actor_id,
    finalize_creator_lesson_generation.plan_title,
    'creator_lesson',
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
    finalize_creator_lesson_generation.revision_id,
    finalize_creator_lesson_generation.plan_id,
    1,
    null,
    actor_id,
    'initial_generation',
    generation_runs.input_schema_version,
    generation_runs.output_schema_version,
    finalize_creator_lesson_generation.input_snapshot,
    finalize_creator_lesson_generation.output_snapshot,
    finalize_creator_lesson_generation.run_id
  from public.generation_runs
  where generation_runs.id = finalize_creator_lesson_generation.run_id
    and generation_runs.requested_by_user_id = actor_id
    and generation_runs.status = 'running';

  update public.generation_runs
  set
    plan_id = finalize_creator_lesson_generation.plan_id,
    revision_id = finalize_creator_lesson_generation.revision_id,
    provider_model_id = finalize_creator_lesson_generation.provider_model_id,
    latency_ms = finalize_creator_lesson_generation.latency_ms,
    input_tokens = finalize_creator_lesson_generation.input_tokens,
    output_tokens = finalize_creator_lesson_generation.output_tokens,
    total_tokens = finalize_creator_lesson_generation.total_tokens,
    status = 'succeeded',
    finish_reason = 'completed',
    completed_at = now()
  where generation_runs.id = finalize_creator_lesson_generation.run_id
    and generation_runs.requested_by_user_id = actor_id
    and generation_runs.status = 'running';

  update public.plans
  set current_revision_id = finalize_creator_lesson_generation.revision_id
  where plans.id = finalize_creator_lesson_generation.plan_id
    and plans.owner_user_id = actor_id;

  return finalize_creator_lesson_generation.plan_id;
end;
$$;

revoke all on function public.finalize_creator_lesson_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) from public;

grant execute on function public.finalize_creator_lesson_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) to authenticated;

comment on function public.finalize_creator_lesson_generation(
  uuid, uuid, uuid, text, jsonb, jsonb, text, integer, integer, integer, integer
) is 'Atomically persists an owner-scoped MAPS adult/creator lesson using the existing plans and immutable revisions model.';
