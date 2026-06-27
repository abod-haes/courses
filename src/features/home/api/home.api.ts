import { apiFetch } from "@/shared/api/client";
import type { Article, Book, Course } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { HomeCatalog, HomeCatalogItem, HomeMessages } from "../home.types";

type RawRecord = Record<string, unknown>;
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

const backendOrigin = "https://medical-courses.mustafafares.com";

function emptyHomeCatalog(): HomeCatalog {
  return {
    courses: [],
    books: [],
    articles: [],
  };
}

function rawObject(value: unknown): RawRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : null;
}

function text(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  const record = rawObject(value);
  if (!record) return fallback;
  return text(record.en) || text(record.ar) || fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function currencyCode(value: unknown): string {
  const normalized = text(value, "USD").toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "USD";
}

function formatPrice(value: number, currency: unknown, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: currencyCode(currency),
    maximumFractionDigits: 0,
  }).format(value);
}

function absoluteMediaUrl(value: unknown, fallback: string): string {
  const url = text(value);
  if (!url) return fallback;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
}

function categoryName(item: RawRecord, fallback: string): string {
  const category = rawObject(item.category);
  return text(category?.name ?? item.categoryName ?? item.category_name, fallback);
}

function mediaFrom(item: RawRecord, key: "thumbnail" | "cover" | "image"): { url: string; alt: string } | null {
  const media = rawObject(item[key]) ?? rawObject(item.media) ?? rawObject(item.image) ?? rawObject(item.thumbnail) ?? rawObject(item.cover);
  const directUrl = text(item[key] ?? item[`${key}Url`] ?? item[`${key}_url`] ?? item.imageUrl ?? item.image_url ?? item.thumbnailUrl ?? item.thumbnail_url ?? item.coverUrl ?? item.cover_url);
  const url = text(media?.url, directUrl);

  if (!url) return null;

  return {
    url: absoluteMediaUrl(url, key === "cover" ? "/images/book-1.png" : "/images/course-1.png"),
    alt: text(media?.alt ?? media?.altText ?? media?.alt_text ?? item.title, text(item.title, "Image")),
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
  const image = mediaFrom(course, "thumbnail");
  const title = text(course.title, locale === "ar" ? "كورس طبي" : "Medical course");

  return {
    category: categoryName(course, "Course"),
    title,
    author: text(course.instructor ?? course.teacherName ?? course.teacher_name, locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari"),
    modules: courseModules(course),
    description: text(course.shortDescription ?? course.short_description ?? course.excerpt, title),
    price: formatPrice(numberValue(course.price, 0), course.currency, locale),
    image: image?.url ?? "/images/course-1.png",
    alt: image?.alt ?? title,
    href: `/courses/${text(course.slug, String(course.id))}`,
  };
}

function toBookItem(book: RawBook, locale: Locale): HomeCatalogItem {
  const image = mediaFrom(book, "cover");
  const title = text(book.title, locale === "ar" ? "كتاب طبي" : "Medical book");

  return {
    category: categoryName(book, "Book"),
    title,
    author: text(book.author, locale === "ar" ? "فريق IASS الأكاديمي" : "IASS Academic Team"),
    modules: 0,
    description: text(book.shortDescription ?? book.short_description ?? book.excerpt, title),
    price: formatPrice(numberValue(book.price, 0), book.currency, locale),
    image: image?.url ?? "/images/book-1.png",
    alt: image?.alt ?? title,
    href: `/books/${text(book.slug, String(book.id))}`,
  };
}

function toArticleItem(article: RawArticle): HomeCatalogItem {
  const image = mediaFrom(article, "image");
  const title = text(article.title, "Article");

  return {
    category: categoryName(article, "Article"),
    title,
    author: text(article.author, "IASS Academic Team"),
    modules: 0,
    description: text(article.excerpt ?? article.shortDescription ?? article.short_description, title),
    image: image?.url ?? "/images/course-1.png",
    alt: image?.alt ?? title,
    href: `/articles/${text(article.slug, String(article.id))}`,
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

function toHomeCatalog(data: HomeApiResponse["data"], locale: Locale): HomeCatalog {
  return {
    courses: data.latestCourses?.map((course) => toCourseItem(course, locale)) ?? [],
    books: data.latestBooks?.map((book) => toBookItem(book, locale)) ?? [],
    articles: data.latestArticles?.map(toArticleItem) ?? [],
  };
}

export async function getHomePageData(locale: Locale, fallbackMessages: HomeMessages): Promise<{ copy: HomeMessages; catalog: HomeCatalog }> {
  try {
    const response = await apiFetch<HomeApiResponse>("/home", {
      searchParams: { locale, coursesLimit: 3, booksLimit: 3, articlesLimit: 3 },
    });
    const catalog = toHomeCatalog(response.data, locale);
    return { copy: mergeHomeCopy(fallbackMessages, response.data), catalog };
  } catch (error) {
    console.error("[home-api] failed to load home data from backend", error);
    return { copy: fallbackMessages, catalog: emptyHomeCatalog() };
  }
}

export async function getHomeCatalog(locale: Locale): Promise<HomeCatalog> {
  try {
    const response = await apiFetch<HomeApiResponse>("/home", {
      searchParams: { locale, coursesLimit: 3, booksLimit: 3, articlesLimit: 3 },
    });
    return toHomeCatalog(response.data, locale);
  } catch (error) {
    console.error("[home-api] failed to refresh home catalog from backend", error);
    return emptyHomeCatalog();
  }
}
