// Focus + FLEX Academy is a Marked Minds sub-brand and is the only place on
// the site where the Academy's purple accent is used. This wrapper scopes
// that accent (see `.academy-scope` in globals.css) to pages rendered here.
export default function FocusFlexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="academy-scope">{children}</div>;
}
