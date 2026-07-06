import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { iconMap } from "@/lib/icon-map";
import type { Program } from "@/lib/data/programs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProgramCard({ program }: { program: Program }) {
  const Icon = iconMap[program.icon];
  const isCurrent = program.status === "current";

  const content = (
    <div
      className={cn(
        "group flex h-full flex-col gap-5 rounded-2xl border p-8 transition-all",
        isCurrent
          ? "border-ink/10 bg-ink text-white hover:-translate-y-1 hover:shadow-lg"
          : "border-ink/8 bg-white hover:-translate-y-1 hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            isCurrent ? "bg-white/10 text-brand-orange" : "bg-mist text-ink",
          )}
        >
          <Icon className="size-6" />
        </div>
        <Badge variant={isCurrent ? "orange" : "outline"} className={isCurrent ? "" : undefined}>
          {isCurrent ? "Current" : "Coming Soon"}
        </Badge>
      </div>
      <div>
        <h3
          className={cn(
            "flex items-center gap-1.5 text-xl font-semibold tracking-tight",
            isCurrent ? "text-white" : "text-ink",
          )}
        >
          {program.name}
          {program.href && (
            <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-6",
            isCurrent ? "text-white/70" : "text-charcoal/70",
          )}
        >
          {program.description}
        </p>
      </div>
    </div>
  );

  if (program.href) {
    return (
      <Link href={program.href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
