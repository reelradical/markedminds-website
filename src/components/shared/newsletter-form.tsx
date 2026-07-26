"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/spam-guard";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [email, setEmail] = useState("");
  const renderedAtRef = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
          [RENDERED_AT_FIELD]: renderedAtRef.current,
        }),
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
      <div
        style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}
        aria-hidden="true"
      >
        <label htmlFor="newsletter-org-website">Leave this field blank</label>
        <input
          type="text"
          id="newsletter-org-website"
          ref={honeypotRef}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
