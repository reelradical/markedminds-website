import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink placeholder:text-charcoal/40 outline-none transition-colors selection:bg-brand-orange selection:text-white focus-visible:border-ink disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
