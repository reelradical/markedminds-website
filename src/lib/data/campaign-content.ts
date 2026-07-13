import type { IconKey } from "@/lib/icon-map";

// Shared, campaign-agnostic content for partner/conference landing pages
// (see `campaigns.ts`). This is Marked Minds' general educator-support
// pitch — the same across Black2School, Code.org, ISTE, etc. Only the
// partner/offer specifics live in each campaign's entry in `campaigns.ts`.

export const heroContent = {
  eyebrow: "AI + Coding for Real Classrooms",
  headline: "Tools for Today. Impact for Tomorrow.",
  supporting:
    "Discover practical, classroom-ready ways to use AI, coding, computational thinking, and creative learning strategies—without needing to become a technology expert.",
  secondaryLine: "Designed by an educator, for educators.",
};

export const empathyContent = {
  headline:
    "You do not need more tools. You need the right tools used with purpose.",
  acknowledgments: [
    "Lesson planning",
    "Differentiation",
    "Student engagement",
    "Assessment",
    "Family communication",
    "Administrative demands",
    "New technology expectations",
    "Limited planning time",
  ],
  featureLine: "Teaching tools should save you time—not create more work.",
};

export type HelpCard = {
  name: string;
  icon: IconKey;
  /** Who this is built for — e.g. "Classroom teachers, any grade band." */
  idealAudience: string;
  items: string[];
  note?: string;
};

export const helpCards: HelpCard[] = [
  {
    name: "AI as a Teaching Tool",
    icon: "bot",
    idealAudience: "Any educator who plans lessons, communicates with families, or manages classroom workflow.",
    items: [
      "Lesson planning and adaptation",
      "Differentiated starting points",
      "Examples and reflection questions",
      "Rubrics and checklists",
      "Family communication",
      "Classroom workflow organization",
    ],
    note: "You remain the professional decision-maker — AI supports your judgment, it doesn't replace it.",
  },
  {
    name: "Coding for Every Classroom",
    icon: "code",
    idealAudience: "Educators new to coding, including those with no computer-science background.",
    items: [
      "Unplugged coding",
      "Algorithms and sequencing",
      "Loops, patterns, bugs, and debugging",
      "Code.org and Hour of Code",
      "Beginner-friendly block coding",
      "Driver/navigator collaboration",
      "Computational thinking across subjects",
    ],
  },
  {
    name: "Creative, Cross-Curricular Learning",
    icon: "sparkles",
    idealAudience: "Teachers across subjects, plus enrichment and afterschool program leads.",
    items: [
      "ELA",
      "Math",
      "Science",
      "Social studies",
      "Visual art",
      "SEL",
      "Project-based learning",
      "Enrichment and afterschool programming",
    ],
  },
  {
    name: "Executive Function + Student Agency",
    icon: "compass",
    idealAudience: "Educators supporting focus, independence, and self-regulation in their students.",
    items: [
      "Planning",
      "Persistence",
      "Flexible thinking",
      "Collaboration",
      "Reflection",
      "Problem-solving",
      "Confidence",
    ],
    note: "Plan. Try. Check. Adjust.",
  },
  {
    name: "Classroom-Ready Resources",
    icon: "book-open",
    idealAudience: "Educators who want take-and-use materials, not another framework to learn.",
    items: [
      "Activity guides",
      "Prompt banks",
      "Planning templates",
      "Reflection tools",
      "Simple rubrics",
      "Coding vocabulary guides",
      "Grade-level adaptations",
      "Custom resources",
    ],
  },
];

// Free lead-magnet offered mid-page. Note: the 8 resource files themselves
// still need to be authored, and email delivery isn't wired to a real
// provider yet — see the pre-publish checklist in the build report.
export const starterKit = {
  heading: "Free AI Classroom Starter Kit",
  supporting:
    "Leave the conference with something you can use Monday morning. Enter your email and we'll send your starter kit.",
  includes: [
    "AI prompt guide for educators",
    "AI classroom policy template",
    "Parent letter template introducing AI use",
    "Lesson-planning prompt bank",
    "Student reflection prompts",
    "Coding vocabulary guide",
    "AI glossary for educators",
    "Classroom workflow cheat sheet",
  ],
  ctaLabel: "Get the Free Starter Kit",
};

export type SupportOption = {
  name: string;
  duration?: string;
  ctaLabel: string;
  /** Must match a value in the inquiry form's service <select>. */
  serviceValue: string;
  icon: IconKey;
  /**
   * "Starting at" price, once approved — intentionally left unset for every
   * option today. No dollar figures have been approved, so nothing here
   * renders a price; setting this later is enough to display one via
   * `formatStartingAt()`. Do not hardcode a number without sign-off.
   */
  startingAtPrice?: number;
};

export function formatStartingAt(option: SupportOption): string | null {
  if (option.startingAtPrice == null) return null;
  return `Starting at $${option.startingAtPrice}`;
}

