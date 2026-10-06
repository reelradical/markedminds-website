"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/shared/honeypot-field";
import { site } from "@/lib/data/site";
import { trackEvent } from "@/lib/analytics";

const workModes = ["Remote", "Atlanta-area hybrid", "Hybrid elsewhere", "On-site", "Open to more than one"];

export function FoundingPilotForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/ruthless-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent("ruthless_scout_founding_pilot_apply", { offer: "founding-transition-sprint" });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-orange/30 bg-white p-8 text-center shadow-sm sm:p-10">
        <CheckCircle2 className="mx-auto size-12 text-brand-orange-dark" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          Your request is in.
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-7 text-charcoal/70">
          Marked Minds will review your submission and respond within two business days. If the founding pilot is a fit and space remains, your reply will include the secure Square payment link and full intake.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-first-name">First name</Label>
        <Input id="scout-first-name" name="firstName" required autoComplete="given-name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-last-name">Last name</Label>
        <Input id="scout-last-name" name="lastName" required autoComplete="family-name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-email">Email</Label>
        <Input id="scout-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-current-role">Current role or field</Label>
        <Input id="scout-current-role" name="currentRole" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-compensation-floor">Minimum compensation</Label>
        <Input
          id="scout-compensation-floor"
          name="compensationFloor"
          placeholder="Example: $85,000"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-location">Location or geographic limits</Label>
        <Input id="scout-location" name="location" placeholder="Example: Atlanta or remote U.S." required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-work-mode">Preferred work mode</Label>
        <select
          id="scout-work-mode"
          name="workMode"
          required
          defaultValue=""
          className="flex h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus-visible:border-ink"
        >
          <option value="" disabled>Select one</option>
          {workModes.map((mode) => <option key={mode}>{mode}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="scout-travel-limit">Maximum travel</Label>
        <Input id="scout-travel-limit" name="travelLimit" placeholder="Example: 15%" required />
      </div>
      <div className="col-span-full flex flex-col gap-2">
        <Label htmlFor="scout-desired-shift">What are you trying to move toward?</Label>
        <Textarea
          id="scout-desired-shift"
          name="desiredShift"
          rows={4}
          required
          placeholder="Tell us about the work, impact, flexibility, or life you want next."
        />
      </div>
      <div className="col-span-full flex flex-col gap-2">
        <Label htmlFor="scout-why-now">Why now?</Label>
        <Textarea
          id="scout-why-now"
          name="whyNow"
          rows={4}
          required
          placeholder="What changed—or what can no longer stay the same?"
        />
      </div>
      <HoneypotField />
      <label className="col-span-full flex items-start gap-3 rounded-xl bg-mist p-4 text-sm leading-6 text-charcoal/75">
        <input name="acknowledgement" type="checkbox" value="accepted" required className="mt-1 size-4 accent-orange-600" />
        <span>
          I understand this is a career-research and decision-support service, not a job guarantee, employment agency, or application service. I will not submit Social Security numbers, medical records, financial account information, or other highly sensitive data.
        </span>
      </label>
      {status === "error" && (
        <p className="col-span-full text-sm text-red-700">
          We couldn&apos;t record your request. Please try again or email {site.email} with “Ruthless Scout” in the subject line.
        </p>
      )}
      <div className="col-span-full">
        <Button type="submit" size="lg" variant="orange" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Apply for Founding Access
        </Button>
        <p className="mt-3 text-xs leading-5 text-charcoal/55">
          Applying does not charge you. Selected participants receive a secure Square payment link before work begins.
        </p>
      </div>
    </form>
  );
}
