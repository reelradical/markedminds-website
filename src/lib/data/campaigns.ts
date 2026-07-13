// Reusable structure for partner/conference campaign landing pages
// (e.g. `/black2school`, and future pages for Code.org, Georgia DOE,
// DeKalb, ISTE, NAACP, etc.). Only the genuinely partner-specific facts
// live here — conference/org name, the offer itself, and metadata. The
// shared pitch content (how Dani can help, support options, FAQ, About,
// the Starter Kit) lives once in `campaign-content.ts` and is reused by
// every campaign. To add a new campaign: add an entry here, then a thin
// `src/app/<slug>/page.tsx` that renders <CampaignLandingPage campaign={campaigns.<slug>} />.

export type CampaignOffer = {
  /** Promo code participants enter/quote, e.g. "B2S10". */
  code: string;
  discountPercent: number;
  /** ISO date (YYYY-MM-DD) the event ends — kept for traceability of expirationDate below. */
  eventEndDate: string;
  /** Booking window, in days, counted from eventEndDate — used only to compute expirationDate. */
  expirationDays: number;
  /**
   * Exact confirmed offer expiration date (ISO, YYYY-MM-DD), or `null` if
   * not yet confirmed. Never render a vague relative statement ("30 days
   * after the conference") publicly when this is null — leave the
   * expiration off the page entirely until a real date lands here.
   */
  expirationDate: string | null;
  eligibleServices: string[];
  /** Fixed terms bullets beyond the auto-generated expiration-date line. */
  otherTerms: string[];
};

export type CampaignMetadata = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

export type CampaignFeatures = {
  /** Starter Kit resources aren't authored yet — keep false until they exist. See ASSET_CHECKLIST.md. */
  starterKit: boolean;
};

export type Campaign = {
  /** Route segment — also used as the analytics event-name prefix. */
  slug: string;
  /** Full combined display name, e.g. "Black2SchoolMvmt Out of the Box Educator Conference". */
  campaignName: string;
  partnerName: string;
  eventName: string;
  /** The single approved sentence describing the Marked Minds/partner relationship. Do not paraphrase — see brand rules in ROADMAP.md. */
  approvedFraming: string;
  /** Full override text for the hero offer badge — keeps hero copy configurable per campaign without touching the template. */
  heroBadge: string;
  offer: CampaignOffer;
  metadata: CampaignMetadata;
  features: CampaignFeatures;
  /** `source` doubles as the referral-source value recorded on every inquiry. */
  analytics: { campaign: string; source: string };
};

export const campaigns = {
  black2school: {
    slug: "black2school",
    campaignName: "Black2SchoolMvmt Out of the Box Educator Conference",
    partnerName: "Black2SchoolMvmt",
    eventName: "Out of the Box Educator Conference 2026",
    approvedFraming:
      "An exclusive opportunity created for Black2SchoolMvmt conference participants.",
    heroBadge:
      "Save 10% on one qualifying session, consultation, or training.",
    offer: {
      code: "B2S10",
      discountPercent: 10,
      // Conference confirmed: July 23–26, 2026.
      eventEndDate: "2026-07-26",
      expirationDays: 30,
      // Confirmed: eventEndDate + expirationDays = August 25, 2026.
      expirationDate: "2026-08-25",
      eligibleServices: [
        "One-on-one educator consultation",
        "AI-supported lesson-planning session",
        "Classroom coding integration session",
        "Small-group or grade-level training",
        "Customized educator workshop",
      ],
      otherTerms: [
        "Valid for one qualifying service per conference participant",
        "Subject to scheduling and availability",
        "Travel, extended training, and significant custom-resource development may be priced separately",
        "Cannot be combined with another promotional offer",
        "Final scope and deliverables must be confirmed before work begins",
      ],
    },
    metadata: {
      title: "Black2SchoolMvmt Educator Offer | Marked Minds LLC",
      description:
        "An exclusive Black2SchoolMvmt conference offer helping educators use AI, coding, computational thinking, and creative learning strategies in practical, classroom-ready ways.",
      ogTitle: "AI + Coding Tools for Today. Impact for Tomorrow.",
      ogDescription:
        "Black2SchoolMvmt conference participants receive an exclusive offer on educator consultations, planning sessions, and professional learning from Marked Minds LLC.",
    },
    features: {
      starterKit: false,
    },
    analytics: { campaign: "black2school-2026", source: "black2school-conference" },
  },
} satisfies Record<string, Campaign>;

/** Formats an offer's confirmed expiration date for display, e.g. "August 25, 2026". Returns null (render nothing) if unconfirmed. */
export function formatOfferExpiration(offer: CampaignOffer): string | null {
  if (!offer.expirationDate) return null;
  const [year, month, day] = offer.expirationDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
