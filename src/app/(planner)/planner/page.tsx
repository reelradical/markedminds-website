import { AlertTriangle, CalendarDays, Clock3, SlidersHorizontal, Sparkles } from "lucide-react";

const planningModes = [
  {
    title: "Plan Tomorrow",
    description: "Turn tomorrow's objective and real classroom conditions into a workable plan.",
    status: "First workflow · coming next",
    icon: CalendarDays,
    featured: true,
  },
  {
    title: "Fix My Lesson",
    description: "Rework a lesson that needs a clearer path, better pacing, or a stronger backup plan.",
    status: "Planned",
    icon: SlidersHorizontal,
    featured: false,
  },
  {
    title: "Emergency Plan",
    description: "Shape a practical plan when time, preparation, or materials are limited.",
    status: "Planned",
    icon: AlertTriangle,
    featured: false,
  },
  {
    title: "Differentiate",
    description: "Explore ways to adjust access, support, and challenge within one lesson.",
    status: "Planned",
    icon: Sparkles,
    featured: false,
  },
];

export default function PlannerDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="flex flex-col gap-6 border-b border-ink/8 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">Planner dashboard</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            What do you need to plan?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">
            This preview establishes the future planning workspace. No planning mode is active yet.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-charcoal/60">
          <Clock3 className="size-4" aria-hidden="true" />
          Product preview
        </div>
      </div>

      <section aria-labelledby="planning-modes" className="py-10">
        <h2 id="planning-modes" className="sr-only">Planning modes</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {planningModes.map(({ title, description, status, icon: Icon, featured }) => (
            <article
              key={title}
              data-disabled="true"
              className={
                featured
                  ? "relative overflow-hidden rounded-2xl border border-brand-orange/35 bg-white p-6 shadow-sm sm:p-7"
                  : "rounded-2xl border border-ink/8 bg-white p-6 opacity-65 sm:p-7"
              }
            >
              {featured && <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-orange" />}
              <div className="flex items-start justify-between gap-5">
                <div className={featured ? "flex size-12 items-center justify-center rounded-xl bg-ink text-white" : "flex size-12 items-center justify-center rounded-xl bg-mist text-charcoal/50"}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <span className={featured ? "rounded-full bg-brand-orange/12 px-3 py-1 text-xs font-semibold text-brand-orange-dark" : "rounded-full bg-mist px-3 py-1 text-xs font-semibold text-charcoal/45"}>
                  {status}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-charcoal/65">{description}</p>
              <div className="mt-7 border-t border-ink/8 pt-4 text-sm font-medium text-charcoal/40">Not available in this preview</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
