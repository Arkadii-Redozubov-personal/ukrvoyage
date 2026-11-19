import type { MetadataRoute } from "next";

const BASE_URL = "https://ukrvoyazh-demo.local";
const LAST_MODIFIED = new Date("2026-11-19T15:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/fleet", "/booking", "/about", "/contacts", "/privacy"];
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    entries.push({
      url: `${BASE_URL}/uk${route}`,
      lastModified: LAST_MODIFIED,
      alternates: {
        languages: {
          uk: `${BASE_URL}/uk${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });
    entries.push({
      url: `${BASE_URL}/en${route}`,
      lastModified: LAST_MODIFIED,
      alternates: {
        languages: {
          uk: `${BASE_URL}/uk${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });
  }

  return entries;
}

