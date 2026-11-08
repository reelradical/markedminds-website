"use client";

import { useActionState } from "react";

import {
  creatorTeachingApproaches,
  initialCreatorLessonActionState,
  type CreatorLessonActionState,
  type CreatorLessonField,
} from "@/lib/planner/creator-lesson-contract";
import { CREATOR_MIN_DURATION_MINUTES } from "@/lib/planner/creator-timing-budget";

type CreatorLessonFormProps = {
  action: (
    state: CreatorLessonActionState,
    formData: FormData,
  ) => Promise<CreatorLessonActionState>;
};

const inputClassName = "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
const labelClassName = "text-sm font-semibold text-ink";
const helperClassName = "mt-2 text-sm leading-6 text-charcoal/55";

function FieldError({ field, state }: { field: CreatorLessonField; state: CreatorLessonActionState }) {
  const message = state.fieldErrors[field];
  return message ? <p role="alert" className="mt-2 text-sm text-red-700">{message}</p> : null;
}

export function CreatorLessonForm({ action }: CreatorLessonFormProps) {
  const [state, formAction, pending] = useActionState(action, initialCreatorLessonActionState);

  return (
    <form action={formAction} aria-busy={pending} className="space-y-8">
      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">{state.message}</div>
      ) : null}

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">Adult / Creator</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">Learning purpose</h2>
        <p className={helperClassName}>Define the subject, audience, and learning result separately. MAPS will not translate adults into grade levels or add standards.</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="subject" className={labelClassName}>Subject or domain</label>
            <input id="subject" name="subject" required maxLength={160} placeholder="Practical generative AI" className={inputClassName} />
            <FieldError field="subject" state={state} />
          </div>
          <div>
            <label htmlFor="topic_or_working_title" className={labelClassName}>Topic or working video title</label>
            <input id="topic_or_working_title" name="topic_or_working_title" required maxLength={300} placeholder="Build a reliable first prompt workflow" className={inputClassName} />
            <FieldError field="topicOrWorkingTitle" state={state} />
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="audience" className={labelClassName}>Intended adult audience</label>
          <textarea id="audience" name="audience" required rows={3} maxLength={1000} placeholder="Independent consultants who use AI occasionally but do not have a repeatable workflow" className={inputClassName} />
          <FieldError field="audience" state={state} />
        </div>

        <div className="mt-7">
          <label htmlFor="prior_knowledge" className={labelClassName}>What do they already know?</label>
          <textarea id="prior_knowledge" name="prior_knowledge" required rows={3} maxLength={1200} placeholder="They can use a chat interface and write a basic prompt, but do not yet separate context, constraints, and evaluation criteria." className={inputClassName} />
          <FieldError field="priorKnowledge" state={state} />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="learner_goal" className={labelClassName}>Learner goal or motivation</label>
            <textarea id="learner_goal" name="learner_goal" required rows={4} maxLength={1200} placeholder="They want more reliable output without spending time rewriting every prompt." className={inputClassName} />
            <FieldError field="learnerGoal" state={state} />
          </div>
          <div>
            <label htmlFor="learning_outcome" className={labelClassName}>Afterward, viewers should understand or be able to…</label>
            <textarea id="learning_outcome" name="learning_outcome" required rows={4} maxLength={1200} placeholder="Build and evaluate a reusable prompt using context, constraints, and a clear success check." className={inputClassName} />
            <FieldError field="learningOutcome" state={state} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Delivery and teaching approach</h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="duration_minutes" className={labelClassName}>Target video duration</label>
            <div className="relative">
              <input id="duration_minutes" name="duration_minutes" type="number" min={CREATOR_MIN_DURATION_MINUTES} max={180} required defaultValue={15} className={`${inputClassName} pr-20`} />
              <span className="pointer-events-none absolute inset-y-0 right-4 top-2 flex items-center text-sm text-charcoal/45">minutes</span>
            </div>
            <FieldError field="durationMinutes" state={state} />
          </div>
          <div>
            <span className={labelClassName}>Delivery format</span>
            <div className="mt-2 min-h-12 rounded-xl border border-ink/10 bg-mist px-4 py-3 text-base text-charcoal/70">YouTube video · asynchronous</div>
            <p className={helperClassName}>This V1 workflow plans instruction for recording; it does not publish or manage YouTube content.</p>
          </div>
        </div>

        <fieldset className="mt-7">
          <legend className={labelClassName}>Teaching approach</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {creatorTeachingApproaches.map((approach) => (
              <label key={approach.value} className="flex cursor-pointer gap-3 rounded-2xl border border-ink/10 p-4 transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
                <input type="radio" name="teaching_approach" value={approach.value} required defaultChecked={approach.value === "explanation_and_demonstration"} className="mt-1 size-4 shrink-0 accent-[var(--color-brand-orange)]" />
                <span><span className="block font-semibold text-ink">{approach.label}</span><span className="mt-1 block text-sm leading-5 text-charcoal/60">{approach.description}</span></span>
              </label>
            ))}
          </div>
          <FieldError field="teachingApproach" state={state} />
        </fieldset>
      </section>

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Source and recording context</h2>
        <p className={helperClassName}>Optional context helps MAPS plan responsibly. Source notes are treated as supplied material—not as proof that live verification occurred.</p>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="source_notes" className={labelClassName}>Source notes <span className="font-normal text-charcoal/45">(optional)</span></label>
            <textarea id="source_notes" name="source_notes" rows={5} maxLength={5000} placeholder="Paste concise notes or list sources you already verified. MAPS will not invent citations." className={inputClassName} />
            <FieldError field="sourceNotes" state={state} />
          </div>
          <div>
            <label htmlFor="tools_version_context" className={labelClassName}>Tools or version context <span className="font-normal text-charcoal/45">(optional)</span></label>
            <textarea id="tools_version_context" name="tools_version_context" rows={5} maxLength={1500} placeholder="Example: ChatGPT web app, interface observed October 2026; verify labels before recording." className={inputClassName} />
            <FieldError field="toolsVersionContext" state={state} />
          </div>
        </div>
        <div className="mt-7">
          <label htmlFor="materials_resources" className={labelClassName}>Materials or resources <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="materials_resources" name="materials_resources" rows={3} maxLength={3000} placeholder="One per line: sample prompt, screen-recording tool, completed example" className={inputClassName} />
          <FieldError field="materialsResources" state={state} />
        </div>
        <div className="mt-7">
          <label htmlFor="additional_notes" className={labelClassName}>Additional notes <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="additional_notes" name="additional_notes" rows={4} maxLength={2000} placeholder="Tone, accessibility needs, examples to include, or recording constraints" className={inputClassName} />
          <p className={helperClassName}>Do not include student names, IDs, medical information, or copied educational records.</p>
          <FieldError field="additionalNotes" state={state} />
        </div>
      </section>

      {pending ? (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-5 py-4 text-sm leading-6 text-charcoal/70">
          <span aria-hidden="true" className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-brand-orange/25 border-t-brand-orange" />
          <span><strong className="text-ink">MAPS is building the lesson sequence.</strong> This usually takes 15–30 seconds while it checks pacing, instructional depth, practice, and verification flags.</span>
        </div>
      ) : null}

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-sm leading-6 text-charcoal/55">A plan is saved only after generation, contract validation, and owner-scoped persistence all succeed.</p>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60">
          {pending ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : null}
          {pending ? "Planning your lesson…" : "Create creator lesson"}
        </button>
      </div>
    </form>
  );
}
