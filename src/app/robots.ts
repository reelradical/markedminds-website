import type { MetadataRoute } from "next";

import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Post-purchase confirmation pages are already noindex (see their
      // own page metadata) — this additionally stops crawlers/scanners
      // from fetching them at all, which noindex alone does not do.
      disallow: ["/black2school/thank-you", "/planner"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
