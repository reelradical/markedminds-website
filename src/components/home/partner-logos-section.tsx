import Link from "next/link";

import { partners } from "@/lib/data/partners";
import { SectionHeading } from "@/components/shared/section-heading";

export function PartnerLogosSection() {
  return (
    <section className="border-y border-ink/8 bg-mist py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Organizations & Collaborations"
          title="Trusted By, Built With, and Connected Through"
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-10 gap-y-6">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center">
              <span
                className={
                  partner.placeholder
                    ? "text-sm italic tracking-tight text-charcoal/40"
                    : "text-sm font-semibold tracking-tight text-charcoal/60 transition-colors hover:text-ink"
                }
              >
                {partner.name}
              </span>
              {partner.note && (
                <span className="mt-0.5 text-[11px] uppercase tracking-wide text-charcoal/40">
                  {partner.note}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/partners"
            className="text-sm font-medium text-brand-orange-dark underline underline-offset-4"
          >
            View all partners
          </Link>
        </div>
      </div>
    </section>
  );
}
