// Forces a line break at the boundary between the first and second
// sentence of a two-sentence heading/subheading, so it never wraps
// mid-sentence (browser `text-wrap: balance` balances line width, not
// sentence boundaries). No-ops — renders the text unchanged — if there's
// no clean ". " split, so it's safe on single-sentence text.
export function SentenceBreak({ text }: { text: string }) {
  const idx = text.indexOf(". ");
  if (idx === -1) return <>{text}</>;
  return (
    <>
      <span className="block text-balance">{text.slice(0, idx + 1)}</span>
      <span className="block text-balance">{text.slice(idx + 2)}</span>
    </>
  );
}
