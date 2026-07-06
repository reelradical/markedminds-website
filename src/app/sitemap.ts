import type { MetadataRoute } from "next";

import { site } from "@/lib/data/site";

const routes = [
  "",
  "/about",
  "/focus-flex",
  "/programs",
  "/impact",
  "/gallery",
  "/donate",
  "/partners",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
