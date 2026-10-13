import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { GuidedRevisionForm } from "@/components/planner/guided-revision-form";
import { guidedRevisionIntents, type GuidedRevisionIntent } from "@/lib/planner/plan-contract";
import { reviseSavedPlan } from "@/server/actions/revision-actions";
import { getCurrentUserPlan, PlanDataError } from "@/server/dal/plans";

export const dynamic = "force-dynamic";

type PlanDetailPageProps = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ revision?: string | string[] }>;
};

const getPlanDetail = cache((planId: string, revisionId?: string) =>
  getCurrentUserPlan(planId, revisionId),
);

function selectedRevision(searchParams: { revision?: string | string[] }) {
  return typeof searchParams.revision === "string" ? searchParams.revision : undefined;
}

export async function generateMetadata({ params, searchParams }: PlanDetailPageProps): Promise<Metadata> {
  const { planId } = await params;
  const selectedRevisionId = selectedRevision(await searchParams);

  try {
    const plan = await getPlanDetail(planId, selectedRevisionId);
    const revisionLabel = plan.revisionNumber > 1 ? ` — Revision ${plan.revisionNumber}` : "";

    return {
      title: {
        absolute: `${plan.output.title}${revisionLabel} — MAPS Lesson Plan`,
      },
    };
  } catch {
    return {
      title: {
        absolute: "Saved lesson plan — MAPS",
      },
    };
  }
}

