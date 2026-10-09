create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name varchar(80),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_valid check (
    display_name is null
    or (char_length(btrim(display_name)) between 1 and 80)
  ),
  constraint profiles_completion_requires_name check (
    not onboarding_completed
    or (display_name is not null and char_length(btrim(display_name)) > 0)
  )
);

create table public.teacher_profiles (
  user_id uuid primary key references public.profiles (user_id) on delete cascade,
  role text not null,
  subject_areas text[] not null,
  grade_levels text[] not null,
  typical_class_duration_minutes smallint not null,
  typical_class_size smallint,
  common_materials text[] not null default '{}',
  teaching_context_notes varchar(1000),
  plan_detail_preference text not null default 'balanced',
  transition_cleanup_preference text not null default 'standard',
  low_prep_preference text not null default 'neutral',
  movement_preference text not null default 'neutral',
  differentiation_preference text not null default 'when_relevant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_profiles_role_valid check (
    role in (
      'elementary_teacher',
      'middle_school_teacher',
      'high_school_teacher',
      'special_area',
      'intervention',
      'special_education',
      'other'
    )
  ),
  constraint teacher_profiles_subject_areas_count check (cardinality(subject_areas) between 1 and 5),
  constraint teacher_profiles_subject_areas_values check (
    subject_areas <@ array[
      'general_elementary',
      'math',
      'ela',
      'science',
      'social_studies',
      'visual_arts',
      'music',
      'pe',
      'stem',
      'other'
    ]::text[]
  ),
  constraint teacher_profiles_grade_levels_count check (cardinality(grade_levels) between 1 and 13),
  constraint teacher_profiles_grade_levels_values check (
    grade_levels <@ array['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']::text[]
  ),
  constraint teacher_profiles_duration_valid check (typical_class_duration_minutes between 10 and 240),
  constraint teacher_profiles_class_size_valid check (
    typical_class_size is null or typical_class_size between 1 and 100
  ),
  constraint teacher_profiles_materials_count check (cardinality(common_materials) between 0 and 20),
  constraint teacher_profiles_context_length check (
    teaching_context_notes is null or char_length(teaching_context_notes) <= 1000
  ),
  constraint teacher_profiles_plan_detail_valid check (
    plan_detail_preference in ('concise', 'balanced', 'detailed')
  ),
  constraint teacher_profiles_transition_cleanup_valid check (
    transition_cleanup_preference in ('standard', 'extra_attention')
  ),
  constraint teacher_profiles_low_prep_valid check (low_prep_preference in ('neutral', 'prefer')),
  constraint teacher_profiles_movement_valid check (movement_preference in ('neutral', 'encourage', 'limit')),
  constraint teacher_profiles_differentiation_valid check (
    differentiation_preference in ('when_relevant', 'always_surface_options', 'minimal')
  )
);

create function public.set_maps_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_maps_profile_updated_at();

create trigger teacher_profiles_set_updated_at
before update on public.teacher_profiles
for each row execute function public.set_maps_profile_updated_at();

alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.teacher_profiles from anon;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.teacher_profiles to authenticated;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "teacher_profiles_select_own"
on public.teacher_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "teacher_profiles_insert_own"
on public.teacher_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "teacher_profiles_update_own"
on public.teacher_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

comment on table public.profiles is 'MAPS account profile and onboarding completion state.';
comment on table public.teacher_profiles is 'Private MAPS teaching defaults owned by one authenticated user.';
comment on column public.teacher_profiles.teaching_context_notes is
  'General teaching context only; never student names, identifiers, diagnoses, medical data, or IEP/504 text.';
