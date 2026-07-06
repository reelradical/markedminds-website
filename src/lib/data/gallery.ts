export type GalleryItem = {
  id: string;
  type: "photo" | "video";
  caption: string;
  session: string;
  aspect: "square" | "portrait" | "landscape";
};

// Replace `caption`/`session` with real captions as photography and video
// comes in. Each item renders as a styled placeholder tile until an `src`
// (photo) or `videoUrl` (video) field is added and wired into GalleryGrid.
export const galleryItems: GalleryItem[] = [
  { id: "g1", type: "photo", caption: "Small-group problem solving", session: "Session I", aspect: "portrait" },
  { id: "g2", type: "photo", caption: "Family showcase night", session: "Session I", aspect: "landscape" },
  { id: "g3", type: "video", caption: "A day inside Focus + FLEX", session: "Session I", aspect: "landscape" },
  { id: "g4", type: "photo", caption: "AI literacy workshop", session: "Session I", aspect: "square" },
  { id: "g5", type: "photo", caption: "Guest educator visit", session: "Session I", aspect: "portrait" },
  { id: "g6", type: "photo", caption: "Reading circle", session: "Session I", aspect: "square" },
  { id: "g7", type: "video", caption: "Student project spotlight", session: "Session I", aspect: "portrait" },
  { id: "g8", type: "photo", caption: "Movement & mindfulness break", session: "Session I", aspect: "landscape" },
  { id: "g9", type: "photo", caption: "Coding lab", session: "Session I", aspect: "square" },
  { id: "g10", type: "photo", caption: "Community celebration", session: "Session I", aspect: "portrait" },
];
