"use client";

import { useActionState } from "react";

import {
  accessOptions,
  initialPlanTomorrowActionState,
  type PlanTomorrowActionState,
  type PlanTomorrowFormDefaults,
} from "@/lib/planner/plan-contract";
import { gradeLevelOptions, subjectAreaOptions } from "@/lib/planner/profile-options";

type PlanTomorrowFormProps = {
  action: (state: PlanTomorrowActionState, formData: FormData) => Promise<PlanTomorrowActionState>;
  defaults: PlanTomorrowFormDefaults;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
const labelClassName = "text-sm font-semibold text-ink";
const helperClassName = "mt-2 text-sm leading-6 text-charcoal/55";
const privacyHelper =
  "Describe needs in groups, not by student. Do not include names, IDs, diagnoses, medical details, or text copied from IEPs or 504 plans.";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-2 text-sm text-red-700">{message}</p> : null;
}

export function PlanTomorrowForm({ action, defaults }: PlanTomorrowFormProps) {
  const [state, formAction, pending] = useActionState(action, initialPlanTomorrowActionState);

  return (
    <form action={formAction} className="space-y-8">
      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">
          {state.message}
        </div>
      ) : null}

      <section aria-labelledby="lesson-request" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="lesson-request" className="font-display text-2xl font-semibold tracking-tight text-ink">Lesson request</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">Start with the instructional goal. MAPS will shape the sequence around your real constraints.</p>

        <div className="mt-7">
          <label htmlFor="topic" className={labelClassName}>What are you teaching?</label>
          <textarea
            id="topic"
            name="topic"
            required
            rows={4}
            maxLength={500}
            placeholder="Fractions as equal parts using visual models"
            aria-describedby={state.fieldErrors.topic ? "topic-error" : undefined}
            className={inputClassName}
          />
          <FieldError id="topic-error" message={state.fieldErrors.topic} />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="subject_area" className={labelClassName}>Subject</label>
            <select
              id="subject_area"
              name="subject_area"
              required
              defaultValue={defaults.subjectArea}
              aria-describedby={state.fieldErrors.subjectArea ? "subject-error" : undefined}
              className={inputClassName}
            >
              <option value="" disabled>Choose a subject</option>
              {subjectAreaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <FieldError id="subject-error" message={state.fieldErrors.subjectArea} />
          </div>

          <div>
            <label htmlFor="duration_minutes" className={labelClassName}>Instructional time</label>
            <div className="relative">
              <input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                required
                min={10}
                max={240}
                defaultValue={defaults.durationMinutes}
                className={`${inputClassName} pr-20`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 top-2 flex items-center text-sm text-charcoal/45">minutes</span>
            </div>
            <FieldError id="duration-error" message={state.fieldErrors.durationMinutes} />
          </div>
        </div>

        <fieldset className="mt-7">
          <legend className={labelClassName}>Grade levels</legend>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
            {gradeLevelOptions.map((grade) => (
              <label key={grade} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 px-3 py-2 text-sm font-medium text-charcoal/80">
                <input type="checkbox" name="grade_levels" value={grade} defaultChecked={defaults.gradeLevels.includes(grade)} className="size-4 accent-[var(--color-brand-orange)]" />
                {grade}
              </label>
            ))}
          </div>
          <FieldError id="grades-error" message={state.fieldErrors.gradeLevels} />
        </fieldset>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="class_size" className={labelClassName}>Class size <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="class_size" name="class_size" type="number" min={1} max={100} defaultValue={defaults.classSize ?? ""} className={inputClassName} />
            <FieldError id="class-size-error" message={state.fieldErrors.classSize} />
          </div>
          <div>
            <label htmlFor="available_materials" className={labelClassName}>Available materials <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="available_materials" name="available_materials" maxLength={2000} defaultValue={defaults.availableMaterials.join(", ")} placeholder="Chart paper, markers, fraction tiles" className={inputClassName} />
            <p className={helperClassName}>Separate materials with commas.</p>
            <FieldError id="materials-error" message={state.fieldErrors.availableMaterials} />
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="objective" className={labelClassName}>Objective or standard <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="objective" name="objective" rows={3} maxLength={1000} className={inputClassName} />
          <FieldError id="objective-error" message={state.fieldErrors.objective} />
        </div>

        <div className="mt-7">
          <label htmlFor="student_needs" className={labelClassName}>Aggregate student needs <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="student_needs" name="student_needs" rows={4} maxLength={1500} aria-describedby="student-needs-privacy" className={inputClassName} />
          <p id="student-needs-privacy" className={helperClassName}>{privacyHelper}</p>
          <FieldError id="student-needs-error" message={state.fieldErrors.studentNeeds} />
        </div>
      </section>

      <details className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <summary className="cursor-pointer font-display text-xl font-semibold tracking-tight text-ink">Classroom constraints</summary>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">Optional details that keep the plan realistic.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="copy_access" className={labelClassName}>Copy access</label>
            <select id="copy_access" name="copy_access" defaultValue="unknown" className={inputClassName}>
              {accessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="technology_access" className={labelClassName}>Technology access</label>
            <select id="technology_access" name="technology_access" defaultValue="unknown" className={inputClassName}>
              {accessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="prep_time_minutes" className={labelClassName}>Prep time available <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="prep_time_minutes" name="prep_time_minutes" type="number" min={0} max={120} className={inputClassName} />
          </div>
          <div>
            <label htmlFor="transition_minutes" className={labelClassName}>Transition time <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="transition_minutes" name="transition_minutes" type="number" min={0} max={30} className={inputClassName} />
          </div>
          <div>
            <label htmlFor="cleanup_minutes" className={labelClassName}>Cleanup time <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="cleanup_minutes" name="cleanup_minutes" type="number" min={0} max={30} className={inputClassName} />
          </div>
          <div>
            <label htmlFor="must_avoid" className={labelClassName}>Must avoid <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="must_avoid" name="must_avoid" maxLength={1600} placeholder="Individual read-alouds, wet materials" className={inputClassName} />
            <p className={helperClassName}>Separate items with commas.</p>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="space_constraints" className={labelClassName}>Space constraints <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="space_constraints" name="space_constraints" rows={3} maxLength={500} aria-describedby="constraints-privacy" className={inputClassName} />
        </div>
        <div className="mt-6">
          <label htmlFor="other_constraints" className={labelClassName}>Other constraints <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="other_constraints" name="other_constraints" rows={3} maxLength={1000} aria-describedby="constraints-privacy" className={inputClassName} />
          <p id="constraints-privacy" className={helperClassName}>{privacyHelper}</p>
          <FieldError id="constraints-error" message={state.fieldErrors.constraints} />
        </div>
      </details>

      <section aria-labelledby="additional-context" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="additional-context" className="font-display text-xl font-semibold tracking-tight text-ink">Anything else? <span className="font-sans text-sm font-normal text-charcoal/45">(optional)</span></h2>
        <textarea id="additional_notes" name="additional_notes" rows={4} maxLength={1500} aria-describedby="additional-notes-privacy" className={inputClassName} />
        <p id="additional-notes-privacy" className={helperClassName}>{privacyHelper}</p>
        <FieldError id="additional-notes-error" message={state.fieldErrors.additionalNotes} />
      </section>

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-charcoal/55">MAPS sends this request to the configured planning provider only when you generate. Invalid requests are not saved as plans.</p>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60">
          {pending ? "Building your plan…" : "Generate lesson plan"}
        </button>
      </div>
    </form>
  );
}
