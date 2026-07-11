import { apiFetch, describeApiError } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import { absoluteMediaUrl, currencyCode, formatMoney, localizedText, numberValue, rawObject, type RawRecord } from "@/shared/api/normalizers";
import type { CatalogListParams, Course, PaginatedEnvelope, PaginationMeta } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { CourseItemView } from "../courses.types";

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

function text(value: unknown, fallback = "", locale: Locale = "en"): string {
  return localizedText(value, fallback, locale);
}

function formatPrice(value: unknown, currency: unknown, locale: Locale): string {
  return formatMoney(value, currency, locale, { maximumFractionDigits: 0 });
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

function readCategory(course: RawRecord, locale: Locale): { id: number; name: string; slug: string; type: "course" } {
  const category = rawObject(course.category);
  const id = numberValue(category?.id ?? course.categoryId ?? course.category_id, 0);
  const name = text(category?.name ?? course.categoryName ?? course.category_name, "Course", locale);
  const slug = text(category?.slug ?? course.categorySlug ?? course.category_slug ?? id, "course", locale);

  return { id, name, slug, type: "course" };
}

function readThumbnail(course: RawRecord, locale: Locale): { url: string; alt: string } | null {
  const thumbnail = rawObject(course.thumbnail) ?? rawObject(course.media) ?? rawObject(course.image);
  const directUrl = text(course.thumbnail ?? course.thumbnailUrl ?? course.thumbnail_url ?? course.imageUrl ?? course.image_url, "", locale);
  const url = text(thumbnail?.url, directUrl, locale);

  if (!url) return null;

  const title = text(course.title, "Medical course", locale);

  return {
    url: absoluteMediaUrl(url, "/images/course-1.png"),
    alt: text(thumbnail?.alt ?? thumbnail?.altText ?? thumbnail?.alt_text ?? course.title, title, locale),
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
  const category = readCategory(course, locale);
  const sections = readSections(course);
  const lessons = totalLessons(course);
  const minutes = totalMinutes(course);
  const hours = minutes > 0 ? Math.max(1, Math.ceil(minutes / 60)) : Math.max(1, numberValue(course.hours, 1));
  const title = text(course.title, "Medical course", locale);
  const slug = text(course.slug, String(course.id), locale);
  const shortDescription = text(course.shortDescription ?? course.short_description ?? course.excerpt, title, locale);
  const description = text(course.description ?? course.longDescription ?? course.long_description, shortDescription, locale);
  const thumbnail = readThumbnail(course, locale);
  const modulesCount = numberValue(course.sectionsCount ?? course.sections_count ?? course.modulesCount ?? course.modules_count, sections.length || Math.max(1, lessons));
  const amount = numberValue(course.price, 0);
  const currency = currencyCode(course.currency);

  return {
    id: String(course.id),
    title,
    instructor: text(course.instructor ?? course.teacherName ?? course.teacher_name, locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari", locale),
    categoryKey: category.id ? String(category.id) : category.slug,
    category: category.name,
    description: shortDescription,
    longDescription: description,
    price: formatPrice(amount, currency, locale),
    amount,
    currency,
    image: thumbnail?.url ?? "/images/course-1.png",
    imageAlt: thumbnail?.alt ?? title,
    hours: String(hours),
    lessons,
    modules: modulesCount,
    isCmeEligible: true,
    includes: locale === "ar" ? ["محتوى منظم", "ملفات مرجعية", "خطوات عملية"] : ["Structured content", "Reference files", "Practical steps"],
    curriculum: sections.flatMap((section) =>
      readLessons(section).map((lesson) => ({
        title: text(lesson.title, "Lesson", locale),
        description: text(lesson.summary, "", locale),
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

    const normalized = normalizePaginatedResponse(response, params);
    const courses = normalized.data.map((course) => toCourseView(course, locale));

    return {
      ...normalized,
      data: courses,
    };
  } catch (error) {
    console.error("[courses-api] failed to load courses from backend", describeApiError(error));
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
    console.error("[courses-api] failed to load course detail from backend", { slug, error: describeApiError(error) });
    return null;
  }
}
