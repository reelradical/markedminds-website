"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { Campaign } from "@/lib/data/campaigns";

// Free lead-magnet email capture. Note: this records the request the same
// way the general contact form does (server-side log, no email provider
// wired yet) — see the pre-publish checklist. Copy is intentionally worded
// to not promise automated/immediate delivery.
export function StarterKitForm({ campaign }: { campaign: Campaign }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/campaign-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent(`${campaign.slug}_starter_kit_submit`, {
        campaign: campaign.analytics.campaign,
      });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="flex items-center justify-center gap-2 text-sm font-medium text-white">
        <Check className="size-4 text-brand-orange" aria-hidden="true" />
        Thank you! Your AI Classroom Starter Kit request has been received.
      </p>
    );
  }

  // Rendered on a dark (bg-ink) section — Label/Input/Button need explicit
  // light-on-dark treatment; the shared UI primitives default to dark text
  // on a white field, which is unreadable here.
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex flex-1 flex-col gap-2 text-left">
        <Label htmlFor="starter-kit-name" className="text-white/80">
          First name
        </Label>
        <Input
          id="starter-kit-name"
          name="firstName"
          required
          autoComplete="given-name"
          className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/60"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 text-left">
        <Label htmlFor="starter-kit-email" className="text-white/80">
          Email
        </Label>
        <Input
          id="starter-kit-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/60"
        />
      </div>
      <input type="hidden" name="campaign" value={campaign.analytics.campaign} />
      <input type="hidden" name="source" value={campaign.analytics.source} />
      <Button type="submit" variant="orange" disabled={status === "loading"} className="shrink-0">
        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Get the Free Starter Kit
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-400 sm:basis-full">
          Something went wrong. Please email us directly at markedminds@gmail.com.
        </p>
      )}
    </form>
  );
}
