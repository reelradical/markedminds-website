import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  PlannerBrand,
  PlannerDesktopNavigation,
  PlannerMobileNavigation,
} from "@/components/planner/planner-navigation";
import { site } from "@/lib/data/site";

export function PlannerAppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="flex h-20 items-center justify-between border-b border-ink/8 bg-white px-5 md:hidden">
        <div className="flex items-center gap-3">
          <PlannerBrand />
          <BetaBadge />
        </div>
        <Link href={`${site.url}/plan`} className="text-sm font-medium text-charcoal/60">About</Link>
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/8 bg-white p-6 md:flex md:flex-col">
        <div className="flex items-start justify-between gap-3">
          <PlannerBrand />
          <BetaBadge />
        </div>
        <PlannerDesktopNavigation />
        <div className="mt-auto rounded-2xl bg-mist p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">Private beta</p>
          <p className="mt-2 text-sm leading-5 text-charcoal/70">MAPS is being tested with a small group of teachers. Your feedback improves the planning experience.</p>
          <Link href={`${site.url}/plan`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink">
            About MAPS
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <main id="main-content" className="pb-28 md:ml-64 md:pb-0">{children}</main>
      <PlannerMobileNavigation />
    </div>
  );
}

function BetaBadge() {
  return (
    <span className="shrink-0 rounded-full border border-brand-orange/25 bg-brand-orange/8 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-brand-orange-dark">
      Private beta
    </span>
  );
}
