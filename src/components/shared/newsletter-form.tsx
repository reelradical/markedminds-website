"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 text-sm text-white/80">
        <Check className="size-4 text-brand-orange" aria-hidden="true" />
        You&apos;re on the list. Thank you for staying connected.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/60"
      />
      <Button
        type="submit"
        variant="inverse"
        size="icon"
        disabled={status === "loading"}
        aria-label="Sign up for the newsletter"
      >
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
