"use client";

import { useActionState, useState } from "react";

import { accessOptions } from "@/lib/planner/plan-contract";
import {
  initialRotationPlanActionState,
  rotationPlanGrades,
  type RotationPlanActionState,
  type RotationPlanFormDefaults,
  type RotationPlanGrade,
} from "@/lib/planner/rotation-plan-contract";

type RotationPlanFormProps = {
  action: (state: RotationPlanActionState, formData: FormData) => Promise<RotationPlanActionState>;
  defaults: RotationPlanFormDefaults;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
const labelClassName = "text-sm font-semibold text-ink";
const helperClassName = "mt-2 text-sm leading-6 text-charcoal/55";
const privacyHelper =
  "Describe needs in groups. Do not include student names, IDs, diagnoses, medical details, or text copied from IEPs or 504 plans.";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-2 text-sm text-red-700">{message}</p> : null;
}

function toggleGrade(
  grade: RotationPlanGrade,
  selected: RotationPlanGrade[],
  setSelected: (grades: RotationPlanGrade[]) => void,
) {
  const next = selected.includes(grade)
    ? selected.filter((candidate) => candidate !== grade)
    : rotationPlanGrades.filter((candidate) => [...selected, grade].includes(candidate));
  setSelected(next);
}

export function RotationPlanForm({ action, defaults }: RotationPlanFormProps) {
  const [state, formAction, pending] = useActionState(action, initialRotationPlanActionState);
  const [selectedGrades, setSelectedGrades] = useState<RotationPlanGrade[]>(defaults.grades);

  return (
    <form action={formAction} aria-busy={pending} className="space-y-8">
      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">
          {state.message}
        </div>
      ) : null}

      <section aria-labelledby="template-context" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="template-context" className="font-display text-2xl font-semibold tracking-tight text-ink">County template details</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">These values appear in the document header exactly as entered.</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="school" className={labelClassName}>School</label>
            <input id="school" name="school" required maxLength={200} className={inputClassName} />
            <FieldError id="school-error" message={state.fieldErrors.school} />
          </div>
          <div>
            <label htmlFor="teacher" className={labelClassName}>Teacher</label>
            <input id="teacher" name="teacher" required maxLength={200} defaultValue={defaults.teacher} className={inputClassName} />
            <FieldError id="teacher-error" message={state.fieldErrors.teacher} />
          </div>
          <div>
            <label htmlFor="content" className={labelClassName}>Content</label>
            <input id="content" name="content" required maxLength={200} defaultValue={defaults.content} className={inputClassName} />
            <FieldError id="content-error" message={state.fieldErrors.content} />
          </div>
          <div>
            <label htmlFor="rotation_date_range" className={labelClassName}>Class rotation date range</label>
            <input id="rotation_date_range" name="rotation_date_range" required maxLength={200} placeholder="October 26–30, 2026" className={inputClassName} />
            <FieldError id="rotation-date-error" message={state.fieldErrors.rotationDateRange} />
          </div>
        </div>

        <fieldset className="mt-7">
          <legend className={labelClassName}>Grades included</legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {rotationPlanGrades.map((grade) => (
              <label key={grade} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 px-3 py-2 text-sm font-medium text-charcoal/80">
                <input
                  type="checkbox"
                  name="grades"
                  value={grade}
                  checked={selectedGrades.includes(grade)}
                  onChange={() => toggleGrade(grade, selectedGrades, setSelectedGrades)}
                  className="size-4 accent-[var(--color-brand-orange)]"
                />
                {grade === "K" ? "K" : `Grade ${grade}`}
              </label>
            ))}
          </div>
          <FieldError id="grades-error" message={state.fieldErrors.grades} />
        </fieldset>
      </section>

      <section aria-labelledby="unit-request" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="unit-request" className="font-display text-2xl font-semibold tracking-tight text-ink">Shared rotation concept</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">MAPS will preserve one coherent idea while building distinct expectations and actions for each grade.</p>

        <div className="mt-7">
          <label htmlFor="topic_unit_concept" className={labelClassName}>Topic or unit concept</label>
          <textarea
            id="topic_unit_concept"
            name="topic_unit_concept"
            required
            rows={4}
            maxLength={1000}
            placeholder="Color, pattern, printmaking, collage, and visual storytelling"
            className={inputClassName}
          />
          <FieldError id="topic-error" message={state.fieldErrors.topicUnitConcept} />
        </div>

        <div className="mt-7">
          <label htmlFor="shared_objective" className={labelClassName}>Shared objective <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="shared_objective" name="shared_objective" rows={3} maxLength={1500} className={inputClassName} />
          <FieldError id="objective-error" message={state.fieldErrors.sharedObjective} />
        </div>

        <div className="mt-7 rounded-2xl border border-amber-300/70 bg-amber-50 p-5">
          <p className="font-semibold text-amber-950">Standards must come from you.</p>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">Enter one standard per line. MAPS preserves these entries exactly and never invents missing standards. You may generate without them, but DOCX export remains blocked until every selected grade has at least one standard.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {selectedGrades.map((grade) => (
            <div key={grade}>
              <label htmlFor={`standards_${grade}`} className={labelClassName}>{grade === "K" ? "Kindergarten" : `Grade ${grade}`} standards</label>
              <textarea id={`standards_${grade}`} name={`standards_${grade}`} rows={4} maxLength={10000} placeholder="One teacher-supplied standard per line" className={inputClassName} />
            </div>
          ))}
        </div>
        <FieldError id="standards-error" message={state.fieldErrors.standards} />

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="duration_minutes" className={labelClassName}>Instructional time per grade</label>
            <input id="duration_minutes" name="duration_minutes" type="number" required min={20} max={120} defaultValue={defaults.durationMinutes} className={inputClassName} />
            <FieldError id="duration-error" message={state.fieldErrors.durationMinutes} />
          </div>
          <div>
            <label htmlFor="class_size" className={labelClassName}>Typical class size <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input id="class_size" name="class_size" type="number" min={1} max={100} defaultValue={defaults.classSize ?? ""} className={inputClassName} />
            <FieldError id="class-size-error" message={state.fieldErrors.classSize} />
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="available_materials" className={labelClassName}>Available materials <span className="font-normal text-charcoal/45">(optional)</span></label>
          <input id="available_materials" name="available_materials" maxLength={6000} defaultValue={defaults.availableMaterials.join(", ")} placeholder="Tempera paint, foam printing plates, paper, collage scraps" className={inputClassName} />
          <p className={helperClassName}>Separate materials with commas.</p>
          <FieldError id="materials-error" message={state.fieldErrors.availableMaterials} />
        </div>

        <div className="mt-7">
          <label htmlFor="aggregate_learner_needs" className={labelClassName}>Aggregate learner needs <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea id="aggregate_learner_needs" name="aggregate_learner_needs" rows={4} maxLength={1500} aria-describedby="rotation-privacy" className={inputClassName} />
          <p id="rotation-privacy" className={helperClassName}>{privacyHelper}</p>
          <FieldError id="needs-error" message={state.fieldErrors.aggregateLearnerNeeds} />
        </div>
      </section>

      <details className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <summary className="cursor-pointer font-display text-xl font-semibold tracking-tight text-ink">Rotation constraints</summary>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">Optional details that keep all six grade plans executable.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="copy_access" className={labelClassName}>Copy access</label>
            <select id="copy_access" name="copy_access" defaultValue="unknown" className={inputClassName}>{accessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          </div>
          <div>
            <label htmlFor="technology_access" className={labelClassName}>Technology access</label>
            <select id="technology_access" name="technology_access" defaultValue="unknown" className={inputClassName}>{accessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          </div>
          <div><label htmlFor="prep_time_minutes" className={labelClassName}>Prep time available</label><input id="prep_time_minutes" name="prep_time_minutes" type="number" min={0} max={120} className={inputClassName} /></div>
          <div><label htmlFor="transition_minutes" className={labelClassName}>Transition time</label><input id="transition_minutes" name="transition_minutes" type="number" min={0} max={30} className={inputClassName} /></div>
          <div><label htmlFor="cleanup_minutes" className={labelClassName}>Cleanup time</label><input id="cleanup_minutes" name="cleanup_minutes" type="number" min={0} max={30} className={inputClassName} /></div>
          <div><label htmlFor="must_avoid" className={labelClassName}>Must avoid</label><input id="must_avoid" name="must_avoid" maxLength={1600} placeholder="Wet materials for Grade K, individual printing stations" className={inputClassName} /></div>
        </div>
        <div className="mt-6"><label htmlFor="space_constraints" className={labelClassName}>Space constraints</label><textarea id="space_constraints" name="space_constraints" rows={3} maxLength={500} className={inputClassName} /></div>
        <div className="mt-6"><label htmlFor="other_constraints" className={labelClassName}>Other constraints</label><textarea id="other_constraints" name="other_constraints" rows={3} maxLength={1000} aria-describedby="constraints-privacy" className={inputClassName} /><p id="constraints-privacy" className={helperClassName}>{privacyHelper}</p><FieldError id="constraints-error" message={state.fieldErrors.constraints} /></div>
      </details>

      <section aria-labelledby="rotation-notes" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="rotation-notes" className="font-display text-xl font-semibold tracking-tight text-ink">Additional notes <span className="font-sans text-sm font-normal text-charcoal/45">(optional)</span></h2>
        <textarea id="additional_notes" name="additional_notes" rows={4} maxLength={1500} aria-describedby="notes-privacy" className={inputClassName} />
        <p id="notes-privacy" className={helperClassName}>{privacyHelper}</p>
        <FieldError id="notes-error" message={state.fieldErrors.additionalNotes} />
      </section>

      {pending ? (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-5 py-4 text-sm leading-6 text-charcoal/70">
          <span aria-hidden="true" className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-brand-orange/25 border-t-brand-orange" />
          <span><strong className="text-ink">MAPS is building each grade-level plan.</strong> A complete multi-grade rotation may take 30–60 seconds. Keep this tab open.</span>
        </div>
      ) : null}

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-charcoal/55">MAPS generates only for the selected grades. Requests that fail the template, privacy, timing, or standards-preservation checks are not saved.</p>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60">
          {pending ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : null}
          {pending ? "Building rotation plan…" : "Generate rotation plan"}
        </button>
      </div>
    </form>
  );
}
