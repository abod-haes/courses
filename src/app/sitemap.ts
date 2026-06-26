import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/lib/seo";

const apiBaseUrl = "https://medical-courses.mustafafares.com/api";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/about-us", priority: 0.8 },
  { path: "/courses", priority: 0.9 },
  { path: "/books", priority: 0.85 },
  { path: "/articles", priority: 0.8 },
] as const;

type SitemapItem = Readonly<{
  slug?: unknown;
  publishedAt?: unknown;
  published_at?: unknown;
  updatedAt?: unknown;
  updated_at?: unknown;
}>;

type SitemapResponse = Readonly<{
  data?: SitemapItem[] | Readonly<{ data?: SitemapItem[] }>;
}>;

function itemsFromPayload(payload: unknown): SitemapItem[] {
  if (Array.isArray(payload)) return payload as SitemapItem[];

  if (!payload || typeof payload !== "object") return [];

  const record = payload as SitemapResponse;

  if (Array.isArray(record.data)) return record.data;

  if (record.data && typeof record.data === "object" && Array.isArray(record.data.data)) {
    return record.data.data;
  }

  return [];
}

function dateFromItem(item: SitemapItem, fallback: Date): Date {
  const value = item.updatedAt ?? item.updated_at ?? item.publishedAt ?? item.published_at;
  const date = typeof value === "string" ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date : fallback;
}

async function loadResourceRoutes(resource: "courses" | "books" | "articles", priority: number, now: Date): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${apiBaseUrl}/${resource}?locale=en&perPage=100`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const payload = await response.json() as SitemapResponse;

    return itemsFromPayload(payload)
      .map((item) => {
        const slug = typeof item.slug === "string" && item.slug.trim() ? item.slug.trim() : null;
        if (!slug) return null;

        return {
          url: absoluteUrl(`/${resource}/${slug}`),
          lastModified: dateFromItem(item, now),
          changeFrequency: "weekly" as const,
          priority,
        };
      })
      .filter((item): item is MetadataRoute.Sitemap[number] => Boolean(item));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [courses, books, articles] = await Promise.all([
    loadResourceRoutes("courses", 0.72, now),
    loadResourceRoutes("books", 0.68, now),
    loadResourceRoutes("articles", 0.62, now),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...courses,
    ...books,
    ...articles,
  ];
}
