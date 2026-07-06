import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-charcoal/40 outline-none transition-colors selection:bg-brand-orange selection:text-white focus-visible:border-ink disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
