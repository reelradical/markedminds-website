import { partners } from "@/lib/data/partners";
import { SectionHeading } from "@/components/shared/section-heading";

export function PartnerLogosSection() {
  return (
    <section className="border-y border-ink/8 bg-mist py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trusted By"
          title="Schools, businesses, and organizations standing with us."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.slice(0, 8).map((partner) => (
            <span
              key={partner.name}
              className="text-sm font-semibold tracking-tight text-charcoal/50 transition-colors hover:text-ink"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
