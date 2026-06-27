import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/lib/seo";

type StaticRoute = Readonly<{
  path: string;
  priority: number;
}>;

const staticRoutes: readonly StaticRoute[] = [
  { path: "/", priority: 1 },
  { path: "/about-us", priority: 0.8 },
  { path: "/courses", priority: 0.9 },
  { path: "/books", priority: 0.85 },
  { path: "/articles", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
