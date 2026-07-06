import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "border-ink/15 bg-mist text-ink",
        orange: "border-transparent bg-brand-orange/10 text-brand-orange-dark",
        dark: "border-transparent bg-ink text-white",
        academy: "border-transparent bg-academy-purple/10 text-academy-purple",
        outline: "border-ink/20 bg-transparent text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
