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
  // Square Appointments buyer widget — injects its own floating "Book Now"
  // button once loaded (no custom markup needed on our side).
  squareAppointmentsWidgetSrc:
    "https://square.site/appointments/buyer/widget/696czhxkh9n1bp/LWT3Q9ZWQZ3YR.js",
  social: {
    instagram: "https://www.instagram.com/markedminds",
    facebook: "https://www.facebook.com/markedminds",
    linkedin: "https://www.linkedin.com/company/markedminds",
  },
  // Dani's personal LinkedIn — no Marked Minds company page exists yet.
  founderLinkedinUrl: "https://www.linkedin.com/in/danicummings/",
  // Not live yet — kept here for reference but intentionally not rendered
  // as a link anywhere on the site until it resolves. See the About page's
  // Founder section, which shows it as plain (non-clickable) text instead.
  founderSiteUrl: "https://danicummings.com",
  address: {
    locality: "United States",
  },
} as const;
