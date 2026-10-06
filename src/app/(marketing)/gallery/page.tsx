import type { Metadata } from "next";

import { galleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/shared/page-hero";
import { SentenceBreak } from "@/components/shared/sentence-break";
import { GalleryGrid } from "@/components/shared/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and videos from Marked Minds and Focus + FLEX Academy sessions, celebrations, and community events.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look inside our sessions."
        description={
          <SentenceBreak text="Photos and videos from Focus + FLEX Academy and Marked Minds community events. New highlights are added after every session." />
        }
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Only real photos render — entries without a confirmed `src`
              stay in gallery.ts for future use but are hidden here rather
              than shown as empty placeholder tiles. */}
          <GalleryGrid items={galleryItems.filter((item) => item.src)} />
        </div>
      </section>
    </>
  );
}
