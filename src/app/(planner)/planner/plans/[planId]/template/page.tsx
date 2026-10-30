import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { PlanFeedbackForm } from "@/components/planner/plan-feedback-form";
import type {
  RotationPlanGradeOutputV1,
  RotationPlanPhaseOutputV1,
} from "@/lib/planner/rotation-plan-contract";
import {
  isRotationPlanExportable,
  rotationPlanCompleteness,
} from "@/lib/planner/rotation-plan-schema";
import { savePlanFeedback } from "@/server/actions/feedback-actions";
import { getCurrentUserPlanFeedback, PlanFeedbackDataError } from "@/server/dal/feedback";
import { getCurrentUserRotationPlan, PlanDataError } from "@/server/dal/plans";

export const dynamic = "force-dynamic";

type TemplatePlanDetailPageProps = {
  params: Promise<{ planId: string }>;
};

const getRotationPlan = cache((planId: string) => getCurrentUserRotationPlan(planId));

const phaseLabels: Record<RotationPlanPhaseOutputV1["phase"], string> = {
  engage: "Engage",
  focus: "Focus",
  explore_apply: "Explore and Apply",
  reflect: "Reflect",
};

export async function generateMetadata({ params }: TemplatePlanDetailPageProps): Promise<Metadata> {
  const { planId } = await params;
  try {
    const plan = await getRotationPlan(planId);
    return { title: { absolute: `${plan.output.title} — MAPS K–5 Rotation Plan` } };
  } catch {
    return { title: { absolute: "Saved rotation plan — MAPS" } };
  }
}

export default async function TemplatePlanDetailPage({ params }: TemplatePlanDetailPageProps) {
  const { planId } = await params;
  let plan;
  try {
    plan = await getRotationPlan(planId);
  } catch (error) {
    if (error instanceof PlanDataError && error.code === "unauthenticated") redirect("/login");
    if (error instanceof PlanDataError && error.code === "not_found") notFound();
    return <Unavailable />;
  }

  const completeness = rotationPlanCompleteness(plan.output);
  const exportable = isRotationPlanExportable(plan.output);
  const feedbackAction = savePlanFeedback.bind(null, plan.id, plan.revisionId);
  let feedback = null;
  let feedbackAvailable = true;
  try {
    feedback = await getCurrentUserPlanFeedback(plan.id, plan.revisionId);
  } catch (error) {
    if (error instanceof PlanFeedbackDataError && error.code === "unauthenticated") redirect("/login");
    feedbackAvailable = false;
  }

  return (
    <article className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <header className="border-b border-ink/8 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">K–5 Visual Art rotation template</p>
          <Link href="/planner/plans" className="text-sm font-semibold text-ink underline decoration-brand-orange decoration-2 underline-offset-4">All saved plans</Link>
        </div>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{plan.output.title}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-charcoal/70">{plan.output.shared_rotation_concept}</p>
        <dl className="mt-6 grid gap-3 rounded-2xl bg-white p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="School" value={plan.output.header.school} />
          <Meta label="Teacher" value={plan.output.header.teacher} />
          <Meta label="Content" value={plan.output.header.content} />
          <Meta label="Rotation dates" value={plan.output.header.rotation_date_range} />
        </dl>
      </header>

      <section className={`mt-8 rounded-3xl border p-6 shadow-sm sm:p-8 ${exportable ? "border-emerald-200 bg-emerald-50/60" : "border-amber-300 bg-amber-50"}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${exportable ? "text-emerald-800" : "text-amber-900"}`}>Template completeness</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{exportable ? "Ready for DOCX export" : "Standards are still required"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/65">{exportable ? "Every county-required component is populated for every selected grade." : "MAPS completed the instructional plan without inventing standards. Add teacher-verified standards in a new request before treating this as submission-ready."}</p>
          </div>
          {exportable ? <a href={`/planner/plans/${plan.id}/template/export`} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white">Download county-format DOCX</a> : <span aria-disabled="true" className="inline-flex min-h-12 shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal/45">DOCX export blocked</span>}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {completeness.map((grade) => (
            <div key={grade.grade} className="rounded-xl bg-white/80 p-4">
              <p className="font-semibold text-ink">{gradeName(grade.grade)}</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-charcoal/60">
                {grade.items.map((item) => <li key={item.field}>{item.complete ? "✓" : "○"} {item.label}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 space-y-8">
        {plan.output.grade_plans.map((gradePlan) => <GradePlanSection key={gradePlan.grade} gradePlan={gradePlan} />)}
      </div>

      <section className="mt-8 rounded-3xl border border-brand-orange/20 bg-white p-6 shadow-sm sm:p-8">
        {feedbackAvailable ? <PlanFeedbackForm action={feedbackAction} initialFeedback={feedback} /> : <div role="status"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">Private beta feedback</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">Feedback is temporarily unavailable.</h2><p className="mt-2 text-sm leading-6 text-charcoal/60">Your saved rotation plan is unaffected. Please refresh and try again later.</p></div>}
      </section>
    </article>
  );
}

function GradePlanSection({ gradePlan }: { gradePlan: RotationPlanGradeOutputV1 }) {
  return (
    <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{gradeName(gradePlan.grade)}</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PlanList title="Standard(s)" items={gradePlan.standards} empty="No teacher-supplied standards yet." />
        <PlanList title="Learning Targets — I can…" items={gradePlan.learning_targets} />
        <PlanList title="Success Criteria — I know I am successful when I can…" items={gradePlan.success_criteria} />
        <PlanList title="Instructional Resources / Materials" items={gradePlan.instructional_resources_materials} />
        <PlanList title="Academic Vocabulary" items={gradePlan.academic_vocabulary} />
        <PlanList title="Differentiation" items={gradePlan.differentiation} />
        <PlanList title="Assessment Strategies" items={gradePlan.assessment_strategies} />
        <PlanList title="Writing Strategies" items={gradePlan.writing_strategies} />
      </div>

      <h3 className="mt-9 border-t border-ink/8 pt-7 font-display text-2xl font-semibold text-ink">Lesson sequence</h3>
      <ol className="mt-5 space-y-5">
        {gradePlan.phases.map((phase) => (
          <li key={phase.phase} className="rounded-2xl bg-mist p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3"><h4 className="text-lg font-semibold text-ink">{phaseLabels[phase.phase]}</h4><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-orange-dark">{phase.duration_minutes} min</span></div>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <PlanList title="Teacher Actions" items={phase.teacher_actions} />
              <PlanList title="Student Actions" items={phase.student_actions} />
            </div>
            {phase.transition_or_cleanup ? <p className="mt-4 border-t border-ink/8 pt-4 text-sm leading-6 text-charcoal/65"><span className="font-semibold text-ink">Transition / cleanup:</span> {phase.transition_or_cleanup}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</dt><dd className="mt-1 font-medium text-ink">{value}</dd></div>;
}

function PlanList({ title, items, empty = "Not populated." }: { title: string; items: string[]; empty?: string }) {
  return <div><h3 className="font-semibold text-ink">{title}</h3>{items.length ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-charcoal/75">{items.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-amber-800">{empty}</p>}</div>;
}

function gradeName(grade: RotationPlanGradeOutputV1["grade"]) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

function Unavailable() {
  return <div className="mx-auto max-w-2xl px-5 py-16"><div role="alert" className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><h1 className="font-display text-3xl font-semibold text-ink">MAPS could not load this rotation plan.</h1><p className="mt-4 text-sm leading-6 text-charcoal/65">Please return to saved plans and try again.</p></div></div>;
}
