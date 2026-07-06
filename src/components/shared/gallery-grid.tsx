import { ImageIcon, PlayCircle } from "lucide-react";

import type { GalleryItem } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

const aspectClass: Record<GalleryItem["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

// Renders a styled placeholder tile per item. Once real photography/video is
// available, replace the placeholder <div> below with <Image src={item.src}>
// or an embedded video player keyed off item.videoUrl — GalleryGrid's public
// contract (GalleryItem[]) does not need to change.
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <figure
          key={item.id}
          className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-ink/8 bg-mist"
        >
          <div
            className={cn(
              "relative flex items-center justify-center bg-gradient-to-br from-ink via-charcoal to-ink/80",
              aspectClass[item.aspect],
            )}
          >
            {item.type === "video" ? (
              <PlayCircle className="size-12 text-white/70" strokeWidth={1.25} />
            ) : (
              <ImageIcon className="size-10 text-white/50" strokeWidth={1.25} />
            )}
            <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
              {item.type}
            </span>
          </div>
          <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-sm font-medium text-ink">{item.caption}</span>
            <span className="shrink-0 text-xs text-charcoal/50">{item.session}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
