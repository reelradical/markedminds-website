create function public.get_maps_beta_insights()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with payload as (
    select public.get_maps_beta_insights(false) as value
  )
  select jsonb_set(
    payload.value - 'audience',
    '{users}',
    coalesce((
      select jsonb_agg(user_row - 'is_internal_test')
      from jsonb_array_elements(payload.value -> 'users') as user_row
    ), '[]'::jsonb),
    true
  )
  from payload;
$$;

revoke all on function public.get_maps_beta_insights() from public;
revoke all on function public.get_maps_beta_insights() from anon;
revoke all on function public.get_maps_beta_insights() from authenticated;
grant execute on function public.get_maps_beta_insights() to authenticated;

comment on function public.get_maps_beta_insights() is
  'Backward-compatible external-beta response for the previously deployed admin dashboard. Authorization remains enforced by the boolean aggregate RPC.';
