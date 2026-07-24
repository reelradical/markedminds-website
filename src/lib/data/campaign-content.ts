import type { IconKey } from "@/lib/icon-map";
import type { CampaignOffer } from "@/lib/data/campaigns";

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

/** Uniform CTA label for any fixed-price service once its Square Payment Link is live. */
export const PURCHASE_CTA_LABEL = "Purchase & Schedule";

export type SupportOption = {
  name: string;
  duration?: string;
  /** Shown when routing to the inquiry form (the default/fallback path, and for all inquiry-only options). */
  ctaLabel: string;
  /** Must match a value in the inquiry form's service <select>. */
  serviceValue: string;
  icon: IconKey;
  /** "fixed" = pay now via Square Payment Link; "inquiry" = custom quote, price is a starting floor. */
  pricingType: "fixed" | "inquiry";
  /** Exact price (fixed) or starting floor (inquiry). Real rates — see docs/EDUCATIONAL_SERVICES_PRICING.md. */
  price: number;
  /** Appended after the price, e.g. " + travel". */
  priceSuffix?: string;
  /**
   * Square Payment Link for fixed-price services. Payment happens
   * immediately at this link; scheduling is coordinated afterward by Dani
   * (see fixedPricePurchaseNotice below) — this is NOT a Square
   * Appointments booking page and has no time-slot picker. When set, the
   * card CTA opens this instead of scrolling to the inquiry form. Leave
   * unset (not a placeholder string) until the real link exists; the card
   * falls back to the inquiry form automatically.
   */
  paymentUrl?: string;
};

export function formatPrice(option: SupportOption): string {
  const amount = `$${option.price}${option.priceSuffix ?? ""}`;
  return option.pricingType === "fixed" ? amount : `Starting at ${amount}`;
}

/** Discounted price for a fixed-price option under a campaign's offer — null for inquiry-only options. */
export function formatDiscountedPrice(
  option: SupportOption,
  offer: Pick<CampaignOffer, "discountPercent">,
): string | null {
  if (option.pricingType !== "fixed") return null;
  const discounted = Math.round(option.price * (1 - offer.discountPercent / 100));
  return `$${option.price} → $${discounted}`;
}

export const supportOptions: SupportOption[] = [
  {
    name: "Educator Strategy Consultation",
    duration: "30 minutes",
    ctaLabel: "Request This Session",
    serviceValue: "Educator Strategy Consultation",
    icon: "message-circle",
    pricingType: "fixed",
    price: 75,
    paymentUrl: "https://square.link/u/9xlhrR58",
  },
  {
    name: "AI-Supported Planning Session",
    duration: "60 minutes",
    ctaLabel: "Request This Session",
    serviceValue: "AI-Supported Planning Session",
    icon: "bot",
    pricingType: "fixed",
    price: 125,
    paymentUrl: "https://square.link/u/vURRSzzs",
  },
  {
    name: "Coding Integration Planning Session",
    duration: "60 minutes",
    ctaLabel: "Request This Session",
    serviceValue: "Coding Integration Planning Session",
    icon: "code",
    pricingType: "fixed",
    price: 125,
    paymentUrl: "https://square.link/u/jspKFIyA",
  },
  {
    name: "Team Training",
    duration: "Custom",
    ctaLabel: "Request Team Training",
    serviceValue: "Team Training",
    icon: "users",
    pricingType: "inquiry",
    price: 350,
  },
  {
    name: "School-Wide Professional Development",
    duration: "Custom",
    ctaLabel: "Discuss School-Wide PD",
    serviceValue: "School-Wide Professional Development",
    icon: "graduation-cap",
    pricingType: "inquiry",
    price: 750,
  },
  {
    name: "In-Person Sessions",
    duration: "Custom",
    ctaLabel: "Request an In-Person Session",
    serviceValue: "In-Person Sessions",
    icon: "handshake",
    pricingType: "inquiry",
    price: 200,
    priceSuffix: " + travel",
  },
  {
    name: "Custom Workshops",
    duration: "Custom",
    ctaLabel: "Discuss a Custom Workshop",
    serviceValue: "Custom Workshops",
    icon: "briefcase",
    pricingType: "inquiry",
    price: 350,
  },
  {
    name: "Custom Resource Packets",
    duration: "Digital delivery",
    ctaLabel: "Request a Resource Packet",
    serviceValue: "Custom Resource Packets",
    icon: "book-open",
    pricingType: "inquiry",
    price: 97,
  },
  {
    name: "Travel-Based Engagements",
    duration: "Custom",
    ctaLabel: "Inquire About Travel",
    serviceValue: "Travel-Based Engagements",
    icon: "compass",
    pricingType: "inquiry",
    price: 500,
    priceSuffix: " + travel",
  },
  {
    name: "Large-Group Training",
    duration: "20+ participants",
    ctaLabel: "Request Large-Group Training",
    serviceValue: "Large-Group Training",
    icon: "target",
    pricingType: "inquiry",
    price: 500,
  },
];

