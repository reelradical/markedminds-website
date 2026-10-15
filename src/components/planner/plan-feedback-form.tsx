"use client";

import { useActionState } from "react";

import {
  initialPlanFeedbackActionState,
  planFeedbackResponses,
  type PlanFeedbackActionState,
  type SavedPlanFeedback,
} from "@/lib/planner/feedback-contract";

type PlanFeedbackFormProps = {
  action: (
    state: PlanFeedbackActionState,
    formData: FormData,
  ) => Promise<PlanFeedbackActionState>;
  initialFeedback: SavedPlanFeedback | null;
};

export function PlanFeedbackForm({ action, initialFeedback }: PlanFeedbackFormProps) {
  const [state, formAction, pending] = useActionState(action, initialPlanFeedbackActionState);

  return (
    <form action={formAction} aria-busy={pending} className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-dark">
          Private beta feedback
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          Could you teach this tomorrow?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/60">
          A quick answer helps MAPS improve the planning experience. Your response applies only to this revision.
        </p>
      </div>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error"
            ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
            : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"}
        >
          {state.message}
        </p>
      ) : null}

      <fieldset>
        <legend className="sr-only">Could you teach this tomorrow?</legend>
        <div className="grid grid-cols-3 gap-3 sm:max-w-md">
          {planFeedbackResponses.map((option) => (
            <label
              key={option.value}
              className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5"
            >
              <input
                type="radio"
                name="response"
                value={option.value}
                required
                defaultChecked={initialFeedback?.response === option.value}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {state.fieldErrors.response ? (
          <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.response}</p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="feedback-comment" className="text-sm font-semibold text-ink">
          What would make this more teachable? <span className="font-normal text-charcoal/45">(optional)</span>
        </label>
        <textarea
          id="feedback-comment"
          name="comment"
          rows={3}
          maxLength={500}
          defaultValue={initialFeedback?.comment ?? ""}
          aria-describedby="feedback-comment-privacy"
          className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          placeholder="Example: The pacing works, but I would simplify the closing reflection."
        />
        <p id="feedback-comment-privacy" className="mt-2 text-xs leading-5 text-charcoal/50">
          Keep feedback about the plan. Do not include student names, IDs, diagnoses, medical details, or copied records.
        </p>
        {state.fieldErrors.comment ? (
          <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.comment}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving feedback…" : initialFeedback || state.status === "success" ? "Update feedback" : "Save feedback"}
      </button>
    </form>
  );
}
