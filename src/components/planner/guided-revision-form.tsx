"use client";

import { useActionState } from "react";

import {
  guidedRevisionIntents,
  initialGuidedRevisionActionState,
  type GuidedRevisionActionState,
} from "@/lib/planner/plan-contract";

type GuidedRevisionFormProps = {
  action: (
    state: GuidedRevisionActionState,
    formData: FormData,
  ) => Promise<GuidedRevisionActionState>;
  branchingFromEarlierRevision: boolean;
};

export function GuidedRevisionForm({
  action,
  branchingFromEarlierRevision,
}: GuidedRevisionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialGuidedRevisionActionState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Revise this plan
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
          Choose the mismatch that matters most. MAPS will keep the original goal,
          instructional time, and classroom constraints while creating a new saved version.
        </p>
        {branchingFromEarlierRevision ? (
          <p className="mt-3 rounded-xl border border-brand-orange/25 bg-brand-orange/5 px-4 py-3 text-sm leading-6 text-charcoal/70">
            You are revising an earlier version. The new revision will branch from this version;
            later versions will remain unchanged.
          </p>
        ) : null}
      </div>

      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">
          {state.message}
        </div>
      ) : null}

      <fieldset>
        <legend className="text-sm font-semibold text-ink">What should improve?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {guidedRevisionIntents.map((intent, index) => (
            <label key={intent.value} className="flex cursor-pointer gap-3 rounded-2xl border border-ink/10 p-4 transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input
                type="radio"
                name="intent"
                value={intent.value}
                required
                defaultChecked={index === 0}
                className="mt-1 size-4 shrink-0 accent-[var(--color-brand-orange)]"
              />
              <span>
                <span className="block font-semibold text-ink">{intent.label}</span>
                <span className="mt-1 block text-sm leading-5 text-charcoal/60">{intent.description}</span>
              </span>
            </label>
          ))}
        </div>
        {state.fieldErrors.intent ? <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.intent}</p> : null}
      </fieldset>

      <div>
        <label htmlFor="teacher_direction" className="text-sm font-semibold text-ink">
          What specifically feels wrong? <span className="font-normal text-charcoal/45">(optional)</span>
        </label>
        <textarea
          id="teacher_direction"
          name="teacher_direction"
          rows={4}
          maxLength={600}
          placeholder="Example: Give grades 4–5 a more independent task and a stronger reflection prompt."
          aria-describedby="revision-direction-helper"
          className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
        />
        <p id="revision-direction-helper" className="mt-2 text-sm leading-6 text-charcoal/55">
          Describe groups, not individual students. Do not include names, IDs, diagnoses,
          medical details, or text copied from an IEP or 504 plan.
        </p>
        {state.fieldErrors.teacherDirection ? <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.teacherDirection}</p> : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-ink/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-charcoal/55">
          The current and earlier versions remain available. A failed revision never replaces them.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Revising your plan…" : "Create revision"}
        </button>
      </div>
    </form>
  );
}
