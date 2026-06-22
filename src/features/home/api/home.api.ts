import { apiFetch } from "@/shared/api/client";
import type { Article, Book, Course } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { HomeCatalog, HomeCatalogItem } from "../home.types";

type HomeApiResponse = Readonly<{
  data: Readonly<{
    latestCourses: Course[];
    latestBooks: Book[];
    latestArticles: Article[];
  }>;
}>;

function formatPrice(value: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function courseModules(course: Course): number {
  return course.sections.length || Math.max(1, course.sections.reduce((sum, section) => sum + section.lessons.length, 0));
}

function toCourseItem(course: Course, locale: Locale): HomeCatalogItem {
  return {
    category: course.category.name,
    title: course.title,
    author: locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari",
    modules: courseModules(course),
    description: course.shortDescription,
    price: formatPrice(course.price, course.currency, locale),
    image: course.thumbnail?.url ?? "/images/course-1.png",
    alt: course.thumbnail?.alt ?? course.title,
    href: `/courses/${course.slug}`,
  };
}

function toBookItem(book: Book, locale: Locale): HomeCatalogItem {
  return {
    category: book.category.name,
    title: book.title,
    author: locale === "ar" ? "فريق IASS الأكاديمي" : "IASS Academic Team",
    modules: 0,
    description: book.shortDescription,
    price: formatPrice(book.price, book.currency, locale),
    image: book.cover?.url ?? "/images/book-1.png",
    alt: book.cover?.alt ?? book.title,
    href: `/books/${book.slug}`,
  };
}

function toArticleItem(article: Article): HomeCatalogItem {
  return {
    category: article.category.name,
    title: article.title,
    author: article.author,
    modules: 0,
    description: article.excerpt,
    image: article.image?.url ?? "/images/course-1.png",
    alt: article.image?.alt ?? article.title,
    href: `/articles/${article.slug}`,
  };
}

export async function getHomeCatalog(locale: Locale): Promise<HomeCatalog> {
  const response = await apiFetch<HomeApiResponse>("/home", {
    searchParams: {
      locale,
      coursesLimit: 3,
      booksLimit: 3,
      articlesLimit: 3,
    },
  });

  return {
    courses: response.data.latestCourses.map((course) => toCourseItem(course, locale)),
    books: response.data.latestBooks.map((book) => toBookItem(book, locale)),
    articles: response.data.latestArticles.map(toArticleItem),
  };
}
