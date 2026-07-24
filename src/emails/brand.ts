// Shared brand constants for email templates. Mirrors the hex values in
// src/app/globals.css (--color-mm-*) — email clients need real inline
// values, not Tailwind classes or CSS variables, so these are kept in
// sync by hand rather than imported from the site's CSS.
export const emailBrand = {
  ink: "#0a0a0b",
  charcoal: "#232326",
  silver: "#e7e7ea",
  mist: "#f6f6f7",
  white: "#ffffff",
  orange: "#ff7700",
  orangeDark: "#e56600",
  academyPurple: "#6b46c1",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;
