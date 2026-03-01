import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/en", "/pt-br"];

  return routes.map((route) => ({
    url: `https://yotenlabs.ai${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/en" ? 1 : 0.9,
  }));
}
