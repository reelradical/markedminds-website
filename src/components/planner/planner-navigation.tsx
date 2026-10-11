"use client";

import Link from "next/link";
import { CalendarPlus, Home, Library, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { key: "home", label: "Home", icon: Home, href: "/planner" },
  { key: "new", label: "New plan", icon: CalendarPlus, href: "/planner/plans/new/tomorrow" },
  { key: "saved", label: "Saved", icon: Library, href: "/planner/plans" },
  { key: "settings", label: "Settings", icon: Settings, href: "/settings/profile" },
] as const;

type PlannerNavigationItem = "home" | "new" | "saved" | "settings" | null;

function useActiveItem(): PlannerNavigationItem {
  const pathname = usePathname();
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.includes("/plans/new")) return "new";
  if (pathname.includes("/plans")) return "saved";
  if (pathname === "/planner" || pathname === "/") return "home";
  return null;
}

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
  const activeItem = useActiveItem();
  return (
    <nav aria-label="MAPS" className="mt-10 flex flex-col gap-2">
      {navItems.map(({ key, label, icon: Icon, href }) => {
        const className =
          key === activeItem
            ? "flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white"
            : href
              ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal/65 hover:bg-mist hover:text-ink"
              : "flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal/35";
        const content = <><Icon className="size-4" aria-hidden="true" />{label}</>;

        return href ? <Link key={key} href={href} className={className}>{content}</Link> : (
          <div key={key} aria-disabled="true" className={className}>{content}</div>
        );
      })}
    </nav>
  );
}

export function PlannerMobileNavigation() {
  const activeItem = useActiveItem();
  return (
    <nav
      aria-label="MAPS"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
    >
      {navItems.map(({ key, label, icon: Icon, href }) => {
        const active = key === activeItem;
        const className = active
          ? "flex flex-col items-center gap-1 text-xs font-medium text-ink"
          : href
            ? "flex flex-col items-center gap-1 text-xs font-medium text-charcoal/55"
            : "flex cursor-not-allowed flex-col items-center gap-1 text-xs font-medium text-charcoal/30";
        const content = <><span className={active ? "rounded-lg bg-brand-orange/15 p-2" : "p-2"}><Icon className="size-5" aria-hidden="true" /></span>{label}</>;

        return href ? <Link key={key} href={href} className={className}>{content}</Link> : (
          <div key={key} aria-disabled="true" className={className}>{content}</div>
        );
      })}
    </nav>
  );
}
