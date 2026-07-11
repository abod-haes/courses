import { getArticles } from "@/features/articles/api/articles.api";
import type { ArticleSummary } from "@/features/articles/articles.types";
import { getBooks } from "@/features/books/api/books.api";
import type { BookItemView } from "@/features/books/books.types";
import { getCourses } from "@/features/courses/api/courses.api";
import type { CourseItemView } from "@/features/courses/courses.types";
import { apiFetch, describeApiError } from "@/shared/api/client";
import { currencyCode, formatMoney, localizedText, mediaAlt, mediaUrl, numberValue, rawObject, type RawRecord } from "@/shared/api/normalizers";
import type { Article, Book, Course } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { HomeCatalog, HomeCatalogItem, HomeMessages } from "../home.types";

type RawCourse = Course & RawRecord;
type RawBook = Book & RawRecord;
type RawArticle = Article & RawRecord;

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
    latestCourses?: RawCourse[];
    latestBooks?: RawBook[];
    latestArticles?: RawArticle[];
  }>;
}>;

function emptyHomeCatalog(): HomeCatalog {
  return {
    courses: [],
    books: [],
    articles: [],
  };
}

function text(value: unknown, fallback = "", locale: Locale = "en"): string {
  return localizedText(value, fallback, locale);
}

function stringValue(value: unknown, fallback = ""): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function formatPrice(value: number, currency: unknown, locale: Locale): string {
  return formatMoney(value, currencyCode(currency), locale);
}

function categoryName(item: RawRecord, fallback: string, locale: Locale): string {
  const category = rawObject(item.category);
  return text(category?.name ?? item.categoryName ?? item.category_name, fallback, locale);
}

function mediaFrom(item: RawRecord, key: "thumbnail" | "cover" | "image", locale: Locale): { url: string; alt: string } | null {
  const source = item[key] ?? item[`${key}Url`] ?? item[`${key}_url`] ?? item.image ?? item.imageUrl ?? item.image_url ?? item.thumbnail ?? item.thumbnailUrl ?? item.thumbnail_url ?? item.cover ?? item.coverUrl ?? item.cover_url ?? item.media;
  const fallback = key === "cover" ? "/images/book-1.png" : "/images/course-1.png";
  const url = mediaUrl(source, "");

  if (!url) return null;

  return {
    url: mediaUrl(source, fallback),
    alt: mediaAlt(source, text(item.title, "Image", locale), locale),
  };
}

function courseModules(course: RawCourse): number {
  const sections = Array.isArray(course.sections) ? course.sections : [];
  const lessons = sections.reduce((sum, section) => {
    const record = rawObject(section) ?? {};
    return sum + (Array.isArray(record.lessons) ? record.lessons.length : 0);
  }, 0);
  return numberValue(course.sectionsCount ?? course.sections_count ?? course.modulesCount ?? course.modules_count, sections.length || Math.max(1, lessons));
}

