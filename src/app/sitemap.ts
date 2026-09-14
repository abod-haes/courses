import type { MetadataRoute } from "next";
import { getArticles } from "@/features/articles/api/articles.api";
import { getBooks } from "@/features/books/api/books.api";
import { getCourses } from "@/features/courses/api/courses.api";
import { absoluteUrl } from "@/shared/lib/seo";

type StaticRoute = Readonly<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}>;

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

function validDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function courseEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= sitemapMaxPages; page += 1) {
    const result = await getCourses({ locale: "en", page, perPage: sitemapPageSize, sort: "-publishedAt" });

    entries.push(
      ...result.data.map((course) => ({
        url: absoluteUrl(course.href),
        lastModified: validDate(course.updatedAt ?? course.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    );

    if (page >= result.meta.lastPage) break;
  }

  return entries;
}

async function bookEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= sitemapMaxPages; page += 1) {
    const result = await getBooks({ locale: "en", page, perPage: sitemapPageSize, sort: "-publishedAt" });

    entries.push(
      ...result.data.map((book) => ({
        url: absoluteUrl(book.href),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    );

    if (page >= result.meta.lastPage) break;
  }

  return entries;
}

async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= sitemapMaxPages; page += 1) {
    const result = await getArticles({ locale: "en", page, perPage: sitemapPageSize, sort: "-publishedAt" });

    entries.push(
      ...result.data.map((article) => ({
        url: absoluteUrl(article.href),
        lastModified: validDate(article.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );

    if (page >= result.meta.lastPage) break;
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

  const [courses, books, articles] = await Promise.all([courseEntries(), bookEntries(), articleEntries()]);

  return [...staticEntries, ...courses, ...books, ...articles];
}
