export type Pillar = {
  name: string;
  description: string;
  icon:
    | "brain"
    | "code"
    | "book-open"
    | "pen-line"
    | "calculator"
    | "lightbulb"
    | "puzzle"
    | "smile"
    | "footprints"
    | "users";
};

export const learningModel: Pillar[] = [
  {
    name: "Small-Group Learning",
    description:
      "Low student-to-mentor ratios so every learner is seen, challenged, and supported individually.",
    icon: "users",
  },
  {
    name: "Project-Based Learning",
    description:
      "Students build real things — apps, stories, experiments — instead of memorizing for a test.",
    icon: "puzzle",
  },
];

export const academicPillars: Pillar[] = [
  {
    name: "AI Literacy",
    description:
      "Students learn to use AI tools thoughtfully, critically, and creatively — not just consume them.",
    icon: "brain",
  },
  {
    name: "Coding",
    description:
      "Hands-on programming that turns abstract logic into something students can build and show off.",
    icon: "code",
  },
  {
    name: "Reading",
    description:
      "Rich texts and guided discussion that build fluency, comprehension, and a love of story.",
    icon: "book-open",
  },
  {
    name: "Writing",
    description:
      "From journaling to persuasive essays, students develop a voice and the confidence to use it.",
    icon: "pen-line",
  },
  {
    name: "Mathematics",
    description:
      "Number sense and problem solving taught in ways that connect to the real world.",
    icon: "calculator",
  },
  {
    name: "Critical Thinking",
    description:
      "Structured practice in asking better questions and evaluating evidence.",
    icon: "lightbulb",
  },
  {
    name: "Creative Problem Solving",
    description:
      "Design-thinking challenges that reward original ideas as much as correct answers.",
    icon: "puzzle",
  },
  {
    name: "Social Emotional Learning",
    description:
      "Tools for self-awareness, regulation, and empathy woven into every session.",
    icon: "smile",
  },
  {
    name: "Movement",
    description:
      "Purposeful physical activity that keeps growing bodies and minds engaged.",
    icon: "footprints",
  },
  {
    name: "Family Partnership",
    description:
      "Regular communication and events that keep families connected to what their student is learning.",
    icon: "users",
  },
];

export type Session = {
  name: string;
  status: "current" | "future";
  description: string;
};

export const sessions: Session[] = [
  {
    name: "Session I",
    status: "current",
    description:
      "Our inaugural cohort, currently underway, focused on small-group academics, AI literacy, and creative problem solving.",
  },
  {
    name: "Future Sessions",
    status: "future",
    description:
      "Additional sessions are in planning as Focus + FLEX Academy grows to serve more students and families. Join our list to be notified when enrollment opens.",
  },
];
