import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { timeline } from "@/lib/data/about";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { Button } from "@/components/ui/button";

export function TimelineSection() {
  return (
    <section className="bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Story So Far"
          title="Built one project at a time since 2017."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14">
          <Timeline entries={timeline} />
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/about">
              Read Our Full Story
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
