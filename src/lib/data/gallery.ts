export type GalleryItem = {
  id: string;
  type: "photo" | "video";
  caption: string;
  session: string;
  aspect: "square" | "portrait" | "landscape";
  src?: string;
};

// Real photos from Focus + FLEX Academy Session I. Each item renders a real
// <Image> when `src` is present; otherwise it falls back to the styled
// placeholder tile in GalleryGrid. Do not invent captions beyond what a
// photo actually shows.
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    type: "photo",
    caption:
      "Small-group instruction in action — Focus + FLEX keeps class sizes small so every scholar gets individual attention.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-classroom-small-groups.webp",
  },
  {
    id: "g2",
    type: "photo",
    caption: "Teamwork in action during a hands-on problem-solving activity.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-puzzle-collaboration.webp",
  },
  {
    id: "g3",
    type: "photo",
    caption:
      "A scholar presents her project findings — Session I scholars practiced public speaking and built real confidence presenting their work.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-student-presentation.webp",
  },
  {
    id: "g4",
    type: "photo",
    caption: "Project-based learning through art and creative expression.",
    session: "Session I",
    aspect: "landscape",
    src: "/images/focus-flex/focus-flex-project-based-painting.webp",
  },
  {
    id: "g5",
    type: "photo",
    caption:
      "Scholars celebrate with shaved ice on FLEX Friday — the community day that closed out Session I.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-community-ice-cream.webp",
  },
  {
    id: "g6",
    type: "photo",
    caption:
      "Founder Dani Cummings and program intern Cameron — Session I doubled as a mentorship experience for the next generation of educators too.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-team-dani-cameron.webp",
  },
  { id: "g7", type: "photo", caption: "Family showcase night", session: "Session I", aspect: "landscape" },
  { id: "g8", type: "video", caption: "A day inside Focus + FLEX", session: "Session I", aspect: "landscape" },
  { id: "g9", type: "photo", caption: "Guest educator visit", session: "Session I", aspect: "portrait" },
  { id: "g10", type: "photo", caption: "Reading circle", session: "Session I", aspect: "square" },
  {
    id: "g11",
    type: "photo",
    caption:
      "Session I's 13 scholars and staff — rising 2nd through 7th grade, together for four days that built a real community.",
    session: "Session I",
    aspect: "landscape",
    src: "/images/focus-flex/focus-flex-session-group-photo.webp",
  },
  {
    id: "g12",
    type: "photo",
    caption:
      "A scholar stays locked in during a writing activity — the kind of focus small-group learning makes possible.",
    session: "Session I",
    aspect: "portrait",
    src: "/images/focus-flex/focus-flex-student-engaged.webp",
  },
];

// Picks specific items by id, in the given order — used so /focus-flex,
// /our-work, and /impact each show a distinct, hand-picked selection
// instead of all reusing the same `slice(0, 6)` (which showed the
// identical 6 photos, in the identical order, on all three pages).
export function pickGalleryItems(ids: string[]): GalleryItem[] {
  return ids
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item): item is GalleryItem => item !== undefined);
}
