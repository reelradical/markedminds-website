// Confirmed by the user directly — update only when a real, current count
// is provided. Do not estimate or round beyond what's given.
export type Stat = {
  label: string;
  value: string;
};

// Full internal record, including figures not shown publicly.
export const stats: Stat[] = [
  { label: "Episodes Available", value: "32" },
  { label: "Lifetime Downloads", value: "3,641" },
  { label: "Live Plays", value: "4" },
];

// Subset actually rendered on the public page — "Live Plays" is kept in
// `stats` above for internal reference only.
export const publicStats: Stat[] = stats.filter(
  (stat) => stat.label !== "Live Plays",
);

// Real Spreaker Supporter URL — the "Become a Supporter" CTA links here
// directly; the /contact fallback only applies if this is ever cleared.
export const supporterUrl = "https://www.spreaker.com/podcast/dream-deferred--2572652/support";

// Podcast listening platforms only. `embedUrl` renders as an iframe (Apple
// Podcasts); `embedHtml` renders raw widget markup that needs its own
// script to hydrate (Spreaker) — content here is developer-authored, not
// user input. Do not fill `url` in with placeholder or guessed URLs.
export type ListenLink = {
  platform: string;
  url: string;
  embedUrl?: string;
  embedHtml?: string;
};

export const listenLinks: ListenLink[] = [
  {
    platform: "Spotify",
    url: "https://open.spotify.com/show/62TEZE5ZSHuY8xEr8PBVDd?si=f57e73f6e74147dc",
  },
  {
    platform: "Apple Podcasts",
    url: "https://podcasts.apple.com/us/podcast/dream-deferred/id1321114063",
    embedUrl: "https://embed.podcasts.apple.com/us/podcast/dream-deferred/id1321114063",
  },
  {
    platform: "Spreaker",
    url: "https://www.spreaker.com/podcast/dream-deferred--2572652",
    embedHtml:
      '<a class="spreaker-player" href="https://www.spreaker.com/podcast/dream-deferred--2572652" data-resource="show_id=2572652" data-width="100%" data-height="200px" data-theme="light" data-playlist="false" data-playlist-continuous="false" data-chapters-image="true" data-episode-image-position="right" data-hide-logo="false" data-hide-likes="false" data-hide-comments="false" data-hide-sharing="false" data-hide-download="true" data-title="Dream Deferred">Listen to "Dream Deferred" on Spreaker.</a>',
  },
  { platform: "YouTube", url: "http://www.youtube.com/@danidutchi6716" },
  {
    platform: "Metacast",
    url: "https://metacast.app/podcast/dream-deferred/4tLBycMi/filter/date/before/2018-02-07T01%3A05%3A17.000Z",
  },
];

// "The Conversation Continues" — a real community quote/post about Dream
// Deferred. Renders as the real embedded Facebook post once `embedUrl` is
// set; falls back to a styled placeholder card otherwise.
export type ConversationHighlight = {
  source: string;
  postUrl?: string;
  embedUrl?: string;
};

export const conversationHighlight: ConversationHighlight = {
  source: "kg.codes.social",
  postUrl:
    "https://www.facebook.com/kg.codes.social/posts/pfbid02ZJroMVUcmU1BqpCpikkcnHLVJfZjrghP3mAxXB5rfg3PjMxAMXHNKpjW5gfCJ6DNl",
  embedUrl:
    "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fkg.codes.social%2Fposts%2Fpfbid02ZJroMVUcmU1BqpCpikkcnHLVJfZjrghP3mAxXB5rfg3PjMxAMXHNKpjW5gfCJ6DNl&show_text=true&width=500",
};

// Instagram is shown as a styled link-out card, not an embed — the
// profile-level Instagram embed doesn't render reliably everywhere.
export type SocialPreview = {
  platform: string;
  url: string;
  handle: string;
  description: string;
};

export const socialPreview: SocialPreview = {
  platform: "Instagram",
  url: "https://www.instagram.com/dreamdeferredpod/",
  handle: "@dreamdeferredpod",
  description:
    "Episode updates, reflections, behind-the-scenes clips, and community conversation.",
};

// Secondary social link shown alongside the Instagram card — X profile
// only, not a full featured card.
export const xProfile = {
  platform: "X",
  url: "https://x.com/deferredpodcast",
  handle: "@deferredpodcast",
};

export type GetInvolvedItem = {
  label: string;
  href: string;
  icon: "headphones" | "lightbulb" | "message-circle" | "heart-handshake" | "mic";
  external?: boolean;
};

export const getInvolvedItems: GetInvolvedItem[] = [
  { label: "Listen or Share an Episode", href: "#listen-now", icon: "headphones" },
  { label: "Suggest a Guest or Topic", href: "/contact", icon: "lightbulb" },
  {
    label: "Join the Conversation",
    href: socialPreview.url,
    icon: "message-circle",
    external: true,
  },
  { label: "Become a Supporter", href: "#support", icon: "heart-handshake" },
  { label: "Reach Out to Be Considered as a Guest", href: "/contact", icon: "mic" },
];
