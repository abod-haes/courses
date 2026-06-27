import { apiFetch } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import type { CatalogListParams, Course, PaginatedEnvelope, PaginationMeta } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { CourseItemView } from "../courses.types";

type RawRecord = Record<string, unknown>;
type RawCourse = Course & RawRecord;

type RawPaginatedResponse<T> =
  | PaginatedEnvelope<T>
  | T[]
  | Readonly<{
      data?: T[] | Readonly<{ data?: T[]; meta?: RawRecord }>;
      meta?: RawRecord;
      current_page?: number;
      per_page?: number;
      last_page?: number;
      total?: number;
      from?: number | null;
      to?: number | null;
    }>;

const backendOrigin = "https://medical-courses.mustafafares.com";

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
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

function rawObject(value: unknown): RawRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : null;
}

function absoluteMediaUrl(value: unknown, fallback: string): string {
  const url = text(value);

  if (!url) return fallback;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
}

function normalizeMeta(source: RawRecord | undefined, dataLength: number, params: CatalogListParams): PaginationMeta {
  const page = numberValue(source?.currentPage ?? source?.current_page, params.page ?? 1);
  const perPage = numberValue(source?.perPage ?? source?.per_page, params.perPage ?? defaultCatalogPerPage);
  const total = numberValue(source?.total, dataLength);
  const lastPage = numberValue(source?.lastPage ?? source?.last_page, Math.max(1, Math.ceil(total / Math.max(1, perPage))));

  return {
    currentPage: Math.max(1, page),
    perPage: Math.max(1, perPage),
    total,
    lastPage,
    from: source?.from === null || source?.from === undefined ? (total ? (Math.max(1, page) - 1) * Math.max(1, perPage) + 1 : null) : numberValue(source.from, 1),
    to: source?.to === null || source?.to === undefined ? (total ? Math.min(Math.max(1, page) * Math.max(1, perPage), total) : null) : numberValue(source.to, dataLength),
  };
}

function normalizePaginatedResponse<T>(response: RawPaginatedResponse<T>, params: CatalogListParams): PaginatedEnvelope<T> {
  if (Array.isArray(response)) {
    return { data: response, meta: buildPageMeta(response.length, params.page, params.perPage ?? defaultCatalogPerPage) };
  }

  const record = rawObject(response) ?? {};
  const nested = rawObject(record.data);
  const data = Array.isArray(record.data) ? record.data as T[] : Array.isArray(nested?.data) ? nested.data as T[] : [];
  const metaSource = (rawObject(record.meta) ?? rawObject(nested?.meta) ?? nested ?? record) as RawRecord;

  return {
    data,
    meta: normalizeMeta(metaSource, data.length, params),
  };
}

function readCategory(course: RawRecord): { id: number; name: string; slug: string; type: "course" } {
  const category = rawObject(course.category);
  const id = numberValue(category?.id ?? course.categoryId ?? course.category_id, 0);
  const name = text(category?.name ?? course.categoryName ?? course.category_name, "Course");
  const slug = text(category?.slug ?? course.categorySlug ?? course.category_slug ?? id, "course");

  return { id, name, slug, type: "course" };
}

function readThumbnail(course: RawRecord): { url: string; alt: string } | null {
  const thumbnail = rawObject(course.thumbnail) ?? rawObject(course.media) ?? rawObject(course.image);
  const directUrl = text(course.thumbnail ?? course.thumbnailUrl ?? course.thumbnail_url ?? course.imageUrl ?? course.image_url);
  const url = text(thumbnail?.url, directUrl);

  if (!url) return null;

  return {
    url: absoluteMediaUrl(url, "/images/course-1.png"),
    alt: text(thumbnail?.alt ?? thumbnail?.altText ?? thumbnail?.alt_text ?? course.title, text(course.title, "Course image")),
  };
}

function readSections(course: RawRecord): RawRecord[] {
  return Array.isArray(course.sections) ? course.sections.map(rawObject).filter((section): section is RawRecord => Boolean(section)) : [];
}

function readLessons(section: RawRecord): RawRecord[] {
  return Array.isArray(section.lessons) ? section.lessons.map(rawObject).filter((lesson): lesson is RawRecord => Boolean(lesson)) : [];
}

