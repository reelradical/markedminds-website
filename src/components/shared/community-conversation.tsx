// Generic social-embed container for episode community discussion.
// Pass `embedUrl` for an iframe-based embed (Facebook, YouTube, etc.) or
// `embedHtml` for embeds that ship as a raw markup snippet (Instagram,
// Threads, Bluesky). Supplying neither renders a placeholder card, so this
// can be dropped onto a page before the real embed exists.
export type CommunityConversationProps = {
  platform?: string;
  embedUrl?: string;
  embedHtml?: string;
  height?: number;
  placeholder?: string;
};

export function CommunityConversation({
  platform,
  embedUrl,
  embedHtml,
  height = 558,
  placeholder = "Discussion embed coming here.",
}: CommunityConversationProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-ink/8 bg-white p-6 shadow-sm">
      {platform && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-dark">
          {platform}
        </p>
      )}

      {embedUrl ? (
        <iframe
          title={platform ? `${platform} discussion` : "Community discussion"}
          src={embedUrl}
          width={500}
          height={height}
          scrolling="no"
          frameBorder={0}
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
        />
      ) : embedHtml ? (
        // Trusted, developer-authored embed markup, not user input.
        <div className="w-full" dangerouslySetInnerHTML={{ __html: embedHtml }} />
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-ink/15 px-6 text-center text-sm font-medium text-charcoal/40">
          {placeholder}
        </div>
      )}
    </div>
  );
}
