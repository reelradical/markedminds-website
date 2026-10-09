export const ruthlessScout = {
  name: "Ruthless Scout",
  eyebrow: "A Marked Minds Technology Product",
  headline: "Your next move should fit your life—not just your résumé.",
  description:
    "Opportunity intelligence for people carrying real experience, real responsibilities, and a dream that refuses to stay deferred.",
  // The founding pilot is complimentary and invite-only. This is not an
  // active price — it's the anticipated price once the paid product
  // launches, which requires standalone (non-ChatGPT) authentication and
  // the access/provenance/evidence work described in
  // docs/RUTHLESS_SCOUT_PRODUCT_AND_BRAND_AUDIT.md.
  futurePrice: 147,
  foundingCapacity: 10,
  turnaround: "7 business days after intake, once the pilot cohort opens",
  accessModel: {
    short: "ChatGPT sign-in required — no paid subscription",
    detail:
      "Private pilot access currently opens through ChatGPT sign-in. No paid ChatGPT subscription is required. The pilot is complimentary and invite-only while Marked Minds finalizes access, data handling, and candidate-protection requirements ahead of a paid, standalone product.",
  },
  deliverables: [
    "A personal transition profile built around your compensation, location, travel, flexibility, and life-fit requirements",
    "A translation of your existing experience into credible, market-facing strengths",
    "Three career lanes worth exploring—and the lanes that are likely to waste your time",
    "Five current, verified opportunities selected against your actual non-negotiables",
    "Fit, long-term leverage, effort, and risk scoring for every opportunity",
    "A concise explanation of why each opportunity survived and what could kill it",
    "A private 30-minute debrief to make your next decision with clarity",
  ],
  principles: [
    {
      number: "01",
      title: "Your life is part of the strategy.",
      body: "Salary is not enough. We account for location, flexibility, travel, health, family, energy, identity, and the future you are actually trying to build.",
    },
    {
      number: "02",
      title: "Your experience is translated—not erased.",
      body: "You are not starting over. Ruthless Scout identifies the value already present in your work, leadership, service, creative practice, and lived experience.",
    },
    {
      number: "03",
      title: "The opportunity must survive the gates.",
      body: "A role does not enter your shortlist because the title sounds impressive. It must clear your requirements and create credible long-term leverage.",
    },
    {
      number: "04",
      title: "You make the call.",
      body: "Ruthless Scout researches, filters, scores, and explains. It does not apply, contact employers, or make life-changing decisions for you.",
    },
  ],
  faqs: [
    {
      question: "Do I need ChatGPT or an OpenAI account?",
      answer:
        "Yes, for the current pilot. Private pilot access opens through ChatGPT sign-in—no paid ChatGPT subscription is required, but you do need a ChatGPT account to sign in. Marked Minds is building a standalone version of Ruthless Scout that will not require this for the paid product.",
    },
    {
      question: "Is this a résumé-writing service?",
      answer:
        "No. The founding sprint is decision and opportunity intelligence. We identify your strongest lanes, translate your experience, and build a researched shortlist. Résumé or LinkedIn execution may be offered separately after the pilot.",
    },
    {
      question: "Does Ruthless Scout guarantee a job?",
      answer:
        "No. It improves the quality of your search and decisions, but no ethical career service can promise an interview or offer.",
    },
    {
      question: "Will it apply to jobs for me?",
      answer:
        "No. Ruthless Scout never applies, messages employers, or changes your decisions without your direction.",
    },
    {
      question: "What happens after I apply for founding access?",
      answer:
        "Marked Minds reviews your submission for pilot fit and capacity. If selected, you receive an invitation with instructions to sign in through ChatGPT and complete your private intake. The founding pilot is complimentary—no payment is requested at this stage.",
    },
  ],
} as const;
