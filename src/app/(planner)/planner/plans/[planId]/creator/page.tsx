import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { CreatorRevisionForm } from "@/components/planner/creator-revision-form";
import { PlanFeedbackForm } from "@/components/planner/plan-feedback-form";
import { PrintPlanButton } from "@/components/planner/print-plan-button";
import {
  creatorRevisionIntents,
  creatorTeachingApproaches,
  type CreatorLessonOutputV1,
} from "@/lib/planner/creator-lesson-contract";
import { reviseCreatorLesson } from "@/server/actions/creator-lesson-actions";
import { savePlanFeedback } from "@/server/actions/feedback-actions";
import { getCurrentUserPlanFeedback, PlanFeedbackDataError } from "@/server/dal/feedback";
import { getCurrentUserCreatorPlan, PlanDataError } from "@/server/dal/plans";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type CreatorLessonPageProps = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ revision?: string | string[] }>;
};

const getCreatorPlan = cache((planId: string, revisionId?: string) =>
  getCurrentUserCreatorPlan(planId, revisionId),
);

function selectedRevision(searchParams: { revision?: string | string[] }) {
  return typeof searchParams.revision === "string" ? searchParams.revision : undefined;
}

export async function generateMetadata({ params, searchParams }: CreatorLessonPageProps): Promise<Metadata> {
  const { planId } = await params;
  const revisionId = selectedRevision(await searchParams);
  try {
    const plan = await getCreatorPlan(planId, revisionId);
    const suffix = plan.revisionNumber > 1 ? ` — Revision ${plan.revisionNumber}` : "";
    return { title: { absolute: `${plan.output.title}${suffix} — MAPS Creator Lesson` } };
  } catch {
    return { title: { absolute: "Saved creator lesson — MAPS" } };
  }
}

