// Focus + FLEX Academy's own tagline — distinct from the Marked Minds
// tagline ("We Curate Culture."). Use only on Focus + FLEX pages/sections.
export const academyTagline = "Learn. Grow. Create. Thrive.";

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

// Real Google Form for Session II registration.
export const sessionIIRegistrationUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfq7J80YLf1QNHAPlkRmILg7t1UgqkDjlqOH24f8i1dVcuevg/viewform";

// Real Square payment link for the Session II deposit — plain link only,
// no embed script.
export const sessionIIDepositUrl = "https://square.link/u/ODkxEJ9r";

export type Session = {
  name: string;
  status: "completed" | "upcoming" | "postponed";
  description: string;
  registrationUrl?: string;
  depositUrl?: string;
};

// Session II postponement announced 2026-07-10. Registration/deposit links
// intentionally not attached to the Session II entry below while postponed
// — see the interest-list section on /focus-flex instead. The URLs remain
// defined here for reference in case Session II is later rescheduled and
// the same form/payment link should be reused.
export const sessions: Session[] = [
  {
    name: "Session I",
    status: "completed",
    description:
      "Our inaugural cohort, completed, focused on small-group academics, AI literacy, and creative problem solving.",
  },
  {
    name: "Session II",
    status: "postponed",
    description:
      "Thank you for the overwhelming support of Focus + FLEX Academy. We have made the decision to postpone our next session so we can continue delivering the high-quality experience our scholars deserve. Join our interest list to be the first to know when enrollment reopens.",
  },
];
