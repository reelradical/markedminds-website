import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  academy = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  academy?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-24",
        academy ? "bg-ink" : "bg-ink",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full blur-3xl",
          academy ? "bg-academy-purple/25" : "bg-brand-orange/20",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-32 left-[-10%] h-80 w-80 rounded-full blur-3xl",
          academy ? "bg-brand-orange/10" : "bg-white/5",
        )}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.25em]",
            academy ? "text-academy-purple" : "text-brand-orange",
          )}
        >
          {eyebrow}
        </p>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-7 text-white/70">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
