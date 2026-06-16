import type { MetadataRoute } from "next";
import { getMockArticles, getMockBooks, getMockCourses } from "@/mocks/website/data";
import { absoluteUrl } from "@/shared/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/about-us", priority: 0.8 },
  { path: "/courses", priority: 0.9 },
  { path: "/books", priority: 0.85 },
  { path: "/articles", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const courses = getMockCourses("en").map((course) => ({
    url: absoluteUrl(`/courses/${course.slug}`),
    lastModified: course.publishedAt ? new Date(course.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));
  const books = getMockBooks("en").map((book) => ({
    url: absoluteUrl(`/books/${book.slug}`),
    lastModified: book.publishedAt ? new Date(book.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.68,
  }));
  const articles = getMockArticles("en").map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.62,
  }));

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
