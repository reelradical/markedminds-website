import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/data/academy";

const statusConfig = {
  completed: { label: "Completed", badge: "outline" as const, card: "border-ink/8 bg-white" },
  upcoming: {
    label: "Preparing to Launch",
    badge: "academy" as const,
    card: "border-academy-purple/30 bg-academy-purple/5",
  },
  postponed: { label: "Postponed", badge: "outline" as const, card: "border-ink/8 bg-mist/60" },
};

export function SessionCard({ session }: { session: Session }) {
  const { label, badge, card } = statusConfig[session.status];

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border p-8", card)}>
      <Badge variant={badge} className="w-fit">
        {label}
      </Badge>
      <h3 className="text-xl font-semibold tracking-tight text-ink">
        {session.name}
      </h3>
      <p className="text-charcoal/70">{session.description}</p>
      {(session.registrationUrl || session.depositUrl) && (
        <div className="mt-2 flex flex-wrap gap-3">
          {session.registrationUrl && (
            <Button asChild variant="academy" className="w-fit">
              <a href={session.registrationUrl} target="_blank" rel="noopener noreferrer">
                Register for Session II
                <ArrowRight className="size-4" />
              </a>
            </Button>
          )}
          {session.depositUrl && (
            <Button asChild variant="academy-outline" className="w-fit">
              <a href={session.depositUrl} target="_blank" rel="noopener noreferrer">
                Pay Session II Deposit
                <ArrowRight className="size-4" />
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
