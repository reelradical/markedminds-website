"use client";

import { useId, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { serviceSelectOptions } from "@/lib/data/campaign-content";
import { formatOfferExpiration, type Campaign } from "@/lib/data/campaigns";

const roleOptions = [
  "Early childhood educator",
  "Elementary educator",
  "Middle school educator",
  "High school educator",
  "College educator",
  "School administrator",
  "Instructional coach / specialist",
  "Student support",
  "Program or enrichment leader",
  "Other",
];

const formatOptions = ["Virtual", "In-person", "No preference"];

const selectClassName =
  "flex h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-colors focus-visible:border-ink";

export function CampaignInquiryForm({
  campaign,
  selectedService,
  onServiceChange,
}: {
  campaign: Campaign;
  selectedService: string;
  onServiceChange: (value: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [hasStarted, setHasStarted] = useState(false);
  const formId = useId();

  function handleFirstInteraction() {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent(`${campaign.slug}_form_start`, {
      campaign: campaign.analytics.campaign,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/campaign-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent(`${campaign.slug}_form_submit`, {
        campaign: campaign.analytics.campaign,
        service: selectedService,
      });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink/8 bg-mist p-10 text-center">
        <CheckCircle2 className="size-10 text-brand-orange" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-ink">Request received</h3>
        <p className="max-w-md text-sm text-charcoal/70">
          Thank you for connecting with Marked Minds. Your {campaign.partnerName}{" "}
          conference offer has been recorded.
        </p>
        <p className="max-w-md text-sm font-medium text-ink">
          Dani will personally review your request and follow up by email.
          Fixed-price sessions may include a direct Square booking link;
          custom or team requests will be scoped with you first. Your{" "}
          {campaign.offer.code} benefit ({campaign.offer.discountPercent}% off
          fixed-price services, or a complimentary strategy consultation for
          custom requests){" "}
          {formatOfferExpiration(campaign.offer)
            ? `is valid through ${formatOfferExpiration(campaign.offer)}.`
            : "has been recorded."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={handleFirstInteraction}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-firstName`}>First name</Label>
        <Input
          id={`${formId}-firstName`}
          name="firstName"
          required
          autoComplete="given-name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-lastName`}>Last name</Label>
        <Input
          id={`${formId}-lastName`}
          name="lastName"
          required
          autoComplete="family-name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-email`}>Email</Label>
        <Input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-org`}>School, organization, or program</Label>
        <Input id={`${formId}-org`} name="organization" required autoComplete="organization" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-role`}>Role</Label>
        <select
          id={`${formId}-role`}
          name="role"
          required
          defaultValue=""
          className={selectClassName}
        >
          <option value="" disabled>
            Select one
          </option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-grade`}>Grade level or age group served</Label>
        <Input
          id={`${formId}-grade`}
          name="gradeLevel"
          required
          placeholder="e.g. Rising 3rd–5th grade"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-service`}>Service of interest</Label>
        <select
          id={`${formId}-service`}
          name="service"
          required
          value={selectedService}
          onChange={(e) => {
            onServiceChange(e.target.value);
            trackEvent(`${campaign.slug}_service_select`, {
              service: e.target.value,
            });
          }}
          className={selectClassName}
        >
          <option value="" disabled>
            Select one
          </option>
          {serviceSelectOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-format`}>Preferred format</Label>
        <select
          id={`${formId}-format`}
          name="format"
          required
          defaultValue=""
          className={selectClassName}
        >
          <option value="" disabled>
            Select one
          </option>
          {formatOptions.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-full flex flex-col gap-2">
        <Label htmlFor={`${formId}-goal`}>Main challenge or goal</Label>
        <Textarea id={`${formId}-goal`} name="goal" required rows={4} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-timing`}>Preferred timing</Label>
        <Input
          id={`${formId}-timing`}
          name="timing"
          placeholder="e.g. Within the next 2 weeks"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-code`}>Conference eligibility code</Label>
        <Input
          id={`${formId}-code`}
          name="offerCode"
          defaultValue={campaign.offer.code}
          readOnly
          className="bg-mist text-charcoal/70"
        />
        <p className="text-xs leading-5 text-charcoal/50">
          This records your conference eligibility. For fixed-price
          services, you&apos;ll enter this code again at Square checkout.
          For custom or inquiry-based services, it&apos;s already included
          with this request.
        </p>
      </div>

      <input type="hidden" name="campaign" value={campaign.analytics.campaign} />
      <input type="hidden" name="source" value={campaign.analytics.source} />

      {status === "error" && (
        <p className="col-span-full text-sm text-red-600">
          Something went wrong sending your request. Please email us directly
          at markedminds@gmail.com.
        </p>
      )}
      <div className="col-span-full flex flex-col items-start gap-3">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Submit Request
        </Button>
        <p className="max-w-xl text-xs leading-5 text-charcoal/50">
          By submitting this form, you agree that Marked Minds may contact
          you about this request and related educator opportunities. Your
          information will not be sold.
        </p>
      </div>
    </form>
  );
}
