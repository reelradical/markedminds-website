alter table public.plans
  add constraint plans_owner_id_unique unique (owner_user_id, id);

create table public.plan_revision_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  plan_id uuid not null,
  revision_id uuid not null,
  teach_tomorrow_response text not null,
  comment varchar(500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plan_revision_feedback_response_valid
    check (teach_tomorrow_response in ('yes', 'mostly', 'no')),
  constraint plan_revision_feedback_comment_valid
    check (comment is null or char_length(btrim(comment)) between 1 and 500),
  constraint plan_revision_feedback_owner_plan_revision_unique
    unique (owner_user_id, plan_id, revision_id),
  constraint plan_revision_feedback_owned_plan
    foreign key (owner_user_id, plan_id)
    references public.plans (owner_user_id, id)
    on delete cascade,
  constraint plan_revision_feedback_plan_revision
    foreign key (plan_id, revision_id)
    references public.plan_revisions (plan_id, id)
    on delete cascade
);

create trigger plan_revision_feedback_set_updated_at
before update on public.plan_revision_feedback
for each row execute function public.set_maps_plan_updated_at();

alter table public.plan_revision_feedback enable row level security;

revoke all on table public.plan_revision_feedback from anon;
grant select, insert, update on table public.plan_revision_feedback to authenticated;

create policy "plan_revision_feedback_select_own"
on public.plan_revision_feedback
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

create policy "plan_revision_feedback_insert_own"
on public.plan_revision_feedback
for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);

create policy "plan_revision_feedback_update_own"
on public.plan_revision_feedback
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

comment on table public.plan_revision_feedback is
  'Owner-scoped private-beta feedback for one immutable MAPS plan revision. Comments must not contain student information.';
