import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-mist text-ink">
        <Compass className="size-8" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        This page hasn&apos;t been marked yet.
      </h1>
      <p className="mt-4 max-w-md text-balance text-charcoal/70">
        The page you&apos;re looking for may have moved. Let&apos;s get you
        back to something worth exploring.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </section>
  );
}
