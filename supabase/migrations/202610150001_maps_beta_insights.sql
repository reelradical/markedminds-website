create table public.maps_beta_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.maps_beta_admins enable row level security;

revoke all on table public.maps_beta_admins from public;
revoke all on table public.maps_beta_admins from anon;
revoke all on table public.maps_beta_admins from authenticated;

comment on table public.maps_beta_admins is
  'UUID-only allowlist for the internal MAPS private-beta dashboard. Seed manually through the Supabase SQL Editor; never store email or other PII here.';

create function public.get_maps_beta_insights()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  result jsonb;
begin
  if actor_id is null or not exists (
    select 1
    from public.maps_beta_admins
    where maps_beta_admins.user_id = actor_id
  ) then
    raise exception 'Not authorized.' using errcode = '42501';
  end if;

  with beta_users as materialized (
    select
      profiles.user_id,
      profiles.display_name
    from public.profiles
    where profiles.onboarding_completed = true
  ),
  saved_plans as materialized (
    select
      plans.id,
      plans.owner_user_id,
      plans.created_at
    from public.plans
    join beta_users on beta_users.user_id = plans.owner_user_id
    where plans.status in ('active', 'archived')
  ),
  plan_versions as materialized (
    select
      plan_revisions.id,
      plan_revisions.plan_id,
      plan_revisions.created_by_user_id as user_id,
      plan_revisions.revision_number,
      plan_revisions.source_kind,
      case
        when plan_revisions.revision_number = 1 then 'original'
        else 'revised'
      end as version_type,
      case
        when plan_revisions.source_kind = 'regeneration'
          then plan_revisions.input_snapshot #>> '{revision_request,intent}'
        else null
      end as revision_intent,
      plan_revisions.created_at
    from public.plan_revisions
    join saved_plans on saved_plans.id = plan_revisions.plan_id
  ),
  guided_revisions as materialized (
    select *
    from plan_versions
    where source_kind = 'regeneration'
      and revision_number > 1
  ),
  feedback_rows as materialized (
    select
      plan_revision_feedback.owner_user_id as user_id,
      plan_revision_feedback.plan_id,
      plan_revision_feedback.revision_id,
      plan_revision_feedback.teach_tomorrow_response as response,
      plan_revision_feedback.created_at,
      plan_revision_feedback.updated_at,
      plan_versions.version_type,
      plan_versions.revision_intent
    from public.plan_revision_feedback
    join plan_versions
      on plan_versions.id = plan_revision_feedback.revision_id
      and plan_versions.plan_id = plan_revision_feedback.plan_id
    join beta_users
      on beta_users.user_id = plan_revision_feedback.owner_user_id
  ),
  successful_runs as materialized (
    select
      generation_runs.requested_by_user_id as user_id,
      case
        when generation_runs.source_revision_id is null then 'initial_generation'
        else 'guided_revision'
      end as run_type,
      coalesce(generation_runs.provider_model_id, generation_runs.model_alias) as model_id,
      generation_runs.latency_ms,
      generation_runs.input_tokens,
      generation_runs.output_tokens,
      generation_runs.total_tokens
    from public.generation_runs
    join beta_users
      on beta_users.user_id = generation_runs.requested_by_user_id
    where generation_runs.status = 'succeeded'
  ),
  activity_events as materialized (
    select
      saved_plans.owner_user_id as user_id,
      saved_plans.created_at as activity_at
    from saved_plans

    union all

    select
      guided_revisions.user_id,
      guided_revisions.created_at
    from guided_revisions

    union all

    select
      feedback_rows.user_id,
      feedback_rows.created_at
    from feedback_rows

    union all

    select
      feedback_rows.user_id,
      feedback_rows.updated_at
    from feedback_rows
    where (feedback_rows.updated_at at time zone 'UTC')::date
      <> (feedback_rows.created_at at time zone 'UTC')::date
  ),
  activity_days as materialized (
    select distinct
      activity_events.user_id,
      (activity_events.activity_at at time zone 'UTC')::date as activity_date
    from activity_events
  ),
  active_user_rollup as materialized (
    select
      activity_events.user_id,
      min(activity_events.activity_at) as first_activity,
      max(activity_events.activity_at) as last_activity,
      count(distinct (activity_events.activity_at at time zone 'UTC')::date)::integer as active_day_count
    from activity_events
    group by activity_events.user_id
  ),
  date_bounds as (
    select min(activity_days.activity_date) as first_activity_date
    from activity_days
  ),
  usage_dates as materialized (
    select generate_series(
      coalesce(
        (select date_bounds.first_activity_date from date_bounds),
        (current_timestamp at time zone 'UTC')::date
      )::timestamp,
      (current_timestamp at time zone 'UTC')::date::timestamp,
      interval '1 day'
    )::date as activity_date
  ),
  daily_active as (
    select
      activity_days.activity_date,
      count(*)::integer as active_users
    from activity_days
    group by activity_days.activity_date
  ),
  daily_plans as (
    select
      (saved_plans.created_at at time zone 'UTC')::date as activity_date,
      count(*)::integer as plans_created
    from saved_plans
    group by (saved_plans.created_at at time zone 'UTC')::date
  ),
  daily_revisions as (
    select
      (guided_revisions.created_at at time zone 'UTC')::date as activity_date,
      count(*)::integer as revisions_created
    from guided_revisions
    group by (guided_revisions.created_at at time zone 'UTC')::date
  ),
  daily_feedback as (
    select
      (feedback_rows.created_at at time zone 'UTC')::date as activity_date,
      count(*)::integer as feedback_submitted
    from feedback_rows
    group by (feedback_rows.created_at at time zone 'UTC')::date
  ),
  feedback_totals as materialized (
    select
      count(*)::integer as total,
      count(*) filter (where feedback_rows.response = 'yes')::integer as yes_count,
      count(*) filter (where feedback_rows.response = 'mostly')::integer as mostly_count,
      count(*) filter (where feedback_rows.response = 'no')::integer as no_count
    from feedback_rows
  ),
  run_types as (
    select *
    from (values
      ('initial_generation'::text, 1),
      ('guided_revision'::text, 2)
    ) as values_table(run_type, sort_order)
  ),
  generation_rollup as materialized (
    select
      run_types.run_type,
      run_types.sort_order,
      count(successful_runs.run_type)::integer as successful_runs,
      count(successful_runs.total_tokens)::integer as metered_runs,
      round(avg(successful_runs.latency_ms))::integer as average_latency_ms,
      round(percentile_cont(0.5) within group (order by successful_runs.latency_ms))::integer as median_latency_ms,
      round(avg(successful_runs.input_tokens))::integer as average_input_tokens,
      round(avg(successful_runs.output_tokens))::integer as average_output_tokens,
      round(avg(successful_runs.total_tokens))::integer as average_total_tokens,
      coalesce(sum(successful_runs.input_tokens), 0)::bigint as total_input_tokens,
      coalesce(sum(successful_runs.output_tokens), 0)::bigint as total_output_tokens
    from run_types
    left join successful_runs on successful_runs.run_type = run_types.run_type
    group by run_types.run_type, run_types.sort_order
  ),
  model_token_rollup as materialized (
    select
      successful_runs.run_type,
      successful_runs.model_id,
      count(*)::integer as successful_runs,
      count(successful_runs.total_tokens)::integer as metered_runs,
      coalesce(sum(successful_runs.input_tokens), 0)::bigint as total_input_tokens,
      coalesce(sum(successful_runs.output_tokens), 0)::bigint as total_output_tokens
    from successful_runs
    group by successful_runs.run_type, successful_runs.model_id
  )
  select jsonb_build_object(
    'generated_at', current_timestamp,
    'summary', jsonb_build_object(
      'total_beta_users', (select count(*) from beta_users),
      'users_with_saved_plan', (select count(distinct saved_plans.owner_user_id) from saved_plans),
      'returning_users', (
        select count(*)
        from active_user_rollup
        where active_user_rollup.active_day_count >= 2
      ),
      'users_active_last_7_days', (
        select count(distinct activity_days.user_id)
        from activity_days
        where activity_days.activity_date
          >= (current_timestamp at time zone 'UTC')::date - 6
      ),
      'total_saved_plans', (select count(*) from saved_plans),
      'total_revisions', (select count(*) from guided_revisions),
      'plans_per_active_user', coalesce((
        select round(
          (select count(*) from saved_plans)::numeric
          / nullif((select count(*) from active_user_rollup), 0),
          2
        )
      ), 0),
      'revision_rate_percent', coalesce((
        select round(
          100.0 * count(distinct guided_revisions.plan_id)
          / nullif((select count(*) from saved_plans), 0),
          1
        )
        from guided_revisions
      ), 0),
      'total_feedback_submissions', (select feedback_totals.total from feedback_totals),
      'feedback_response_rate_percent', coalesce((
        select round(
          100.0 * feedback_totals.total
          / nullif((select count(*) from plan_versions), 0),
          1
        )
        from feedback_totals
      ), 0),
      'teachability_rate_percent', coalesce((
        select round(
          100.0 * feedback_totals.yes_count
          / nullif(feedback_totals.total, 0),
          1
        )
        from feedback_totals
      ), 0),
      'yes_or_mostly_rate_percent', coalesce((
        select round(
          100.0 * (feedback_totals.yes_count + feedback_totals.mostly_count)
          / nullif(feedback_totals.total, 0),
          1
        )
        from feedback_totals
      ), 0)
    ),
    'feedback', jsonb_build_object(
      'totals', (
        select jsonb_build_object(
          'total', feedback_totals.total,
          'yes', feedback_totals.yes_count,
          'mostly', feedback_totals.mostly_count,
          'no', feedback_totals.no_count,
          'yes_percent', coalesce(round(100.0 * feedback_totals.yes_count / nullif(feedback_totals.total, 0), 1), 0),
          'mostly_percent', coalesce(round(100.0 * feedback_totals.mostly_count / nullif(feedback_totals.total, 0), 1), 0),
          'no_percent', coalesce(round(100.0 * feedback_totals.no_count / nullif(feedback_totals.total, 0), 1), 0)
        )
        from feedback_totals
      ),
      'by_version_type', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'version_type', version_types.version_type,
          'feedback_count', version_types.feedback_count,
          'yes', version_types.yes_count,
          'mostly', version_types.mostly_count,
          'no', version_types.no_count
        ) order by version_types.sort_order), '[]'::jsonb)
        from (
          select
            available_types.version_type,
            available_types.sort_order,
            count(feedback_rows.revision_id)::integer as feedback_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'yes')::integer as yes_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'mostly')::integer as mostly_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'no')::integer as no_count
          from (values
            ('original'::text, 1),
            ('revised'::text, 2)
          ) as available_types(version_type, sort_order)
          left join feedback_rows
            on feedback_rows.version_type = available_types.version_type
          group by available_types.version_type, available_types.sort_order
        ) as version_types
      ),
      'by_revision_intent', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'revision_intent', intent_totals.revision_intent,
          'feedback_count', intent_totals.feedback_count,
          'yes', intent_totals.yes_count,
          'mostly', intent_totals.mostly_count,
          'no', intent_totals.no_count
        ) order by intent_totals.sort_order), '[]'::jsonb)
        from (
          select
            available_intents.revision_intent,
            available_intents.sort_order,
            count(feedback_rows.revision_id)::integer as feedback_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'yes')::integer as yes_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'mostly')::integer as mostly_count,
            count(feedback_rows.revision_id) filter (where feedback_rows.response = 'no')::integer as no_count
          from (values
            ('fit_learners'::text, 1),
            ('improve_pacing'::text, 2),
            ('reduce_prep'::text, 3),
            ('strengthen_evidence'::text, 4),
            ('increase_agency'::text, 5)
          ) as available_intents(revision_intent, sort_order)
          left join feedback_rows
            on feedback_rows.version_type = 'revised'
            and feedback_rows.revision_intent = available_intents.revision_intent
          group by available_intents.revision_intent, available_intents.sort_order
        ) as intent_totals
      )
    ),
    'generation', jsonb_build_object(
      'by_run_type', (
        select jsonb_agg(jsonb_build_object(
          'run_type', generation_rollup.run_type,
          'successful_runs', generation_rollup.successful_runs,
          'metered_runs', generation_rollup.metered_runs,
          'average_latency_ms', generation_rollup.average_latency_ms,
          'median_latency_ms', generation_rollup.median_latency_ms,
          'average_input_tokens', generation_rollup.average_input_tokens,
          'average_output_tokens', generation_rollup.average_output_tokens,
          'average_total_tokens', generation_rollup.average_total_tokens,
          'total_input_tokens', generation_rollup.total_input_tokens,
          'total_output_tokens', generation_rollup.total_output_tokens
        ) order by generation_rollup.sort_order)
        from generation_rollup
      ),
      'token_usage_by_model', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'run_type', model_token_rollup.run_type,
          'model_id', model_token_rollup.model_id,
          'successful_runs', model_token_rollup.successful_runs,
          'metered_runs', model_token_rollup.metered_runs,
          'total_input_tokens', model_token_rollup.total_input_tokens,
          'total_output_tokens', model_token_rollup.total_output_tokens
        ) order by model_token_rollup.run_type, model_token_rollup.model_id), '[]'::jsonb)
        from model_token_rollup
      )
    ),
    'daily_usage', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'date', usage_dates.activity_date,
        'active_users', coalesce(daily_active.active_users, 0),
        'plans_created', coalesce(daily_plans.plans_created, 0),
        'revisions_created', coalesce(daily_revisions.revisions_created, 0),
        'feedback_submitted', coalesce(daily_feedback.feedback_submitted, 0)
      ) order by usage_dates.activity_date), '[]'::jsonb)
      from usage_dates
      left join daily_active using (activity_date)
      left join daily_plans using (activity_date)
      left join daily_revisions using (activity_date)
      left join daily_feedback using (activity_date)
    ),
    'users', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'beta_id', user_totals.beta_id,
        'display_name', user_totals.display_name,
        'first_activity', user_totals.first_activity,
        'last_activity', user_totals.last_activity,
        'plans_created', user_totals.plans_created,
        'revisions_created', user_totals.revisions_created,
        'feedback_submitted', user_totals.feedback_submitted,
        'active_day_count', user_totals.active_day_count
      ) order by user_totals.last_activity desc nulls last, user_totals.beta_id), '[]'::jsonb)
      from (
        select
          upper(substr(md5(beta_users.user_id::text), 1, 10)) as beta_id,
          beta_users.display_name,
          active_user_rollup.first_activity,
          active_user_rollup.last_activity,
          (select count(*) from saved_plans where saved_plans.owner_user_id = beta_users.user_id)::integer as plans_created,
          (select count(*) from guided_revisions where guided_revisions.user_id = beta_users.user_id)::integer as revisions_created,
          (select count(*) from feedback_rows where feedback_rows.user_id = beta_users.user_id)::integer as feedback_submitted,
          coalesce(active_user_rollup.active_day_count, 0)::integer as active_day_count
        from beta_users
        left join active_user_rollup on active_user_rollup.user_id = beta_users.user_id
      ) as user_totals
    )
  )
  into result;

  return result;
end;
$$;

revoke all on function public.get_maps_beta_insights() from public;
revoke all on function public.get_maps_beta_insights() from anon;
revoke all on function public.get_maps_beta_insights() from authenticated;
grant execute on function public.get_maps_beta_insights() to authenticated;

comment on function public.get_maps_beta_insights() is
  'Admin-allowlisted MAPS private-beta aggregates and privacy-safe user summaries. Returns no lesson content, student-needs text, teacher notes, feedback comments, email addresses, or raw user UUIDs.';
