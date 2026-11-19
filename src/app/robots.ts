import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/uk/", "/en/"],
        disallow: ["/api/", "/uk/demo-requests", "/en/demo-requests"],
      },
    ],
    sitemap: "https://ukrvoyazh-demo.local/sitemap.xml",
  };
}