export default async function CreatorLessonPage({ params, searchParams }: CreatorLessonPageProps) {
  const { planId } = await params;
  const revisionId = selectedRevision(await searchParams);
  let plan;
  try {
    plan = await getCreatorPlan(planId, revisionId);
  } catch (error) {
    if (error instanceof PlanDataError && error.code === "unauthenticated") redirect("/login");
    if (error instanceof PlanDataError && error.code === "not_found") notFound();
    return <Unavailable />;
  }

  const revisionAction = reviseCreatorLesson.bind(null, plan.id, plan.revisionId);
  const feedbackAction = savePlanFeedback.bind(null, plan.id, plan.revisionId);
  let feedback = null;
  let feedbackAvailable = true;
  try {
    feedback = await getCurrentUserPlanFeedback(plan.id, plan.revisionId);
  } catch (error) {
    if (error instanceof PlanFeedbackDataError && error.code === "unauthenticated") redirect("/login");
    feedbackAvailable = false;
  }

  const output = plan.output;
  const approach = creatorTeachingApproaches.find(
    ({ value }) => value === plan.input.input.teaching_approach,
  )?.label ?? plan.input.input.teaching_approach;

  return (
    <article className="mx-auto max-w-5xl px-5 py-10 print:max-w-none print:px-0 print:py-0 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Adult / Creator lesson</p>
          <div className="flex flex-wrap gap-3"><PrintPlanButton /><Link href="/planner/plans" className="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline decoration-brand-orange decoration-2 underline-offset-4">All saved plans</Link></div>
        </div>
        <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark print:block">MAPS Creator Lesson</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{output.title}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-charcoal/70">{output.learning_outcome}</p>
        <dl className="mt-6 grid gap-3 rounded-2xl bg-white p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Subject" value={plan.subject} />
          <Meta label="Audience" value={plan.audience} />
          <Meta label="Video time" value={`${plan.durationMinutes} minutes`} />
          <Meta label="Approach" value={approach} />
        </dl>
        <p className="mt-4 text-sm text-charcoal/45">Revision {plan.revisionNumber}{plan.isCurrentRevision ? " (current)" : ""} · YouTube video · asynchronous</p>
      </header>

      <div className="mt-8 grid gap-6">
        <PlanSection title="Film this sequence">
          <ol className="space-y-3">
            <TimelineItem label="Opening hook" minutes={output.opening_hook.duration_minutes} />
            {output.lesson_beats.map((beat) => <TimelineItem key={beat.sequence} label={`${beat.sequence}. ${beat.title}`} minutes={beat.duration_minutes} />)}
            {output.pause_and_try ? <TimelineItem label="Pause and try" minutes={output.pause_and_try.duration_minutes} /> : null}
            <TimelineItem label="Self-check" minutes={output.self_check.duration_minutes} />
            <TimelineItem label="Recap" minutes={output.recap.duration_minutes} />
          </ol>
        </PlanSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <PlanSection title="Prerequisites"><BulletList items={output.prerequisites} /></PlanSection>
          <PlanSection title="Materials and tools"><Materials items={output.materials_tools} /></PlanSection>
        </div>

        <PlanSection title="Opening hook">
          <p className="text-base leading-7 text-charcoal/75">{output.opening_hook.teaching_move}</p>
          <p className="mt-4 rounded-xl bg-mist p-4 text-sm leading-6 text-charcoal/70"><span className="font-semibold text-ink">Why this matters to the learner:</span> {output.opening_hook.learner_need_connection}</p>
        </PlanSection>

        <PlanSection title="Teaching sequence">
          <ol className="space-y-5">
            {output.lesson_beats.map((beat) => (
              <li key={beat.sequence} className="border-l-2 border-brand-orange/40 pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-semibold text-ink">{beat.sequence}. {beat.title}</h3><span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-charcoal/60">{beat.duration_minutes} min · {beat.kind.replaceAll("_", " ")}</span></div>
                <dl className="mt-3 grid gap-3 text-sm leading-6">
                  <div><dt className="font-semibold text-ink">Educator</dt><dd>{beat.educator_action}</dd></div>
                  <div><dt className="font-semibold text-ink">Viewer</dt><dd>{beat.learner_action}</dd></div>
                  <div><dt className="font-semibold text-ink">Learning purpose</dt><dd>{beat.learning_purpose}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </PlanSection>

        <PlanSection title="Likely confusion and response">
          <div className="grid gap-4 sm:grid-cols-2">{output.likely_confusions.map((item, index) => <div key={index} className="rounded-xl bg-mist p-4"><h3 className="font-semibold text-ink">{item.misconception_or_confusion}</h3><p className="mt-2 text-sm leading-6 text-charcoal/70">{item.response}</p></div>)}</div>
        </PlanSection>

        {output.pause_and_try ? <PlanSection title="Pause and try"><p className="text-base leading-7 text-charcoal/75">{output.pause_and_try.activity}</p><p className="mt-4 rounded-xl bg-mist p-4 text-sm leading-6 text-charcoal/70"><span className="font-semibold text-ink">Success signal:</span> {output.pause_and_try.success_signal}</p></PlanSection> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <PlanSection title="Self-check"><p className="text-base leading-7 text-charcoal/75">{output.self_check.prompt}</p><p className="mt-4 text-sm leading-6 text-charcoal/65"><span className="font-semibold text-ink">Look for:</span> {output.self_check.look_for}</p></PlanSection>
          <PlanSection title="Recap"><BulletList items={output.recap.key_points} /><p className="mt-5 border-t border-ink/8 pt-4 text-sm leading-6 text-charcoal/65"><span className="font-semibold text-ink">Next learning step:</span> {output.next_learning_step}</p></PlanSection>
        </div>

        <PlanSection title="Recording and preparation notes">
          <div className="grid gap-6 md:grid-cols-3"><LabeledList title="Must prepare" items={output.recording_preparation_notes.must_prepare} /><LabeledList title="Optional polish" items={output.recording_preparation_notes.optional_preparation} /><LabeledList title="Filming notes" items={output.recording_preparation_notes.filming_notes} /></div>
        </PlanSection>

        <PlanSection title="Verify before recording">
          {output.claims_resources_to_verify.length ? <div className="space-y-4">{output.claims_resources_to_verify.map((item, index) => <div key={index} className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-semibold text-ink">{item.claim_or_resource}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-800">{item.reason.replaceAll("_", " ")}</p><p className="mt-2 text-sm leading-6 text-charcoal/70">{item.verification_action}</p></div>)}</div> : <p className="text-sm leading-6 text-charcoal/65">No current or source-dependent claims were identified. Review the lesson against your source material before recording.</p>}
          <p className="mt-4 text-xs leading-5 text-charcoal/50">MAPS does not claim that browsing, live verification, pricing checks, or current product testing occurred.</p>
        </PlanSection>
      </div>

      <section className="mt-8 rounded-3xl border border-ink/8 bg-white p-6 shadow-sm print:hidden sm:p-8"><CreatorRevisionForm action={revisionAction} branchingFromEarlierRevision={!plan.isCurrentRevision} /></section>

      <section className="mt-8 rounded-3xl border border-ink/8 bg-white p-6 shadow-sm print:hidden sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-ink">Revision history</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">Each version is immutable. Open or branch from any earlier lesson.</p>
        <ol className="mt-5 space-y-3">{plan.revisions.map((revision) => { const intent = creatorRevisionIntents.find(({ value }) => value === revision.revisionIntent)?.label; const active = revision.id === plan.revisionId; return <li key={revision.id}><Link href={`/planner/plans/${plan.id}/creator?revision=${revision.id}`} className={`flex flex-col gap-1 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${active ? "border-brand-orange bg-brand-orange/5" : "border-ink/8"}`}><span className="font-semibold text-ink">Revision {revision.revisionNumber}{revision.id === plan.currentRevisionId ? " · current" : ""}</span><span className="text-sm text-charcoal/55">{intent ?? "Original lesson"} · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(revision.createdAt))}</span></Link></li>; })}</ol>
      </section>

      <section className="mt-8 rounded-3xl border border-brand-orange/20 bg-white p-6 shadow-sm print:hidden sm:p-8">
        {feedbackAvailable ? <PlanFeedbackForm action={feedbackAction} initialFeedback={feedback} prompt="Could you record and teach this lesson?" commentPrompt="What would make this more filmable or teachable?" commentPlaceholder="Example: The explanation is clear, but the demonstration needs one stronger example." /> : <div role="status"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">Private beta feedback</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">Feedback is temporarily unavailable.</h2><p className="mt-2 text-sm leading-6 text-charcoal/60">Your saved creator lesson is unaffected.</p></div>}
      </section>
    </article>
  );
}

function PlanSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm print:break-inside-avoid print:shadow-none sm:p-8"><h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2><div className="mt-5 text-charcoal/75">{children}</div></section>;
}

function TimelineItem({ label, minutes }: { label: string; minutes: number }) {
  return <li className="flex items-center justify-between gap-4 rounded-xl bg-mist px-4 py-3"><span className="font-semibold text-ink">{label}</span><span className="shrink-0 text-sm font-semibold text-brand-orange-dark">{minutes} min</span></li>;
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-2 pl-5 text-sm leading-6">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

function Materials({ items }: { items: CreatorLessonOutputV1["materials_tools"] }) {
  return items.length ? <ul className="space-y-3">{items.map((item, index) => <li key={index} className="rounded-xl bg-mist p-4"><span className="font-semibold text-ink">{item.item}</span><span className="ml-2 text-xs font-semibold uppercase tracking-wide text-charcoal/45">{item.required ? "Required" : "Optional"}</span>{item.purpose ? <p className="mt-2 text-sm leading-6 text-charcoal/65">{item.purpose}</p> : null}</li>)}</ul> : <p className="text-sm leading-6">No special materials or tools are required.</p>;
}

function LabeledList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="font-semibold text-ink">{title}</h3>{items.length ? <BulletList items={items} /> : <p className="mt-2 text-sm text-charcoal/50">None.</p>}</div>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</dt><dd className="mt-1 font-medium text-ink">{value}</dd></div>;
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load this creator lesson.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Return to saved plans and try again.</p></div></div>;
}
