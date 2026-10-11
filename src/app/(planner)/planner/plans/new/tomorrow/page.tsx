import { redirect } from "next/navigation";

import { PlanTomorrowForm } from "@/components/planner/plan-tomorrow-form";
import type { PlanTomorrowFormDefaults } from "@/lib/planner/plan-contract";
import { generatePlanTomorrow } from "@/server/actions/plan-actions";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function PlanTomorrowPage() {
  let bundle;
  try {
    bundle = await getCurrentProfileBundle();
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <Unavailable />;
  }

  if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) redirect("/onboarding");
  const profile = bundle.teacherProfile;
  const defaults: PlanTomorrowFormDefaults = {
    subjectArea: profile.subjectAreas.length === 1 ? profile.subjectAreas[0] : "",
    gradeLevels: profile.gradeLevels,
    durationMinutes: profile.typicalClassDurationMinutes,
    classSize: profile.typicalClassSize,
    availableMaterials: profile.commonMaterials,
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="mb-10 border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Plan Tomorrow</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">What are you teaching tomorrow?</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">Give MAPS the goal and the constraints that matter. Your saved profile has filled in the defaults it already knows.</p>
      </header>
      <PlanTomorrowForm action={generatePlanTomorrow} defaults={defaults} />
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load Plan Tomorrow.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again. Your profile details were not displayed or logged.</p></div></div>;
}
