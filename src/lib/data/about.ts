export type CoreValue = {
  name: string;
  description: string;
  icon: "compass" | "sparkles" | "heart-handshake" | "shield-check" | "lightbulb";
};

export const coreValues: CoreValue[] = [
  {
    name: "Purpose Over Prestige",
    description:
      "We measure success by transformation in a person's life or a community's story, not by accolades.",
    icon: "compass",
  },
  {
    name: "Excellence as a Baseline",
    description:
      "Families, partners, and collaborators deserve professionalism and quality in every project, every time.",
    icon: "shield-check",
  },
  {
    name: "Creativity as Strategy",
    description:
      "We treat imagination as a serious tool for solving real creative, educational, and community problems.",
    icon: "sparkles",
  },
  {
    name: "Community as Curriculum",
    description:
      "The people around a project are as important to its impact as anything designed on paper.",
    icon: "heart-handshake",
  },
  {
    name: "Curiosity, Sustained",
    description:
      "We design for lifelong creators and learners, not just a single project or session cycle.",
    icon: "lightbulb",
  },
];

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2017",
    title: "Marked Minds Founded",
    description:
      "Marked Minds LLC was created as a space for creative-minded people to connect, collaborate, promote one another, educate one another, and build meaningful work together.",
  },
  {
    year: "2018–2019",
    title: "Storytelling + Community Media",
    description:
      "The vision expanded through podcasting, community conversations, creative projects, and early media production.",
  },
  {
    year: "2019",
    title: "Workshops + Youth Media",
    description:
      "Marked Minds began supporting educational workshops, teacher-facing learning, youth film, digital media, and creative skill-building experiences.",
  },
  {
    year: "2020–2022",
    title: "Creative Production Growth",
    description:
      "The work expanded through photography, video, editing, graphics, shirts, digital content, and community-centered creative production.",
  },
  {
    year: "2023",
    title: "AI + Creative Education Exploration",
    description:
      "Marked Minds began exploring practical uses of AI for creativity, planning, teaching, production, and learning support.",
  },
  {
    year: "2024",
    title: "AI-Supported Program + Lesson Design",
    description:
      "The work evolved into AI-supported lesson planning, program design, creative workflow development, and education strategy.",
  },
  {
    year: "2025–2026",
    title: "Focus + FLEX Academy",
    description:
      "Marked Minds launched Focus + FLEX Academy as a direct expression of its education, creativity, community, and youth development mission.",
  },
];
