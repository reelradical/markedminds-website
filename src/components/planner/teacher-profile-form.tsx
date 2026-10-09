"use client";

import { useActionState } from "react";

import { initialProfileActionState, type ProfileActionState } from "@/lib/planner/profile-action-state";
import {
  differentiationOptions,
  gradeLevelOptions,
  lowPrepOptions,
  movementOptions,
  planDetailOptions,
  subjectAreaOptions,
  teacherRoleOptions,
  transitionCleanupOptions,
  type TeacherProfileInput,
} from "@/lib/planner/profile-options";

type TeacherProfileFormProps = {
  action: (state: ProfileActionState, formData: FormData) => Promise<ProfileActionState>;
  initialValues: TeacherProfileInput;
  profileVersion?: string;
  submitLabel: string;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";
const labelClassName = "text-sm font-semibold text-ink";
const helperClassName = "mt-2 text-sm leading-6 text-charcoal/55";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-2 text-sm text-red-700">
      {message}
    </p>
  ) : null;
}

export function TeacherProfileForm({ action, initialValues, profileVersion, submitLabel }: TeacherProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialProfileActionState);

  return (
    <form action={formAction} className="space-y-8">
      {profileVersion ? <input type="hidden" name="profile_version" value={profileVersion} /> : null}

      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">
          {state.message}
        </div>
      ) : null}

      <section aria-labelledby="profile-basics" className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="profile-basics" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Your teaching context
        </h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">
          These defaults help MAPS remember the classroom conditions you usually plan around.
        </p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="display_name" className={labelClassName}>Display name</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              defaultValue={initialValues.displayName}
              aria-describedby={state.fieldErrors.displayName ? "display-name-error" : undefined}
              className={inputClassName}
            />
            <FieldError id="display-name-error" message={state.fieldErrors.displayName} />
          </div>

          <div>
            <label htmlFor="role" className={labelClassName}>Role</label>
            <select
              id="role"
              name="role"
              required
              defaultValue={initialValues.role}
              aria-describedby={state.fieldErrors.role ? "role-error" : undefined}
              className={inputClassName}
            >
              {teacherRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <FieldError id="role-error" message={state.fieldErrors.role} />
          </div>
        </div>

        <fieldset className="mt-7">
          <legend className={labelClassName}>Subject or content areas</legend>
          <p className={helperClassName}>Choose up to five.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {subjectAreaOptions.map((option) => (
              <label key={option.value} className="flex min-h-11 items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  name="subject_areas"
                  value={option.value}
                  defaultChecked={initialValues.subjectAreas.includes(option.value)}
                  className="size-4 accent-[var(--color-brand-orange)]"
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError id="subject-areas-error" message={state.fieldErrors.subjectAreas} />
        </fieldset>

        <fieldset className="mt-7">
          <legend className={labelClassName}>Grade levels</legend>
          <p className={helperClassName}>Choose every grade you regularly teach.</p>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
            {gradeLevelOptions.map((grade) => (
              <label key={grade} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 px-3 py-2 text-sm font-medium text-charcoal/80">
                <input
                  type="checkbox"
                  name="grade_levels"
                  value={grade}
                  defaultChecked={initialValues.gradeLevels.includes(grade)}
                  className="size-4 accent-[var(--color-brand-orange)]"
                />
                {grade}
              </label>
            ))}
          </div>
          <FieldError id="grade-levels-error" message={state.fieldErrors.gradeLevels} />
        </fieldset>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="typical_class_duration_minutes" className={labelClassName}>Typical class duration</label>
            <div className="relative">
              <input
                id="typical_class_duration_minutes"
                name="typical_class_duration_minutes"
                type="number"
                required
                min={10}
                max={240}
                defaultValue={initialValues.typicalClassDurationMinutes}
                aria-describedby={state.fieldErrors.typicalClassDurationMinutes ? "duration-error" : "duration-helper"}
                className={`${inputClassName} pr-20`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 top-2 flex items-center text-sm text-charcoal/45">minutes</span>
            </div>
            <p id="duration-helper" className={helperClassName}>Use the instructional block you most often plan for.</p>
            <FieldError id="duration-error" message={state.fieldErrors.typicalClassDurationMinutes} />
          </div>

          <div>
            <label htmlFor="typical_class_size" className={labelClassName}>Typical class size <span className="font-normal text-charcoal/45">(optional)</span></label>
            <input
              id="typical_class_size"
              name="typical_class_size"
              type="number"
              min={1}
              max={100}
              defaultValue={initialValues.typicalClassSize ?? ""}
              aria-describedby={state.fieldErrors.typicalClassSize ? "class-size-error" : undefined}
              className={inputClassName}
            />
            <FieldError id="class-size-error" message={state.fieldErrors.typicalClassSize} />
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="common_materials" className={labelClassName}>Common materials <span className="font-normal text-charcoal/45">(optional)</span></label>
          <input
            id="common_materials"
            name="common_materials"
            type="text"
            maxLength={1000}
            defaultValue={initialValues.commonMaterials.join(", ")}
            placeholder="Chromebooks, chart paper, markers"
            aria-describedby={state.fieldErrors.commonMaterials ? "materials-error" : "materials-helper"}
            className={inputClassName}
          />
          <p id="materials-helper" className={helperClassName}>Separate materials with commas.</p>
          <FieldError id="materials-error" message={state.fieldErrors.commonMaterials} />
        </div>

        <div className="mt-7">
          <label htmlFor="teaching_context_notes" className={labelClassName}>Teaching-context notes <span className="font-normal text-charcoal/45">(optional)</span></label>
          <textarea
            id="teaching_context_notes"
            name="teaching_context_notes"
            rows={5}
            maxLength={1000}
            defaultValue={initialValues.teachingContextNotes ?? ""}
            aria-describedby={state.fieldErrors.teachingContextNotes ? "context-error context-privacy" : "context-privacy"}
            className={inputClassName}
          />
          <p id="context-privacy" className={helperClassName}>
            Describe your teaching context without including student names, IDs, diagnoses, medical information, or text copied from IEPs or 504 plans.
          </p>
          <FieldError id="context-error" message={state.fieldErrors.teachingContextNotes} />
        </div>
      </section>

      <details className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <summary className="cursor-pointer font-display text-xl font-semibold tracking-tight text-ink">Planning preferences</summary>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">Optional defaults. You can change these later.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[
            ["plan_detail_preference", "Plan detail", planDetailOptions, initialValues.planDetailPreference],
            ["transition_cleanup_preference", "Transitions and cleanup", transitionCleanupOptions, initialValues.transitionCleanupPreference],
            ["low_prep_preference", "Prep burden", lowPrepOptions, initialValues.lowPrepPreference],
            ["movement_preference", "Movement", movementOptions, initialValues.movementPreference],
            ["differentiation_preference", "Differentiation", differentiationOptions, initialValues.differentiationPreference],
          ].map(([name, label, options, defaultValue]) => (
            <div key={name as string}>
              <label htmlFor={name as string} className={labelClassName}>{label as string}</label>
              <select id={name as string} name={name as string} defaultValue={defaultValue as string} className={inputClassName}>
                {(options as readonly { value: string; label: string }[]).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <FieldError id="preferences-error" message={state.fieldErrors.preferences} />
      </details>

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm leading-6 text-charcoal/55">Your defaults stay private to your authenticated MAPS account.</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
