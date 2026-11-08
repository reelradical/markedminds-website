"use client";

import { useActionState } from "react";

import {
  creatorRevisionIntents,
  initialCreatorRevisionActionState,
  type CreatorRevisionActionState,
} from "@/lib/planner/creator-lesson-contract";

type CreatorRevisionFormProps = {
  action: (
    state: CreatorRevisionActionState,
    formData: FormData,
  ) => Promise<CreatorRevisionActionState>;
  branchingFromEarlierRevision: boolean;
};

export function CreatorRevisionForm({ action, branchingFromEarlierRevision }: CreatorRevisionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialCreatorRevisionActionState);

  return (
    <form action={formAction} aria-busy={pending} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Revise this creator lesson</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">Create a complete new version while preserving the audience, learning outcome, video duration, and source context.</p>
        {branchingFromEarlierRevision ? <p className="mt-3 rounded-xl border border-brand-orange/25 bg-brand-orange/5 px-4 py-3 text-sm leading-6 text-charcoal/70">You are revising an earlier version. The new revision will branch from this version; later versions remain unchanged.</p> : null}
      </div>
      {state.status === "error" ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">{state.message}</div> : null}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">What should improve?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {creatorRevisionIntents.map((intent, index) => (
            <label key={intent.value} className="flex cursor-pointer gap-3 rounded-2xl border border-ink/10 p-4 transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5">
              <input type="radio" name="intent" value={intent.value} required defaultChecked={index === 0} className="mt-1 size-4 shrink-0 accent-[var(--color-brand-orange)]" />
              <span><span className="block font-semibold text-ink">{intent.label}</span><span className="mt-1 block text-sm leading-5 text-charcoal/60">{intent.description}</span></span>
            </label>
          ))}
        </div>
        {state.fieldErrors.intent ? <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.intent}</p> : null}
      </fieldset>
      <div>
        <label htmlFor="creator_direction" className="text-sm font-semibold text-ink">Specific direction <span className="font-normal text-charcoal/45">(optional)</span></label>
        <textarea id="creator_direction" name="creator_direction" rows={4} maxLength={800} placeholder="Example: Assume the audience already understands prompting basics and spend more time on evaluating output quality." className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-charcoal/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20" />
        <p className="mt-2 text-sm leading-6 text-charcoal/55">Describe the lesson change without adding private student or client information.</p>
        {state.fieldErrors.creatorDirection ? <p role="alert" className="mt-2 text-sm text-red-700">{state.fieldErrors.creatorDirection}</p> : null}
      </div>
      {pending ? <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-5 py-4 text-sm leading-6 text-charcoal/70"><span aria-hidden="true" className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-brand-orange/25 border-t-brand-orange" /><span><strong className="text-ink">MAPS is drafting a new creator revision.</strong> This usually takes 15–30 seconds. Your current plan and every earlier version remain safely available.</span></div> : null}
      <div className="flex flex-col gap-3 border-t border-ink/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-charcoal/55">A failed revision never replaces a saved version.</p>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60">{pending ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : null}{pending ? "Revising your lesson…" : "Create revision"}</button>
      </div>
    </form>
  );
}
