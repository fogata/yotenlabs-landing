import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/en", "/pt-br", "/en/pitch-deck", "/pt-br/pitch-deck"];

  return routes.map((route) => ({
    url: `https://yotenlabs.ai${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/en" ? 1 : route.includes("pitch-deck") ? 0.8 : 0.9,
  }));
}
