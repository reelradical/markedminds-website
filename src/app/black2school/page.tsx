import type { Metadata } from "next";

import { campaigns } from "@/lib/data/campaigns";
import { site } from "@/lib/data/site";
import { CampaignLandingPage } from "@/components/campaign/campaign-landing-page";

const campaign = campaigns.black2school;

// Public but unlisted campaign page — intentionally NOT in `nav.ts` (so it
// never appears in the Navbar/Footer) and NOT in `sitemap.ts`. `robots`
// below still allows it to be followed/shared, just not indexed as a
// standalone search result. See ROADMAP.md for the pre-publish checklist.
export const metadata: Metadata = {
  title: { absolute: campaign.metadata.title },
  description: campaign.metadata.description,
  alternates: { canonical: `/${campaign.slug}` },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${site.url}/${campaign.slug}`,
    siteName: site.name,
    title: campaign.metadata.ogTitle,
    description: campaign.metadata.ogDescription,
    locale: "en_US",
    images: [
      {
        url: "/social/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${campaign.metadata.ogTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: campaign.metadata.ogTitle,
    description: campaign.metadata.ogDescription,
    images: ["/social/og-image.jpg"],
  },
};

export default function Black2SchoolPage() {
  return <CampaignLandingPage campaign={campaign} />;
}