function totalLessons(course: RawRecord): number {
  const explicit = course.lessonsCount ?? course.lessons_count;
  if (explicit !== undefined && explicit !== null) return numberValue(explicit, 0);

  return readSections(course).reduce((sum, section) => sum + readLessons(section).length, 0);
}

function totalMinutes(course: RawRecord): number {
  const explicit = course.durationMinutes ?? course.duration_minutes;
  if (explicit !== undefined && explicit !== null) return numberValue(explicit, 0);

  return readSections(course).reduce(
    (sum, section) => sum + readLessons(section).reduce((lessonSum, lesson) => lessonSum + numberValue(lesson.durationMinutes ?? lesson.duration_minutes, 0), 0),
    0,
  );
}

function emptyCoursesPage(params: CatalogListParams): PaginatedEnvelope<CourseItemView> {
  return {
    data: [],
    meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage),
  };
}

function toCourseView(course: RawCourse, locale: Locale): CourseItemView {
  const category = readCategory(course);
  const sections = readSections(course);
  const lessons = totalLessons(course);
  const minutes = totalMinutes(course);
  const hours = minutes > 0 ? Math.max(1, Math.ceil(minutes / 60)) : Math.max(1, numberValue(course.hours, 1));
  const title = text(course.title, locale === "ar" ? "كورس طبي" : "Medical course");
  const slug = text(course.slug, String(course.id));
  const shortDescription = text(course.shortDescription ?? course.short_description ?? course.excerpt, title);
  const description = text(course.description ?? course.longDescription ?? course.long_description, shortDescription);
  const thumbnail = readThumbnail(course);
  const price = numberValue(course.price, 0);
  const modulesCount = numberValue(course.sectionsCount ?? course.sections_count ?? course.modulesCount ?? course.modules_count, sections.length || Math.max(1, lessons));

  return {
    id: String(course.id),
    title,
    instructor: text(course.instructor ?? course.teacherName ?? course.teacher_name, locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari"),
    categoryKey: category.id ? String(category.id) : category.slug,
    category: category.name,
    description: shortDescription,
    longDescription: description,
    price: formatPrice(price, course.currency, locale),
    image: thumbnail?.url ?? "/images/course-1.png",
    imageAlt: thumbnail?.alt ?? title,
    hours: String(hours),
    lessons,
    modules: modulesCount,
    isCmeEligible: true,
    includes: locale === "ar" ? ["محتوى منظم", "ملفات مرجعية", "خطوات عملية"] : ["Structured content", "Reference files", "Practical steps"],
    curriculum: sections.flatMap((section) =>
      readLessons(section).map((lesson) => ({
        title: text(lesson.title, locale === "ar" ? "درس" : "Lesson"),
        description: text(lesson.summary, ""),
        duration: `${numberValue(lesson.durationMinutes ?? lesson.duration_minutes, 0)}:00`,
      })),
    ),
    href: `/courses/${slug}`,
  };
}

export async function getCourses(params: CatalogListParams): Promise<PaginatedEnvelope<CourseItemView>> {
  const locale = params.locale ?? "en";

  try {
    const response = await apiFetch<RawPaginatedResponse<RawCourse>>("/courses", {
      searchParams: {
        locale,
        page: params.page,
        perPage: params.perPage,
        search: params.search,
        sort: params.sort ?? "-publishedAt",
        "filter[categoryId]": params.category,
      },
    });

    console.log("[courses-api] raw backend response", response);

    const normalized = normalizePaginatedResponse(response, params);
    const courses = normalized.data.map((course) => toCourseView(course, locale));

    console.log("[courses-api] normalized courses", { count: courses.length, meta: normalized.meta, courses });

    return {
      ...normalized,
      data: courses,
    };
  } catch (error) {
    console.error("[courses-api] failed to load courses from backend", error);
    return emptyCoursesPage(params);
  }
}

export async function getCourseBySlug(slug: string, locale: Locale): Promise<CourseItemView | null> {
  try {
    const response = await apiFetch<{ data?: RawCourse } | RawCourse>(`/courses/${slug}`, {
      searchParams: { locale },
    });
    const record = rawObject(response);
    const payload = record?.data && rawObject(record.data) ? record.data as RawCourse : response as RawCourse;

    return toCourseView(payload, locale);
  } catch (error) {
    console.error("[courses-api] failed to load course detail from backend", { slug, error });
    return null;
  }
}
