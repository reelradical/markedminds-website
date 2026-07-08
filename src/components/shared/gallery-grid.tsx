import Image from "next/image";
import { ImageIcon, PlayCircle } from "lucide-react";

import type { GalleryItem } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

const aspectClass: Record<GalleryItem["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

// Renders a real <Image> when `item.src` is present; otherwise falls back to
// the styled placeholder tile until real photography/video is available.
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
              "relative flex items-center justify-center overflow-hidden",
              !item.src && "bg-linear-to-br from-ink via-charcoal to-ink/80",
              aspectClass[item.aspect],
            )}
          >
            {item.src ? (
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : item.type === "video" ? (
              <PlayCircle className="size-12 text-white/70" strokeWidth={1.25} />
            ) : (
              <ImageIcon className="size-10 text-white/50" strokeWidth={1.25} />
            )}
            {!item.src && (
              <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                {item.type}
              </span>
            )}
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
