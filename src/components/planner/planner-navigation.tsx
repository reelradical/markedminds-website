import Link from "next/link";
import { CalendarPlus, Home, Library, Settings } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "New plan", icon: CalendarPlus, active: false },
  { label: "Saved", icon: Library, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function PlannerBrand() {
  return (
    <Link href="/planner" className="inline-flex items-center gap-3 text-ink">
      <span className="flex size-9 items-center justify-center rounded-xl bg-ink font-display text-sm font-semibold text-white">
        M
      </span>
      <span>
        <span className="block font-display text-lg font-semibold leading-tight">MAPS</span>
        <span className="block text-xs font-medium uppercase tracking-[0.16em] text-charcoal/45">by Marked Minds</span>
      </span>
    </Link>
  );
}

export function PlannerDesktopNavigation() {
  return (
    <nav aria-label="MAPS" className="mt-10 flex flex-col gap-2">
      {navItems.map(({ label, icon: Icon, active }) => (
        <div
          key={label}
          aria-disabled={!active}
          className={
            active
              ? "flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white"
              : "flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal/35"
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </div>
      ))}
    </nav>
  );
}

export function PlannerMobileNavigation() {
  return (
    <nav
      aria-label="MAPS"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
    >
      {navItems.map(({ label, icon: Icon, active }) => (
        <div
          key={label}
          aria-disabled={!active}
          className={
            active
              ? "flex flex-col items-center gap-1 text-xs font-medium text-ink"
              : "flex cursor-not-allowed flex-col items-center gap-1 text-xs font-medium text-charcoal/30"
          }
        >
          <span className={active ? "rounded-lg bg-brand-orange/15 p-2" : "p-2"}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          {label}
        </div>
      ))}
    </nav>
  );
}
