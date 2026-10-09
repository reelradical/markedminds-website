import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { TeacherProfileInput } from "@/lib/planner/profile-options";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileRecord = {
  userId: string;
  displayName: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeacherProfileRecord = Omit<TeacherProfileInput, "displayName"> & {
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CurrentProfileBundle = {
  profile: ProfileRecord | null;
  teacherProfile: TeacherProfileRecord | null;
};

export type ProfileDataErrorCode = "unauthenticated" | "unavailable" | "conflict" | "incomplete";

export class ProfileDataError extends Error {
  constructor(public readonly code: ProfileDataErrorCode) {
    super("MAPS could not complete the profile request.");
    this.name = "ProfileDataError";
  }
}

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

type TeacherProfileRow = {
  user_id: string;
  role: TeacherProfileInput["role"];
  subject_areas: TeacherProfileInput["subjectAreas"];
  grade_levels: TeacherProfileInput["gradeLevels"];
  typical_class_duration_minutes: number;
  typical_class_size: number | null;
  common_materials: string[];
  teaching_context_notes: string | null;
  plan_detail_preference: TeacherProfileInput["planDetailPreference"];
  transition_cleanup_preference: TeacherProfileInput["transitionCleanupPreference"];
  low_prep_preference: TeacherProfileInput["lowPrepPreference"];
  movement_preference: TeacherProfileInput["movementPreference"];
  differentiation_preference: TeacherProfileInput["differentiationPreference"];
  created_at: string;
  updated_at: string;
};

type AuthenticatedContext = {
  supabase: SupabaseClient;
  user: User;
};

const profileColumns = "user_id, display_name, onboarding_completed, created_at, updated_at";
const teacherProfileColumns =
  "user_id, role, subject_areas, grade_levels, typical_class_duration_minutes, typical_class_size, common_materials, teaching_context_notes, plan_detail_preference, transition_cleanup_preference, low_prep_preference, movement_preference, differentiation_preference, created_at, updated_at";

async function requireAuthenticatedContext(): Promise<AuthenticatedContext> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) throw new ProfileDataError("unauthenticated");
  return { supabase, user: data.user };
}

