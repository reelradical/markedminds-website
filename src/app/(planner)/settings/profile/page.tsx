import Link from "next/link";
import { redirect } from "next/navigation";

import { TeacherProfileForm } from "@/components/planner/teacher-profile-form";
import type { TeacherProfileInput } from "@/lib/planner/profile-options";
import { saveProfileSettings } from "@/server/actions/profile-actions";
import { getCurrentProfileBundle, getProfileVersion, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";

type ProfileSettingsPageProps = {
  searchParams: Promise<{ saved?: string | string[] }>;
};

export default async function ProfileSettingsPage({ searchParams }: ProfileSettingsPageProps) {
  let bundle;
  try {
    bundle = await getCurrentProfileBundle();
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <ProfileUnavailable />;
  }

  if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) redirect("/onboarding");

  const initialValues: TeacherProfileInput = {
    ...bundle.teacherProfile,
    displayName: bundle.profile.displayName ?? "",
  };
  const { saved } = await searchParams;
  const savedValue = Array.isArray(saved) ? saved[0] : saved;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mb-10 border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">MAPS settings</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Teacher profile</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">
          Update the defaults MAPS remembers when you return.
        </p>
      </div>

      {savedValue === "1" ? (
        <p role="status" className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-900">
          Your MAPS profile was updated.
        </p>
      ) : null}

      <TeacherProfileForm
        action={saveProfileSettings}
        initialValues={initialValues}
        profileVersion={getProfileVersion(bundle)}
        submitLabel="Save profile"
      />

      <div className="mt-8">
        <Link href="/planner" className="text-sm font-semibold text-ink underline decoration-brand-orange decoration-2 underline-offset-4">
          Return to MAPS
        </Link>
      </div>
    </div>
  );
}

function ProfileUnavailable() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Profile unavailable</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">MAPS could not load your settings.</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again. Your profile details were not displayed or logged.</p>
      </div>
    </div>
  );
}
