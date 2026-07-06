import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Initiative } from "@/lib/data/initiatives";
import { Badge } from "@/components/ui/badge";

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const isLive = initiative.status === "live";

  const inner = (
    <div className="group flex h-full flex-col gap-4 rounded-2xl border border-ink/8 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline">{initiative.eyebrow}</Badge>
        <Badge variant={isLive ? "orange" : "default"}>
          {isLive ? "Live" : initiative.status === "planned" ? "In Development" : "Coming Soon"}
        </Badge>
      </div>
      <div>
        <h3 className="flex items-center gap-1.5 text-xl font-semibold tracking-tight text-ink">
          {initiative.name}
          {isLive && (
            <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-orange-dark">
          {initiative.tagline}
        </p>
        <p className="mt-3 text-sm leading-6 text-charcoal/70">
          {initiative.description}
        </p>
      </div>
    </div>
  );

  if (initiative.href) {
    return (
      <Link href={initiative.href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}
