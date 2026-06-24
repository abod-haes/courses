import { apiFetch } from "@/shared/api/client";
import type { Article, Book, Course } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { HomeCatalog, HomeCatalogItem, HomeMessages } from "../home.types";

type HomeApiResponse = Readonly<{
  data: Readonly<{
    hero?: Readonly<{
      title?: string;
      subtitle?: string;
      primaryCta?: Readonly<{ label?: string; href?: string }>;
      secondaryCta?: Readonly<{ label?: string; href?: string }>;
    }>;
    sections?: Partial<HomeMessages["sections"]>;
    stats?: Partial<HomeMessages["stats"]>;
    aboutUs?: Partial<HomeMessages["aboutUs"]>;
    founder?: Partial<HomeMessages["founder"]>;
    latestCourses?: Course[];
    latestBooks?: Book[];
    latestArticles?: Article[];
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
  const sections = course.sections ?? [];
  const lessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  return sections.length || Math.max(1, lessons);
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
    author: article.author ?? "IASS Academic Team",
    modules: 0,
    description: article.excerpt,
    image: article.image?.url ?? "/images/course-1.png",
    alt: article.image?.alt ?? article.title,
    href: `/articles/${article.slug}`,
  };
}

function mergeHomeCopy(fallback: HomeMessages, apiData: HomeApiResponse["data"]): HomeMessages {
  return {
    ...fallback,
    actions: {
      ...fallback.actions,
      browseCourses: apiData.hero?.primaryCta?.label ?? fallback.actions.browseCourses,
      exploreBooks: apiData.hero?.secondaryCta?.label ?? fallback.actions.exploreBooks,
    },
    hero: {
      ...fallback.hero,
      title: apiData.hero?.title ?? fallback.hero.title,
      subtitle: apiData.hero?.subtitle ?? fallback.hero.subtitle,
    },
    sections: {
      courses: { ...fallback.sections.courses, ...(apiData.sections?.courses ?? {}) },
      books: { ...fallback.sections.books, ...(apiData.sections?.books ?? {}) },
      articles: { ...fallback.sections.articles, ...(apiData.sections?.articles ?? {}) },
    },
    stats: {
      ...fallback.stats,
      ...(apiData.stats ?? {}),
      items: apiData.stats?.items ?? fallback.stats.items,
    },
    aboutUs: {
      ...fallback.aboutUs,
      ...(apiData.aboutUs ?? {}),
      highlights: apiData.aboutUs?.highlights ?? fallback.aboutUs.highlights,
    },
    founder: {
      ...fallback.founder,
      ...(apiData.founder ?? {}),
    },
  };
}

function toHomeCatalog(data: HomeApiResponse["data"], locale: Locale, fallback: HomeCatalog): HomeCatalog {
  return {
    courses: data.latestCourses?.map((course) => toCourseItem(course, locale)) ?? fallback.courses,
    books: data.latestBooks?.map((book) => toBookItem(book, locale)) ?? fallback.books,
    articles: data.latestArticles?.map(toArticleItem) ?? fallback.articles,
  };
}

export async function getHomePageData(
  locale: Locale,
  fallbackMessages: HomeMessages,
): Promise<{ copy: HomeMessages; catalog: HomeCatalog }> {
  try {
    const response = await apiFetch<HomeApiResponse>("/home", {
      searchParams: {
        locale,
        coursesLimit: 3,
        booksLimit: 3,
        articlesLimit: 3,
      },
    });

    return {
      copy: mergeHomeCopy(fallbackMessages, response.data),
      catalog: toHomeCatalog(response.data, locale, fallbackMessages.catalog),
    };
  } catch {
    return {
      copy: fallbackMessages,
      catalog: fallbackMessages.catalog,
    };
  }
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

  return toHomeCatalog(response.data, locale, { courses: [], books: [], articles: [] });
}