function mapProfile(row: ProfileRow): ProfileRecord {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTeacherProfile(row: TeacherProfileRow): TeacherProfileRecord {
  return {
    userId: row.user_id,
    role: row.role,
    subjectAreas: row.subject_areas,
    gradeLevels: row.grade_levels,
    typicalClassDurationMinutes: row.typical_class_duration_minutes,
    typicalClassSize: row.typical_class_size,
    commonMaterials: row.common_materials,
    teachingContextNotes: row.teaching_context_notes,
    planDetailPreference: row.plan_detail_preference,
    transitionCleanupPreference: row.transition_cleanup_preference,
    lowPrepPreference: row.low_prep_preference,
    movementPreference: row.movement_preference,
    differentiationPreference: row.differentiation_preference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function teacherProfilePayload(userId: string, input: TeacherProfileInput) {
  return {
    user_id: userId,
    role: input.role,
    subject_areas: input.subjectAreas,
    grade_levels: input.gradeLevels,
    typical_class_duration_minutes: input.typicalClassDurationMinutes,
    typical_class_size: input.typicalClassSize,
    common_materials: input.commonMaterials,
    teaching_context_notes: input.teachingContextNotes,
    plan_detail_preference: input.planDetailPreference,
    transition_cleanup_preference: input.transitionCleanupPreference,
    low_prep_preference: input.lowPrepPreference,
    movement_preference: input.movementPreference,
    differentiation_preference: input.differentiationPreference,
  };
}

async function readProfile(context: AuthenticatedContext) {
  const { data, error } = await context.supabase
    .from("profiles")
    .select(profileColumns)
    .eq("user_id", context.user.id)
    .maybeSingle();

  if (error) throw new ProfileDataError("unavailable");
  return data ? mapProfile(data as ProfileRow) : null;
}

async function readTeacherProfile(context: AuthenticatedContext) {
  const { data, error } = await context.supabase
    .from("teacher_profiles")
    .select(teacherProfileColumns)
    .eq("user_id", context.user.id)
    .maybeSingle();

  if (error) throw new ProfileDataError("unavailable");
  return data ? mapTeacherProfile(data as TeacherProfileRow) : null;
}

async function readBundle(context: AuthenticatedContext): Promise<CurrentProfileBundle> {
  const [profile, teacherProfile] = await Promise.all([readProfile(context), readTeacherProfile(context)]);
  return { profile, teacherProfile };
}

export async function getCurrentProfile() {
  return readProfile(await requireAuthenticatedContext());
}

export async function createProfile(displayName: string) {
  const context = await requireAuthenticatedContext();
  const { data, error } = await context.supabase
    .from("profiles")
    .insert({ user_id: context.user.id, display_name: displayName, onboarding_completed: false })
    .select(profileColumns)
    .single();

  if (error || !data) throw new ProfileDataError("unavailable");
  return mapProfile(data as ProfileRow);
}

export async function updateProfile(displayName: string, onboardingCompleted: boolean) {
  const context = await requireAuthenticatedContext();
  const { data, error } = await context.supabase
    .from("profiles")
    .update({ display_name: displayName, onboarding_completed: onboardingCompleted })
    .eq("user_id", context.user.id)
    .select(profileColumns)
    .single();

  if (error || !data) throw new ProfileDataError("unavailable");
  return mapProfile(data as ProfileRow);
}

export async function getTeacherProfile() {
  return readTeacherProfile(await requireAuthenticatedContext());
}

export async function upsertTeacherProfile(input: TeacherProfileInput) {
  const context = await requireAuthenticatedContext();
  const { data, error } = await context.supabase
    .from("teacher_profiles")
    .upsert(teacherProfilePayload(context.user.id, input), { onConflict: "user_id" })
    .select(teacherProfileColumns)
    .single();

  if (error || !data) throw new ProfileDataError("unavailable");
  return mapTeacherProfile(data as TeacherProfileRow);
}

export async function getCurrentProfileBundle() {
  return readBundle(await requireAuthenticatedContext());
}

export async function checkOnboardingCompletion() {
  const { profile, teacherProfile } = await getCurrentProfileBundle();
  return Boolean(profile?.onboardingCompleted && teacherProfile);
}

export function getProfileVersion(bundle: CurrentProfileBundle) {
  if (!bundle.profile || !bundle.teacherProfile) return "";
  return `${bundle.profile.updatedAt}|${bundle.teacherProfile.updatedAt}`;
}

export async function completeOnboarding(input: TeacherProfileInput) {
  const context = await requireAuthenticatedContext();
  const { error: profileError } = await context.supabase.from("profiles").upsert(
    {
      user_id: context.user.id,
      display_name: input.displayName,
      onboarding_completed: false,
    },
    { onConflict: "user_id" },
  );

  if (profileError) throw new ProfileDataError("unavailable");

  const { error: teacherError } = await context.supabase
    .from("teacher_profiles")
    .upsert(teacherProfilePayload(context.user.id, input), { onConflict: "user_id" });

  if (teacherError) throw new ProfileDataError("unavailable");

  const { error: completionError } = await context.supabase
    .from("profiles")
    .update({ display_name: input.displayName, onboarding_completed: true })
    .eq("user_id", context.user.id);

  if (completionError) throw new ProfileDataError("unavailable");
}

export async function updateCurrentTeacherProfile(input: TeacherProfileInput, expectedVersion: string) {
  const context = await requireAuthenticatedContext();
  const bundle = await readBundle(context);

  if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) {
    throw new ProfileDataError("incomplete");
  }
  if (!expectedVersion || getProfileVersion(bundle) !== expectedVersion) {
    throw new ProfileDataError("conflict");
  }

  const { error: teacherError } = await context.supabase
    .from("teacher_profiles")
    .update(teacherProfilePayload(context.user.id, input))
    .eq("user_id", context.user.id);

  if (teacherError) throw new ProfileDataError("unavailable");

  const { error: profileError } = await context.supabase
    .from("profiles")
    .update({ display_name: input.displayName })
    .eq("user_id", context.user.id);

  if (profileError) throw new ProfileDataError("unavailable");
}
