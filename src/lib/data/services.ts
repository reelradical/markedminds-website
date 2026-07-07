export type ServiceCategory = {
  slug: string;
  name: string;
  description: string;
  items: string[];
  icon: "camera" | "palette" | "graduation-cap" | "briefcase";
  // Maps this category back to the Marked Minds four pillars (Create,
  // Teach, Build, Connect) — see the homepage "What Marked Minds Does"
  // section and docs/BRAND_GUIDE.md.
  pillar: "Create" | "Teach" | "Build" | "Connect";
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "creative-production",
    name: "Creative Production",
    description:
      "Media that captures a moment and makes it last — built for brands, families, and communities.",
    items: [
      "Video production",
      "Photography",
      "Podcast production",
      "Editing",
      "Social media content",
      "Event recap media",
      "Brand storytelling",
    ],
    icon: "camera",
    pillar: "Create",
  },
  {
    slug: "design-brand-support",
    name: "Design + Brand Support",
    description:
      "Visual identity and campaign assets that help an idea look as good as it sounds.",
    items: [
      "Graphics",
      "Flyers",
      "Shirt design",
      "Apparel concepts",
      "Visual identity support",
      "Campaign assets",
      "Presentation design",
    ],
    icon: "palette",
    pillar: "Create",
  },
  {
    slug: "education-workshops",
    name: "Education + Workshops",
    description:
      "Learning experiences for classrooms, families, and educators — grounded in real practice.",
    items: [
      "Educator workshops",
      "AI for classroom use",
      "Lesson planning with AI",
      "Curriculum/program design",
      "Youth digital media workshops",
      "Academic enrichment",
      "Family learning experiences",
    ],
    icon: "graduation-cap",
    pillar: "Teach",
  },
  {
    slug: "consulting-strategy",
    name: "Consulting + Strategy",
    description:
      "Planning and direction for organizations building their own programs, brands, or campaigns.",
    items: [
      "Program design",
      "Creative direction",
      "Community engagement strategy",
      "Educational innovation consulting",
      "Workshop facilitation",
      "Brand/project planning",
    ],
    icon: "briefcase",
    pillar: "Build",
  },
];
