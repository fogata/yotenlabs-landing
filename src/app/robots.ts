import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/en", "/pt-br"],
    },
    sitemap: "https://yotenlabs.ai/sitemap.xml",
  };
}