export const supportOptions: SupportOption[] = [
  {
    name: "One-on-One Educator Consultation",
    duration: "30 or 45 minutes",
    ctaLabel: "Book a Consultation",
    serviceValue: "One-on-one educator consultation",
    icon: "message-circle",
  },
  {
    name: "AI-Supported Planning Session",
    duration: "45 or 60 minutes",
    ctaLabel: "Plan With AI",
    serviceValue: "AI-supported lesson-planning session",
    icon: "bot",
  },
  {
    name: "Coding in Your Classroom",
    duration: "45 or 60 minutes",
    ctaLabel: "Build a Coding Experience",
    serviceValue: "Classroom coding integration session",
    icon: "code",
  },
  {
    name: "Team or Small-Group Training",
    duration: "60–90 minutes",
    ctaLabel: "Request Team Training",
    serviceValue: "Team or small-group training",
    icon: "users",
  },
  {
    name: "Custom Workshop or Resource Package",
    ctaLabel: "Discuss a Custom Experience",
    serviceValue: "Custom workshop",
    icon: "briefcase",
  },
];

// Service <select> options for the inquiry form — a superset of the
// support-option cards above (adds the two catch-all choices).
export const serviceSelectOptions = [
  ...supportOptions.map((option) => option.serviceValue),
  "Resource-development request",
  "Not sure—I need help choosing",
];

export const realWorldExperience = {
  heading: "Informed by Real Classrooms and Real Students",
  body: "Dani's approach is informed by classroom teaching, program leadership, creative education, and the Focus + FLEX Academy Summer 2026 pilot—a small-group academic and enrichment experience created through Marked Minds LLC.",
  verifiedExamples: [
    "Introductory coding vocabulary",
    "Code.org profile setup",
    "Unplugged computational thinking",
    "Executive-function language",
    "School Improvement Budget Challenge",
    "Writing and reflection",
    "Small-group instruction",
    "Collaborative problem-solving",
    "Student presentations",
    "Creative enrichment",
    "Flexible learning pathways",
  ],
  // Chosen because they directly depict two of the verified examples above
  // (collaborative problem-solving, student presentations) — not generic
  // stand-ins. See gallery.ts for full captions/provenance.
  images: [
    {
      src: "/images/focus-flex/focus-flex-puzzle-collaboration.webp",
      alt: "Focus + FLEX Academy scholars collaborating on a hands-on problem-solving activity.",
    },
    {
      src: "/images/focus-flex/focus-flex-student-presentation.webp",
      alt: "A Focus + FLEX Academy scholar presenting her project findings to the group.",
    },
  ],
};

export const aboutDani = {
  portrait: "/images/founder/founder-dani-marked-minds-portrait.webp",
  name: "Dani Cummings",
  titles: [
    "Founder, Marked Minds LLC",
    "Creator, Focus + FLEX Academy",
    "Educator",
    "Program Designer",
    "Creative Learning Strategist",
  ],
  bio: "Dani Cummings is an educator, creative strategist, and program designer who helps learners and educators approach challenges with curiosity, structure, and confidence. Through Marked Minds LLC and Focus + FLEX Academy, she develops practical learning experiences connecting creativity, executive functioning, emerging technology, and real-world problem-solving.",
};

export type FaqItem = { question: string; answer: string };

// DRAFT answers — the build brief referenced "approved answers" that
// weren't actually included in what was provided. These are reasonable,
// policy-consistent drafts written to fill the gap; flagged for explicit
// review/approval before launch (see the pre-publish checklist).
export const faqItems: FaqItem[] = [
  {
    question: "Do I need prior AI or coding experience?",
    answer:
      "No. Sessions start wherever you are, whether you've never opened an AI tool or you're already experimenting in your classroom.",
  },
  {
    question: "Is this only for classroom teachers?",
    answer:
      "No. Instructional coaches, specialists, administrators, and program leaders are all welcome — sessions are shaped around your actual role and students.",
  },
  {
    question: "Can the session focus on my grade level or content area?",
    answer:
      "Yes. Every session is built around your grade band, subject area, and real classroom context — not a generic template.",
  },
  {
    question: "Are sessions virtual?",
    answer:
      "Sessions are available virtually. In-person options may be possible depending on location — ask when you submit your request, and Dani will confirm what's available.",
  },
  {
    question: "Does the discount include custom materials?",
    answer:
      "The discount applies to one qualifying session, consultation, or training. Significant custom-resource development is scoped and priced separately.",
  },
  {
    question: "Does AI replace my professional judgment?",
    answer:
      "No. AI is a planning and thought partner — a starting point, not a substitute for your relationships with students, instructional expertise, or professional judgment.",
  },
];

export const finalCta = {
  headline: "Let's Make Innovation Feel Useful Again.",
  supporting:
    "You do not have to become a computer scientist or AI expert. You need a thoughtful starting point, tools that fit your reality, and a plan you can actually use.",
  secondaryButtonLabel: "Request a Custom Training",
};
