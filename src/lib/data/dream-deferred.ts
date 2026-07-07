// Listen links are intentionally empty until real show URLs are supplied.
// ListenLinks renders each platform in a disabled state until `url` is set —
// do not fill these in with placeholder or guessed URLs.

export type ListenLink = {
  platform: string;
  url: string;
};

export const listenLinks: ListenLink[] = [
  { platform: "Spotify", url: "" },
  { platform: "Apple Podcasts", url: "" },
  { platform: "YouTube", url: "" },
];
