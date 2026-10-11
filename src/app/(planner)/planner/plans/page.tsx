import Link from "next/link";
import { redirect } from "next/navigation";

import { listCurrentUserPlans, PlanDataError } from "@/server/dal/plans";
import { checkOnboardingCompletion, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";

export default async function SavedPlansPage() {
  try {
    if (!(await checkOnboardingCompletion())) redirect("/onboarding");
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <Unavailable />;
  }

  let plans;
  try {
    plans = await listCurrentUserPlans();
  } catch (error) {
    if (error instanceof PlanDataError && error.code === "unauthenticated") redirect("/login");
    return <Unavailable />;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="flex flex-col gap-6 border-b border-ink/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">MAPS library</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Saved plans</h1><p className="mt-4 text-base leading-7 text-charcoal/65">Your generated Plan Tomorrow lessons, newest first.</p></div>
        <Link href="/planner/plans/new/tomorrow" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white">Plan tomorrow</Link>
      </header>

      {plans.length ? (
        <div className="mt-8 grid gap-4">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/planner/plans/${plan.id}`} className="rounded-2xl border border-ink/8 bg-white p-6 shadow-sm transition hover:border-brand-orange/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-display text-2xl font-semibold text-ink">{plan.title}</h2><p className="mt-2 text-sm text-charcoal/60">{plan.subjectArea.replaceAll("_", " ")} · Grades {plan.gradeLevels.join(", ")} · {plan.durationMinutes} minutes</p></div><time dateTime={plan.createdAt} className="text-sm text-charcoal/45">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(plan.createdAt))}</time></div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/15 bg-white p-10 text-center"><h2 className="font-display text-2xl font-semibold text-ink">No saved plans yet</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-charcoal/60">Create your first Plan Tomorrow lesson and it will appear here.</p></div>
      )}
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load your saved plans.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again.</p></div></div>;
}
