export type CoreValue = {
  name: string;
  description: string;
  icon: "compass" | "sparkles" | "heart-handshake" | "shield-check" | "lightbulb";
};

export const coreValues: CoreValue[] = [
  {
    name: "Purpose Over Prestige",
    description:
      "We measure success by transformation in a student's life, not by accolades.",
    icon: "compass",
  },
  {
    name: "Excellence as a Baseline",
    description:
      "Families and partners deserve professionalism and quality in every interaction, every time.",
    icon: "shield-check",
  },
  {
    name: "Creativity as Strategy",
    description:
      "We treat imagination as a serious tool for solving real educational and community problems.",
    icon: "sparkles",
  },
  {
    name: "Community as Curriculum",
    description:
      "The people around a learner are as important to their growth as anything taught in a session.",
    icon: "heart-handshake",
  },
  {
    name: "Curiosity, Sustained",
    description:
      "We design for lifelong learners, not just a single test or session cycle.",
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
    year: "Year One",
    title: "Marked Minds LLC is founded",
    description:
      "Marked Minds is established with a single conviction: learning environments should be designed around students, not the other way around.",
  },
  {
    year: "Year One",
    title: "Focus + FLEX Academy is developed",
    description:
      "The flagship initiative takes shape — a small-group, project-based model blending academics, AI literacy, and social-emotional learning.",
  },
  {
    year: "Session I",
    title: "First cohort launches",
    description:
      "Focus + FLEX Academy welcomes its first students and families, backed by scholarships and community partners.",
  },
  {
    year: "Today",
    title: "Building toward what's next",
    description:
      "Marked Minds continues expanding its portfolio of initiatives — from community impact programming to future creative and consulting ventures.",
  },
];