function toCourseItem(course: RawCourse, locale: Locale): HomeCatalogItem {
  const image = mediaFrom(course, "thumbnail", locale);
  const title = text(course.title, locale === "ar" ? "كورس طبي" : "Medical course", locale);

  return {
    category: categoryName(course, "Course", locale),
    title,
    author: text(course.instructor ?? course.teacherName ?? course.teacher_name, locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari", locale),
    modules: courseModules(course),
    description: text(course.shortDescription ?? course.short_description ?? course.excerpt, title, locale),
    price: formatPrice(numberValue(course.price, 0), course.currency, locale),
    image: image?.url ?? "/images/course-1.png",
    alt: image?.alt ?? title,
    href: `/courses/${text(course.slug, stringValue(course.id), locale)}`,
  };
}

function toBookItem(book: RawBook, locale: Locale): HomeCatalogItem {
  const image = mediaFrom(book, "cover", locale);
  const title = text(book.title, locale === "ar" ? "كتاب طبي" : "Medical book", locale);

  return {
    category: categoryName(book, "Book", locale),
    title,
    author: text(book.author, locale === "ar" ? "فريق IASS الأكاديمي" : "IASS Academic Team", locale),
    modules: 0,
    description: text(book.shortDescription ?? book.short_description ?? book.excerpt, title, locale),
    price: formatPrice(numberValue(book.price, 0), book.currency, locale),
    image: image?.url ?? "/images/book-1.png",
    alt: image?.alt ?? title,
    href: `/books/${text(book.slug, stringValue(book.id), locale)}`,
  };
}

function toArticleItem(article: RawArticle, locale: Locale): HomeCatalogItem {
  const image = mediaFrom(article, "image", locale);
  const title = text(article.title, "Article", locale);

  return {
    category: categoryName(article, "Article", locale),
    title,
    author: text(article.author, "IASS Academic Team", locale),
    modules: 0,
    description: text(article.excerpt ?? article.shortDescription ?? article.short_description, title, locale),
    image: image?.url ?? "/images/course-1.png",
    alt: image?.alt ?? title,
    href: `/articles/${text(article.slug, stringValue(article.id), locale)}`,
  };
}

function courseViewToHomeItem(course: CourseItemView): HomeCatalogItem {
  return {
    category: course.category,
    title: course.title,
    author: course.instructor,
    modules: course.modules,
    description: course.description,
    price: course.price,
    image: course.image,
    alt: course.imageAlt,
    href: course.href,
  };
}

function bookViewToHomeItem(book: BookItemView): HomeCatalogItem {
  return {
    category: book.category,
    title: book.title,
    author: book.author,
    modules: 0,
    description: book.description,
    price: book.price,
    image: book.image,
    alt: book.imageAlt,
    href: book.href,
  };
}

function articleSummaryToHomeItem(article: ArticleSummary): HomeCatalogItem {
  return {
    category: article.category,
    title: article.title,
    author: article.author,
    modules: 0,
    description: article.excerpt,
    image: article.image,
    alt: article.alt,
    href: article.href,
  };
}

function hasCompleteCatalog(catalog: HomeCatalog): boolean {
  return catalog.courses.length > 0 && catalog.books.length > 0 && catalog.articles.length > 0;
}

function mergeCatalog(primary: HomeCatalog, fallback: HomeCatalog): HomeCatalog {
  return {
    courses: primary.courses.length > 0 ? primary.courses : fallback.courses,
    books: primary.books.length > 0 ? primary.books : fallback.books,
    articles: primary.articles.length > 0 ? primary.articles : fallback.articles,
  };
}

async function loadCatalogFallback(locale: Locale): Promise<HomeCatalog> {
  try {
    const [coursesPage, booksPage, articlesPage] = await Promise.all([
      getCourses({ locale, page: 1, perPage: 3 }),
      getBooks({ locale, page: 1, perPage: 3 }),
      getArticles({ locale, page: 1, perPage: 3 }),
    ]);

    return {
      courses: coursesPage.data.slice(0, 3).map(courseViewToHomeItem),
      books: booksPage.data.slice(0, 3).map(bookViewToHomeItem),
      articles: articlesPage.data.slice(0, 3).map(articleSummaryToHomeItem),
    };
  } catch (error) {
    console.error("[home-api] failed to load catalog fallback", describeApiError(error));
    return emptyHomeCatalog();
  }
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

function toHomeCatalog(data: HomeApiResponse["data"], locale: Locale): HomeCatalog {
  return {
    courses: data.latestCourses?.map((course) => toCourseItem(course, locale)) ?? [],
    books: data.latestBooks?.map((book) => toBookItem(book, locale)) ?? [],
    articles: data.latestArticles?.map((article) => toArticleItem(article, locale)) ?? [],
  };
}

export async function getHomePageData(locale: Locale, fallbackMessages: HomeMessages): Promise<{ copy: HomeMessages; catalog: HomeCatalog }> {
  try {
    const response = await apiFetch<HomeApiResponse>("/home", {
      searchParams: { locale, coursesLimit: 3, booksLimit: 3, articlesLimit: 3 },
    });
    const catalogFromHome = toHomeCatalog(response.data, locale);
    const catalog = hasCompleteCatalog(catalogFromHome) ? catalogFromHome : mergeCatalog(catalogFromHome, await loadCatalogFallback(locale));
    return { copy: mergeHomeCopy(fallbackMessages, response.data), catalog };
  } catch (error) {
    console.error("[home-api] failed to load home data from backend", describeApiError(error));
    return { copy: fallbackMessages, catalog: await loadCatalogFallback(locale) };
  }
}

export async function getHomeCatalog(locale: Locale): Promise<HomeCatalog> {
  try {
    const response = await apiFetch<HomeApiResponse>("/home", {
      searchParams: { locale, coursesLimit: 3, booksLimit: 3, articlesLimit: 3 },
    });
    const catalogFromHome = toHomeCatalog(response.data, locale);
    return hasCompleteCatalog(catalogFromHome) ? catalogFromHome : mergeCatalog(catalogFromHome, await loadCatalogFallback(locale));
  } catch (error) {
    console.error("[home-api] failed to refresh home catalog", describeApiError(error));
    return loadCatalogFallback(locale);
  }
}
