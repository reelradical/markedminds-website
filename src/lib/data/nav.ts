export type NavLink = {
  label: string;
  href: string;
};

export const primaryNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/our-work" },
  { label: "Focus + FLEX", href: "/focus-flex" },
  { label: "Dream Deferred", href: "/dream-deferred" },
  { label: "Ruthless Scout", href: "/ruthless-scout" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavLink[] = [
  ...primaryNav,
  { label: "Support", href: "/donate" },
];
