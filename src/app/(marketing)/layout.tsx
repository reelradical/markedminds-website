import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { site } from "@/lib/data/site";

// These tools are intentionally scoped to public marketing pages. The Planner
// layout does not render this component, so private planning work is never
// exposed to Clarity session replay or marketing page-view tracking.
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Marked Minds",
    "education technology",
    "Focus + FLEX Academy",
    "educator services",
    "AI for classrooms",
    "educator workshops",
    "project-based learning",
    "AI literacy for classrooms",
    "community-centered education",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    locale: "en_US",
    images: [
      {
        url: "/social/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: ["/social/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/logos/marked-minds-logo-white-black-orange.svg`,
  description: site.description,
  email: site.email,
  sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin],
  subOrganization: {
    "@type": "EducationalOrganization",
    name: "Focus + FLEX Academy",
    description:
      "A Marked Minds Initiative delivering small-group, project-based learning.",
    url: `${site.url}/focus-flex`,
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {clarityId && <MicrosoftClarity clarityId={clarityId} />}
      <Analytics />
    </div>
  );
}