export default async function PlanDetailPage({ params, searchParams }: PlanDetailPageProps) {
  const { planId } = await params;
  const query = await searchParams;
  const selectedRevisionId = selectedRevision(query);
  let plan;
  try {
    plan = await getPlanDetail(planId, selectedRevisionId);
  } catch (error) {
    if (error instanceof PlanDataError && error.code === "unauthenticated") redirect("/login");
    if (error instanceof PlanDataError && error.code === "not_found") notFound();
    return <Unavailable />;
  }

  const output = plan.output;
  const essentialPrep = output.before_students_arrive.filter((item) => item.essential);
  const optionalPrep = output.before_students_arrive.filter((item) => !item.essential);
  const revisionAction = reviseSavedPlan.bind(null, plan.id, plan.revisionId);
  return (
    <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Plan Tomorrow</p><Link href="/planner/plans" className="text-sm font-semibold text-ink underline decoration-brand-orange decoration-2 underline-offset-4">All saved plans</Link></div>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{output.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-charcoal/70">{output.goal}</p>
        <p className="mt-4 text-sm text-charcoal/45">{plan.subjectArea.replaceAll("_", " ")} · Grades {plan.gradeLevels.join(", ")} · {plan.durationMinutes} minutes · Revision {plan.revisionNumber}{plan.isCurrentRevision ? " (current)" : ""}</p>
      </header>

      <div className="mt-8 grid gap-6">
        <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
          <GuidedRevisionForm
            action={revisionAction}
            branchingFromEarlierRevision={!plan.isCurrentRevision}
          />
        </section>

        <PlanSection title="Teach this now">
          <ol className="grid gap-3 sm:grid-cols-2">
            {output.lesson_flow.map((step) => (
              <li key={step.sequence} className="flex items-center justify-between gap-4 rounded-xl bg-mist px-4 py-3">
                <span className="font-semibold text-ink">{step.sequence}. {step.activity_title}</span>
                <span className="shrink-0 text-sm font-semibold text-brand-orange-dark">{step.duration_minutes} min</span>
              </li>
            ))}
          </ol>
        </PlanSection>

        <PlanSection title="Before students arrive">
          {output.before_students_arrive.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <PrepList title="Must do" items={essentialPrep} emptyText="No required advance preparation." />
              <PrepList title="Nice if you have time" items={optionalPrep} emptyText="No optional preparation." />
            </div>
          ) : <p>No advance preparation required.</p>}
        </PlanSection>

        <PlanSection title="Materials">
          {output.materials.length ? <ul className="grid gap-3 sm:grid-cols-2">{output.materials.map((item, index) => <li key={`${item.item}-${index}`} className="rounded-xl bg-mist p-4"><span className="font-semibold text-ink">{item.item}</span>{item.quantity_or_setup ? <span> — {item.quantity_or_setup}</span> : null}{item.notes ? <p className="mt-1 text-sm text-charcoal/60">{item.notes}</p> : null}<p className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal/45">{item.required ? "Required" : "Optional"}</p></li>)}</ul> : <p>No specific materials required.</p>}
        </PlanSection>

        <PlanSection title="Timed lesson flow">
          <ol className="space-y-5">{output.lesson_flow.map((step) => <li key={step.sequence} className="border-l-2 border-brand-orange/40 pl-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-semibold text-ink">{step.sequence}. {step.activity_title}</h3><span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-charcoal/60">{step.duration_minutes} min</span></div><dl className="mt-3 grid gap-3 text-sm leading-6"><div><dt className="font-semibold text-ink">Teacher</dt><dd>{step.teacher_action}</dd></div><div><dt className="font-semibold text-ink">Students</dt><dd>{step.student_action}</dd></div>{step.transition_guidance ? <div><dt className="font-semibold text-ink">Transition</dt><dd>{step.transition_guidance}</dd></div> : null}{step.notes ? <div><dt className="font-semibold text-ink">Notes</dt><dd>{step.notes}</dd></div> : null}</dl></li>)}</ol>
        </PlanSection>

        <PlanSection title="Teacher moves"><ul className="space-y-3">{output.teacher_moves.map((item, index) => <li key={index}><span className="font-semibold text-ink">{item.move}</span>{item.purpose ? ` — ${item.purpose}` : ""}{item.during_flow_sequence ? <span className="text-charcoal/50"> (step {item.during_flow_sequence})</span> : null}</li>)}</ul></PlanSection>

        <PlanSection title="Differentiation"><div className="grid gap-5 sm:grid-cols-2"><PlanList title="Access supports" items={output.differentiation.access_supports} /><PlanList title="Additional challenge" items={output.differentiation.additional_challenge} />{output.differentiation.grouping_or_participation?.length ? <PlanList title="Grouping or participation" items={output.differentiation.grouping_or_participation} /> : null}</div></PlanSection>

        <PlanSection title="Checks for understanding"><div className="space-y-4">{output.checks_for_understanding.map((item, index) => <div key={index} className="rounded-xl bg-mist p-4"><p className="font-semibold text-ink">Step {item.during_flow_sequence}: {item.method}</p><p className="mt-2 text-sm leading-6">Look for: {item.look_for}</p>{item.response_if_not_yet ? <p className="mt-2 text-sm leading-6">If not yet: {item.response_if_not_yet}</p> : null}</div>)}</div></PlanSection>

        <PlanSection title="If things go sideways"><div className="space-y-4">{output.if_things_go_sideways.map((item, index) => <div key={index}><h3 className="font-semibold text-ink">{item.likely_issue}</h3>{item.signal ? <p className="mt-1 text-sm">Signal: {item.signal}</p> : null}<p className="mt-1 text-sm leading-6">Response: {item.response}</p>{item.time_adjustment ? <p className="mt-1 text-sm text-charcoal/60">Timing: {item.time_adjustment}</p> : null}</div>)}</div></PlanSection>

        <PlanSection title="What you need for tomorrow">{output.what_you_need_for_tomorrow.length ? <ul className="list-disc space-y-2 pl-5">{output.what_you_need_for_tomorrow.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p>Nothing else is required.</p>}</PlanSection>

        <PlanSection title="Revision history">
          <ol className="space-y-3">
            {plan.revisions.map((revision) => {
              const selected = revision.id === plan.revisionId;
              const current = revision.id === plan.currentRevisionId;
              return (
                <li key={revision.id}>
                  <Link
                    href={current ? `/planner/plans/${plan.id}` : `/planner/plans/${plan.id}?revision=${revision.id}`}
                    aria-current={selected ? "page" : undefined}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${selected ? "border-brand-orange bg-brand-orange/5" : "border-ink/8 hover:border-brand-orange/40"}`}
                  >
                    <span>
                      <span className="font-semibold text-ink">Revision {revision.revisionNumber}</span>
                      <span className="ml-2 text-charcoal/55">
                        {revision.revisionNumber === 1 ? "Original plan" : revisionIntentLabel(revision.revisionIntent)}
                      </span>
                    </span>
                    <span className="text-xs text-charcoal/45">
                      {current ? "Current · " : ""}{new Date(revision.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </PlanSection>
      </div>
    </article>
  );
}

function revisionIntentLabel(intent?: GuidedRevisionIntent) {
  return guidedRevisionIntents.find((option) => option.value === intent)?.label ?? "Guided revision";
}

function PlanSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-ink/8 bg-white p-6 text-charcoal/75 shadow-sm sm:p-8"><h2 className="mb-5 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>{children}</section>;
}

function PlanList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="font-semibold text-ink">{title}</h3>{items.length ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6">{items.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-charcoal/55">No additional suggestions.</p>}</div>;
}

function PrepList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: Array<{ sequence: number; task: string; estimated_minutes?: number }>;
  emptyText: string;
}) {
  return (
    <div>
      <h3 className="font-semibold text-ink">{title}</h3>
      {items.length ? (
        <ol className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.sequence} className="flex gap-3 text-sm leading-6">
              <span className="font-semibold text-brand-orange-dark">{item.sequence}.</span>
              <span>{item.task}{item.estimated_minutes !== undefined ? ` (${item.estimated_minutes} min)` : ""}</span>
            </li>
          ))}
        </ol>
      ) : <p className="mt-2 text-sm text-charcoal/55">{emptyText}</p>}
    </div>
  );
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load this plan.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please return to saved plans and try again.</p></div></div>;
}
