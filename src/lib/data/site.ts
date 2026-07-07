// Central site configuration. Swap these values (or fetch them from a CMS)
// without touching any page or component.

export const site = {
  name: "Marked Minds",
  legalName: "Marked Minds LLC",
  tagline: "We Curate Culture.",
  pillarsLine: "Create. Teach. Build. Connect.",
  description:
    "Marked Minds is a creative innovation studio shaping culture through storytelling, education, design, and community.",
  ownership: "Woman-owned and veteran-owned business",
  url: "https://markedminds.com",
  email: "markedminds@gmail.com",
  donationUrl: "https://square.link/u/KV2EedBz",
  social: {
    instagram: "https://www.instagram.com/markedminds",
    facebook: "https://www.facebook.com/markedminds",
    linkedin: "https://www.linkedin.com/company/markedminds",
  },
  // TODO: swap in Dani's personal LinkedIn URL — no Marked Minds company
  // page exists yet. Leave empty until the real URL is supplied so the
  // Footer/Founder section can hide the link instead of pointing nowhere.
  founderLinkedinUrl: "",
  // Not live yet — kept here for reference but intentionally not rendered
  // as a link anywhere on the site until it resolves. See the About page's
  // Founder section, which shows it as plain (non-clickable) text instead.
  founderSiteUrl: "https://danicummings.com",
  address: {
    locality: "United States",
  },
} as const;
