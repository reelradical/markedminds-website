"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const inquiryTypes = [
  "Parent or Family",
  "Prospective Student",
  "Workshop or Training Booking",
  "Creative Production Client",
  "School Leader",
  "Community Organization",
  "Sponsor or Donor",
  "Media",
  "Other",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink/8 bg-mist p-10 text-center">
        <CheckCircle2 className="size-10 text-brand-orange" />
        <h3 className="text-xl font-semibold text-ink">Message sent</h3>
        <p className="max-w-sm text-sm text-charcoal/70">
          Thank you for reaching out. A member of the Marked Minds team will
          respond within two business days.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="organization">Organization (optional)</Label>
        <Input id="organization" name="organization" autoComplete="organization" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="inquiryType">I am a...</Label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          defaultValue=""
          className="flex h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus-visible:border-ink"
        >
          <option value="" disabled>
            Select one
          </option>
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-full flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} />
      </div>
      {status === "error" && (
        <p className="col-span-full text-sm text-red-600">
          Something went wrong sending your message. Please email us directly
          at markedminds@gmail.com.
        </p>
      )}
      <div className="col-span-full">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="size-4 animate-spin" />}
          Send Message
        </Button>
      </div>
    </form>
  );
}
