import { redirect } from "next/navigation";

import { CreatorLessonForm } from "@/components/planner/creator-lesson-form";
import { generateCreatorLesson } from "@/server/actions/creator-lesson-actions";
import { getCurrentProfileBundle, ProfileDataError } from "@/server/dal/profiles";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function NewCreatorLessonPage() {
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
      <header className="mb-10 border-b border-ink/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Adult / Creator lesson</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Plan a lesson adults can learn from on their own.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-charcoal/65">Build a filmable teaching sequence for YouTube around a real learner goal, prior knowledge, and a specific outcome—not a script or content-marketing package.</p>
      </header>
      <CreatorLessonForm action={generateCreatorLesson} />
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load Creator Mode.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please refresh and try again.</p></div></div>;
}
