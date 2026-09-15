import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/lib/seo";

type StaticRoute = Readonly<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}>;

type RawRecord = Record<string, unknown>;

const staticRoutes: readonly StaticRoute[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/courses", priority: 0.9, changeFrequency: "daily" },
  { path: "/books", priority: 0.85, changeFrequency: "daily" },
  { path: "/articles", priority: 0.85, changeFrequency: "daily" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
];

const sitemapPageSize = 100;
const sitemapMaxPages = 100;
const defaultApiBaseUrl = "https://medical-courses.mustafafares.com/api";

function record(value: unknown): RawRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as RawRecord) : null;
}

function numberValue(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function localizedString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  const object = record(value);
  if (!object) return "";
  const candidate = object.en ?? object.ar;
  return typeof candidate === "string" ? candidate.trim() : "";
}

function validDate(value: unknown): Date | undefined {
  const text = typeof value === "string" ? value : "";
  if (!text) return undefined;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function apiBaseUrl(): string {
  return (process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultApiBaseUrl).replace(/\/+$/, "");
}

function pagePayload(payload: unknown, currentPage: number): { items: RawRecord[]; lastPage: number } {
  if (Array.isArray(payload)) {
    return { items: payload.map(record).filter((item): item is RawRecord => Boolean(item)), lastPage: currentPage };
  }

  const root = record(payload) ?? {};
  const nested = record(root.data);
  const source = Array.isArray(root.data) ? root.data : Array.isArray(nested?.data) ? nested.data : [];
  const items = source.map(record).filter((item): item is RawRecord => Boolean(item));
  const meta = record(root.meta) ?? record(nested?.meta) ?? nested ?? root;
  const lastPage = numberValue(meta.lastPage ?? meta.last_page, currentPage);

  return { items, lastPage };
}

async function fetchCatalogPage(resource: "courses" | "books" | "articles", page: number): Promise<{ items: RawRecord[]; lastPage: number }> {
  const url = new URL(`${apiBaseUrl()}/${resource}`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("perPage", String(sitemapPageSize));
  url.searchParams.set("sort", "-publishedAt");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "X-Accept-Language": "en",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Sitemap API request failed: ${resource} returned ${response.status}`);
  }

  return pagePayload(await response.json(), page);
}

async function dynamicEntries(
  resource: "courses" | "books" | "articles",
  prefix: "/courses" | "/books" | "/articles",
  priority: number,
): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  try {
    for (let page = 1; page <= sitemapMaxPages; page += 1) {
      const result = await fetchCatalogPage(resource, page);

      for (const item of result.items) {
        const slug = localizedString(item.slug);
        if (!slug) continue;

        entries.push({
          url: absoluteUrl(`${prefix}/${encodeURIComponent(slug)}`),
          lastModified: validDate(item.updatedAt ?? item.updated_at ?? item.publishedAt ?? item.published_at),
          changeFrequency: "monthly",
          priority,
        });
      }

      if (page >= result.lastPage) break;
    }
  } catch (error) {
    console.error(`[sitemap] failed to load ${resource}`, error instanceof Error ? error.message : error);
  }

  return entries;
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [courses, books, articles] = await Promise.all([
    dynamicEntries("courses", "/courses", 0.8),
    dynamicEntries("books", "/books", 0.75),
    dynamicEntries("articles", "/articles", 0.7),
  ]);

  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...staticEntries, ...courses, ...books, ...articles]) uniqueEntries.set(entry.url, entry);

  return [...uniqueEntries.values()];
}