// Service <select> options for the inquiry form — a superset of the
// support-option cards above (adds the catch-all choice).
export const serviceSelectOptions = [
  ...supportOptions.map((option) => option.serviceValue),
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

// Approved copy — sign-off received; see ROADMAP.md pre-publish checklist.
// A function of the offer (not a plain constant) because the "discount"
// FAQ answer must stay accurate if a future campaign has a different
// discountPercent — see howToUseOfferSteps() for the same pattern.
export function faqItems(offer: Pick<CampaignOffer, "discountPercent">): FaqItem[] {
  return [
  {
    question: "Do I need prior AI or coding experience?",
    answer:
      "No. Sessions meet you where you are—whether you have never opened an AI tool, are just beginning to explore coding, or are already experimenting in your classroom.",
  },
  {
    question: "Is this only for classroom teachers?",
    answer:
      "No. Classroom teachers, instructional coaches, specialists, administrators, enrichment educators, and program leaders are all welcome. Support is shaped around your role, goals, and the learners or educators you serve.",
  },
  {
    question: "Can the session focus on my grade level or content area?",
    answer:
      "Yes. Individual consultations and customized sessions can be tailored to your grade band, subject area, instructional goals, and real classroom context—not a generic template.",
  },
  {
    question: "Are sessions virtual?",
    answer:
      "Yes. Individual consultations and planning sessions are available virtually. In-person options may also be possible depending on location, scheduling, group size, and scope. Include your preference when submitting your request, and Dani will confirm the available options.",
  },
  {
    question: "Does the discount include custom materials?",
    answer:
      `The ${offer.discountPercent}% discount applies to fixed-price services. Custom resource development, team trainings, and other inquiry-based services aren't discounted the same way, but include a complimentary strategy consultation instead. Printing, licensing, and travel are always billed separately.`,
  },
  {
    question: "Does AI replace my professional judgment?",
    answer:
      "No. AI can serve as a planning and thought partner—a starting point rather than a substitute for your instructional expertise, professional judgment, creativity, or relationships with students.",
  },
  ];
}

// Explains the two-step redemption flow: the website records conference
// eligibility, but the benefit itself — a percentage off or a free
// consultation, depending on the service — is applied afterward, either
// at Square checkout or when Dani follows up. Shared/reusable across
// campaigns — only the code, percentage, and inquiry benefit are
// campaign-specific, so this stays a function of the offer rather than
// hardcoded per page.
export const howToUseOfferHeading = "How to Use Your Conference Offer";

export function howToUseOfferSteps(
  offer: Pick<CampaignOffer, "code" | "discountPercent" | "inquiryBenefit">,
): string[] {
  return [
    "Explore the available educator services.",
    "Submit a brief request describing the support you need, and mention your code.",
    "Dani will confirm the recommended session, scope, availability, and price.",
    `Fixed-price services: you'll receive a Square checkout link — enter code ${offer.code} for ${offer.discountPercent}% off.`,
    `Custom or inquiry-based services: mentioning ${offer.code} in your request gets you ${offer.inquiryBenefit}.`,
  ];
}

export const howToUseOfferEligibilityNote =
  "Your inquiry form records your conference eligibility. Fixed-price discounts are applied at Square checkout; the complimentary consultation for custom services is confirmed when Dani follows up.";

export const howToUseOfferExclusionsNote =
  "Travel expenses, printing, and licensing are billed separately from any listed price and are not part of the promotional discount.";

// Shown beneath the fixed-price service cards. Payment via Square Payment
// Link happens immediately; scheduling is a separate, manual follow-up —
// this notice exists specifically so a completed purchase is never mistaken
// for a confirmed appointment time.
export const fixedPricePurchaseNotice =
  "After your purchase is complete, Marked Minds will contact you within one business day to coordinate your session. Purchasing a session does not automatically assign an appointment time.";

export const finalCta = {
  headline: "Let's Make Innovation Feel Useful Again.",
  supporting:
    "You do not have to become a computer scientist or AI expert. You need a thoughtful starting point, tools that fit your reality, and a plan you can actually use.",
  secondaryButtonLabel: "Request a Custom Training",
};
