export type Program = {
  name: string;
  description: string;
  status: "current" | "future";
  href?: string;
  icon: "sparkles" | "sunrise" | "users" | "bot" | "target" | "palette";
};

export const currentPrograms: Program[] = [
  {
    name: "Focus + FLEX Academy",
    description:
      "Our flagship small-group learning experience combining academics, AI literacy, and social-emotional growth. A Marked Minds Initiative.",
    status: "current",
    href: "/focus-flex",
    icon: "sparkles",
  },
];

export const futurePrograms: Program[] = [
  {
    name: "Saturday Labs",
    description:
      "Weekend intensives where students prototype, build, and present projects rooted in real community needs.",
    status: "future",
    icon: "sunrise",
  },
  {
    name: "Teacher Workshops",
    description:
      "Professional development sessions equipping educators with project-based and AI-literacy teaching strategies.",
    status: "future",
    icon: "users",
  },
  {
    name: "AI for Families",
    description:
      "Accessible workshops helping parents and caregivers understand and guide their child's use of AI tools.",
    status: "future",
    icon: "bot",
  },
  {
    name: "Academic Coaching",
    description:
      "One-on-one and small-group coaching to strengthen study skills, executive function, and confidence.",
    status: "future",
    icon: "target",
  },
  {
    name: "Creative Camps",
    description:
      "Seasonal camps where students explore film, design, writing, and art under the guidance of working creatives.",
    status: "future",
    icon: "palette",
  },
];
