// Marked Minds LLC brand architecture.
//
// This is the single source of truth for every initiative under the Marked
// Minds umbrella. Adding a new initiative later does not require redesigning
// any page: add an entry here, and it will automatically surface in the
// "Why Marked Minds" and "Programs" listings. When an initiative is ready
// for its own page, set `status` to "live" and `href` to its route — the
// pattern to follow lives at src/app/focus-flex.

export type Initiative = {
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  status: "live" | "planned" | "future";
  href?: string;
  eyebrow: string;
};

export const currentInitiatives: Initiative[] = [
  {
    name: "Focus + FLEX Academy",
    shortName: "Focus + FLEX",
    tagline: "A Marked Minds Initiative",
    description:
      "Small-group, project-based learning that blends academics, AI literacy, and social-emotional growth for students who deserve more than a one-size-fits-all classroom.",
    status: "live",
    href: "/focus-flex",
    eyebrow: "Education",
  },
  {
    name: "Community Impact",
    tagline: "A Marked Minds Initiative",
    description:
      "Scholarships, meals, guest educators, and enrichment programming that meet families where they are and remove barriers to opportunity.",
    status: "live",
    href: "/impact",
    eyebrow: "Community",
  },
  {
    name: "Dream Deferred",
    tagline: "A Marked Minds Initiative",
    description:
      "A cultural storytelling platform born from the original Marked Minds vision: connecting creative-minded people, sharing stories, promoting purpose, and building community.",
    status: "live",
    href: "/dream-deferred",
    eyebrow: "Storytelling",
  },
  {
    name: "Consulting + Strategy",
    tagline: "A Marked Minds Initiative",
    description:
      "Advisory partnerships with schools, organizations, and brands seeking creative direction, program design, and community engagement strategy.",
    status: "planned",
    href: "/services",
    eyebrow: "Advisory",
  },
  {
    name: "Creative Studio",
    tagline: "A Marked Minds Initiative",
    description:
      "The production arm of Marked Minds — video, photography, podcast production, editing, graphics, and brand storytelling for people and organizations.",
    status: "planned",
    href: "/services",
    eyebrow: "Media & Design",
  },
];

export const futureInitiatives: Initiative[] = [
  {
    name: "Remnants",
    tagline: "Coming Soon",
    description:
      "A future Marked Minds initiative currently in early development.",
    status: "future",
    eyebrow: "In Development",
  },
  {
    name: "Additional Educational Programs",
    tagline: "Coming Soon",
    description:
      "New academic offerings expanding on the Focus + FLEX model for additional grade bands and subjects.",
    status: "future",
    eyebrow: "In Development",
  },
  {
    name: "Technology Products",
    tagline: "Coming Soon",
    description:
      "Tools that extend Marked Minds' educational approach beyond the classroom and into the hands of families.",
    status: "future",
    eyebrow: "In Development",
  },
  {
    name: "Community Initiatives",
    tagline: "Coming Soon",
    description:
      "New neighborhood-level programming designed alongside the partners and families we already serve.",
    status: "future",
    eyebrow: "In Development",
  },
];
