import type { TimelineEntry } from "@/lib/data/about";
import { AnimatedSection } from "@/components/shared/animated-section";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="flex flex-col gap-10">
      {entries.map((entry, i) => (
        <AnimatedSection
          key={entry.title}
          delay={i * 0.08}
          className="relative flex gap-6 border-l-2 border-ink/10 pl-8"
        >
          <span className="absolute -left-2.25 top-1 size-4 rounded-full border-2 border-white bg-brand-orange" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange-dark">
              {entry.year}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
              {entry.title}
            </h3>
            <p className="mt-2 text-charcoal/70">{entry.description}</p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
