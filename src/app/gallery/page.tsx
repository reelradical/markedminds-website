import type { Metadata } from "next";

import { galleryItems } from "@/lib/data/gallery";
import { PageHero } from "@/components/shared/page-hero";
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
        description="Photos and videos from Focus + FLEX Academy and Marked Minds community events. New highlights are added after every session."
      />

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <GalleryGrid items={galleryItems} />
        </div>
      </section>
    </>
  );
}
