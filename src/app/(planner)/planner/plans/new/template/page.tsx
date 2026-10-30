import { redirect } from "next/navigation";

import { RotationPlanForm } from "@/components/planner/rotation-plan-form";
import { generateRotationPlan } from "@/server/actions/rotation-plan-actions";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";
import { rotationPlanDefaultsFromProfile } from "@/server/planning/rotation-plan-defaults";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function TemplatePlanPage() {
  let bundle;
  try {
    bundle = await getCurrentProfileBundle();
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <Unavailable />;
  }

  if (!bundle.profile?.onboardingCompleted || !bundle.teacherProfile) redirect("/onboarding?context=school");
  const defaults = rotationPlanDefaultsFromProfile({
    ...bundle,
    profile: bundle.profile,
    teacherProfile: bundle.teacherProfile,
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="mb-10 border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Template-aware planning</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Build a K–5 Visual Art rotation plan.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-charcoal/65">Create one coherent rotation with developmentally distinct plans for every selected grade, then export the completed county-format document as DOCX.</p>
      </header>
      <RotationPlanForm action={generateRotationPlan} defaults={defaults} />
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load template planning.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again. Your profile details were not displayed or logged.</p></div></div>;
}
