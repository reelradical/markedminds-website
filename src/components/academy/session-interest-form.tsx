"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/data/site";

export function SessionInterestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/focus-flex-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="flex items-center justify-center gap-2 text-sm font-medium text-ink">
        <Check className="size-4 text-academy-purple" aria-hidden="true" />
        You&apos;re on the list. We&apos;ll be in touch when enrollment reopens.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-center"
    >
      <div className="flex flex-1 flex-col gap-2 text-left sm:max-w-xs">
        <Label htmlFor="interest-name">Name (optional)</Label>
        <Input id="interest-name" name="name" autoComplete="name" />
      </div>
      <div className="flex flex-1 flex-col gap-2 text-left sm:max-w-xs">
        <Label htmlFor="interest-email">Email</Label>
        <Input
          id="interest-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <Button type="submit" variant="academy" disabled={status === "loading"} className="shrink-0">
        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Join the Interest List
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:basis-full">
          Something went wrong. Please email us directly at {site.email}.
        </p>
      )}
    </form>
  );
}
