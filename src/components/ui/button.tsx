import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-white hover:bg-brand-orange hover:text-ink",
        inverse:
          "bg-white text-ink hover:bg-brand-orange hover:text-ink",
        outline:
          "border border-ink/15 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
        "outline-inverse":
          "border border-white/30 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink",
        ghost: "text-ink hover:bg-mist",
        link: "text-ink underline-offset-4 hover:underline px-0",
        academy:
          "bg-academy-purple text-white hover:bg-academy-purple-dark",
        "academy-outline":
          "border border-academy-purple/40 text-academy-purple hover:bg-academy-purple hover:text-white",
      },
      size: {
        default: "h-12 px-7 has-[>svg]:px-6",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-9 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
