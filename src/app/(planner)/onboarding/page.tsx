import { BookOpen, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CreatorProfileForm } from "@/components/planner/creator-profile-form";
import { TeacherProfileForm } from "@/components/planner/teacher-profile-form";
import { defaultTeacherProfileInput, type TeacherProfileInput } from "@/lib/planner/profile-options";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import {
  saveCreatorOnboardingProfile,
  saveOnboardingProfile,
} from "@/server/actions/profile-actions";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";

type OnboardingPageProps = {
  searchParams: Promise<{ context?: string | string[] }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
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

  const query = await searchParams;
  const context = Array.isArray(query.context) ? query.context[0] : query.context;

  if (
    bundle.profile?.onboardingCompleted
    && (
      (bundle.profile.planningContext === "adult_creator" && context !== "school")
      || (bundle.profile.planningContext === "school_classroom" && bundle.teacherProfile)
    )
  ) {
    redirect("/planner");
  }

  const authName = user.user_metadata.full_name;
  const displayName =
    bundle.profile?.displayName ?? (typeof authName === "string" && authName.trim() ? authName.trim() : "");
  if (context !== "school" && context !== "creator") {
    return <ContextSelection displayName={displayName} />;
  }

  const initialValues: TeacherProfileInput = bundle.teacherProfile
    ? { ...bundle.teacherProfile, displayName }
    : { ...defaultTeacherProfileInput, displayName };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mb-10 flex flex-col gap-6 border-b border-ink/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">MAPS setup</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{context === "creator" ? "Set up your creator workspace." : "Tell MAPS what you usually plan around."}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">
            {context === "creator"
              ? "Plan adult learning without supplying a school, grade, standards, or classroom profile."
              : "A few practical defaults now will make future classroom planning faster. You can update everything later."}
          </p>
        </div>
        <form action="/logout" method="post">
          <button type="submit" className="text-sm font-medium text-charcoal/60 hover:text-ink">Sign out</button>
        </form>
      </div>

      {context === "creator" ? (
        <CreatorProfileForm
          action={saveCreatorOnboardingProfile}
          displayName={displayName}
          submitLabel="Save and enter Creator Mode"
        />
      ) : (
        <TeacherProfileForm action={saveOnboardingProfile} initialValues={initialValues} submitLabel="Save and enter MAPS" />
      )}

      <Link href="/onboarding" className="mt-8 inline-block text-sm font-semibold text-ink underline decoration-brand-orange decoration-2 underline-offset-4">
        Choose a different planning context
      </Link>
    </div>
  );
}

function ContextSelection({ displayName }: { displayName: string }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">MAPS setup</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">What kind of learning are you planning?</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">Choose the context MAPS should use for your initial workspace. Subject, audience, and delivery format remain separate inside each plan.</p>
      </header>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link href="/onboarding?context=school" className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition hover:border-brand-orange/50">
          <BookOpen className="size-7 text-brand-orange-dark" aria-hidden="true" />
          <h2 className="mt-6 font-display text-2xl font-semibold text-ink">School / Classroom</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/65">Use grades, class conditions, materials, transitions, and learner needs to shape classroom plans.</p>
          <p className="mt-6 text-sm font-semibold text-ink">Set up classroom planning →</p>
        </Link>
        <Link href="/onboarding?context=creator" className="rounded-3xl border border-brand-orange/35 bg-white p-7 shadow-sm transition hover:border-brand-orange">
          <Video className="size-7 text-brand-orange-dark" aria-hidden="true" />
          <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Adult / Creator</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/65">Plan adult technology and AI learning for asynchronous video without school fields or standards.</p>
          <p className="mt-6 text-sm font-semibold text-ink">Set up creator planning →</p>
        </Link>
      </div>
      {displayName ? <p className="mt-6 text-sm text-charcoal/50">Signed in as {displayName}</p> : null}
      <form action="/logout" method="post" className="mt-3"><button type="submit" className="text-sm font-medium text-charcoal/60 hover:text-ink">Sign out</button></form>
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
