import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/lib/data/academy";

export function SessionCard({ session }: { session: Session }) {
  const isCurrent = session.status === "current";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-8",
        isCurrent
          ? "border-academy-purple/30 bg-academy-purple/5"
          : "border-ink/8 bg-white",
      )}
    >
      <Badge variant={isCurrent ? "academy" : "outline"} className="w-fit">
        {isCurrent ? "Enrolling Now" : "Coming Soon"}
      </Badge>
      <h3 className="text-xl font-semibold tracking-tight text-ink">
        {session.name}
      </h3>
      <p className="text-charcoal/70">{session.description}</p>
    </div>
  );
}
