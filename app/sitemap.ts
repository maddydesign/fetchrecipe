import type { MetadataRoute } from "next";
import { sites } from "@/data/sites";

const BASE_URL = "https://fetchrecipe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/free-recipe-printer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/justtherecipe-alternative`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const sitePages: MetadataRoute.Sitemap = sites.map((site) => ({
    url: `${BASE_URL}/extract-from/${site.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...sitePages];
}
