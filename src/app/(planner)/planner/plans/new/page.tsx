import { BookOpen, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  let bundle;
  try {
    bundle = await getCurrentProfileBundle();
  } catch (error) {
    if (error instanceof ProfileDataError && error.code === "unauthenticated") redirect("/login");
    return <Unavailable />;
  }

  if (!bundle.profile?.onboardingCompleted) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">New MAPS plan</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Choose your planning context.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">School/classroom and adult/creator plans use different learner assumptions and outputs. Subject, audience, and delivery format are never treated as interchangeable.</p>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm">
          <BookOpen className="size-7 text-brand-orange-dark" aria-hidden="true" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">School / Classroom</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Plan for a class</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/65">Use grade, class conditions, materials, transitions, and learner needs.</p>
          {bundle.teacherProfile ? (
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/planner/plans/new/tomorrow" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">Plan Tomorrow</Link>
              <Link href="/planner/plans/new/template" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ink/15 px-5 py-3 text-sm font-semibold text-ink">K–5 rotation template</Link>
            </div>
          ) : (
            <Link href="/onboarding?context=school" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border border-ink/15 px-5 py-3 text-sm font-semibold text-ink">Set up classroom profile</Link>
          )}
        </section>

        <section className="rounded-3xl border border-brand-orange/35 bg-white p-7 shadow-sm">
          <Video className="size-7 text-brand-orange-dark" aria-hidden="true" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">Adult / Creator</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Plan an adult video lesson</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/65">Use audience knowledge, motivation, outcome, teaching approach, and video duration—without school fields.</p>
          <Link href="/planner/plans/new/creator" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">Create a Creator Lesson</Link>
        </section>
      </div>
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load planning contexts.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again.</p></div></div>;
}
