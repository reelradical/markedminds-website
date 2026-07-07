import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/data/academy";

export function SessionCard({ session }: { session: Session }) {
  const isUpcoming = session.status === "upcoming";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-8",
        isUpcoming
          ? "border-academy-purple/30 bg-academy-purple/5"
          : "border-ink/8 bg-white",
      )}
    >
      <Badge variant={isUpcoming ? "academy" : "outline"} className="w-fit">
        {isUpcoming ? "Preparing to Launch" : "Completed"}
      </Badge>
      <h3 className="text-xl font-semibold tracking-tight text-ink">
        {session.name}
      </h3>
      <p className="text-charcoal/70">{session.description}</p>
      {session.registrationUrl && (
        <Button asChild variant="academy" className="mt-2 w-fit">
          <a href={session.registrationUrl} target="_blank" rel="noopener noreferrer">
            Register for Session II
            <ArrowRight className="size-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
