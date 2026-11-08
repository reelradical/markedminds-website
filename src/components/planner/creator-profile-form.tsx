"use client";

import { useActionState } from "react";

import {
  initialProfileActionState,
  type ProfileActionState,
} from "@/lib/planner/profile-action-state";

type CreatorProfileFormProps = {
  action: (state: ProfileActionState, formData: FormData) => Promise<ProfileActionState>;
  displayName: string;
  profileVersion?: string;
  submitLabel: string;
};

export function CreatorProfileForm({
  action,
  displayName,
  profileVersion,
  submitLabel,
}: CreatorProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialProfileActionState);

  return (
    <form action={formAction} className="space-y-7">
      {profileVersion ? <input type="hidden" name="profile_version" value={profileVersion} /> : null}
      {state.status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800">
          {state.message}
        </div>
      ) : null}

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Your creator workspace</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/60">
          Creator lessons collect their audience, prior knowledge, outcome, and recording context with each plan. No school, grade, standards, or classroom defaults are required.
        </p>
        <div className="mt-7 max-w-xl">
          <label htmlFor="display_name" className="text-sm font-semibold text-ink">Display name</label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={displayName}
            aria-describedby={state.fieldErrors.displayName ? "creator-display-name-error" : undefined}
            className="mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
          {state.fieldErrors.displayName ? (
            <p id="creator-display-name-error" role="alert" className="mt-2 text-sm text-red-700">
              {state.fieldErrors.displayName}
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm leading-6 text-charcoal/55">Your account remains private to your authenticated MAPS session.</p>
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
