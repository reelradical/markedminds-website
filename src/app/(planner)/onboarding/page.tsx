import { redirect } from "next/navigation";

import { TeacherProfileForm } from "@/components/planner/teacher-profile-form";
import { defaultTeacherProfileInput, type TeacherProfileInput } from "@/lib/planner/profile-options";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { saveOnboardingProfile } from "@/server/actions/profile-actions";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  let user;

  try {
    user = await getAuthenticatedUser();
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) redirect("/login?error=configuration");
    redirect("/login");
  }

  if (!user) redirect("/login");

  let bundle;
  try {
    bundle = await getCurrentProfileBundle();
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <ProfileUnavailable />;
  }

  if (bundle.profile?.onboardingCompleted && bundle.teacherProfile) redirect("/planner");

  const authName = user.user_metadata.full_name;
  const displayName =
    bundle.profile?.displayName ?? (typeof authName === "string" && authName.trim() ? authName.trim() : "");
  const initialValues: TeacherProfileInput = bundle.teacherProfile
    ? { ...bundle.teacherProfile, displayName }
    : { ...defaultTeacherProfileInput, displayName };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mb-10 flex flex-col gap-6 border-b border-ink/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">MAPS setup</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Tell MAPS what you usually plan around.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">
            A few practical defaults now will make future planning faster. You can update everything later.
          </p>
        </div>
        <form action="/logout" method="post">
          <button type="submit" className="text-sm font-medium text-charcoal/60 hover:text-ink">Sign out</button>
        </form>
      </div>

      <TeacherProfileForm action={saveOnboardingProfile} initialValues={initialValues} submitLabel="Save and enter MAPS" />
    </div>
  );
}

function ProfileUnavailable() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Profile unavailable</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">MAPS could not load your profile setup.</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again. Your profile details were not displayed or logged.</p>
      </div>
    </div>
  );
}
