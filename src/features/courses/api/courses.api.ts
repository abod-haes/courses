import { apiFetch } from "@/shared/api/client";
import type { Course, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { CourseItemView } from "../courses.types";

function formatPrice(value: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function totalLessons(course: Course): number {
  return (course.sections ?? []).reduce((sum, section) => sum + section.lessons.length, 0);
}

function totalMinutes(course: Course): number {
  return (course.sections ?? []).reduce(
    (sum, section) => sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.durationMinutes, 0),
    0,
  );
}

function toCourseView(course: Course, locale: Locale): CourseItemView {
  const sections = course.sections ?? [];
  const lessons = totalLessons(course);
  const hours = lessons > 0 ? Math.max(1, Math.ceil(totalMinutes(course) / 60)) : 1;

  return {
    id: String(course.id),
    title: course.title,
    instructor: locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari",
    categoryKey: course.category.slug,
    category: course.category.name,
    description: course.shortDescription,
    longDescription: course.description ?? course.shortDescription,
    price: formatPrice(course.price, course.currency, locale),
    image: course.thumbnail?.url ?? "/images/course-1.png",
    imageAlt: course.thumbnail?.alt ?? course.title,
    hours: String(hours),
    lessons,
    modules: sections.length || Math.max(1, lessons),
    isCmeEligible: true,
    includes: locale === "ar" ? ["محتوى منظم", "ملفات مرجعية", "خطوات عملية"] : ["Structured content", "Reference files", "Practical steps"],
    curriculum: sections.flatMap((section) =>
      section.lessons.map((lesson) => ({
        title: lesson.title,
        description: lesson.summary,
        duration: `${lesson.durationMinutes}:00`,
      })),
    ),
    href: `/courses/${course.slug}`,
  };
}

export async function getCourses(params: CatalogListParams): Promise<PaginatedEnvelope<CourseItemView>> {
  const locale = params.locale ?? "en";
  const response = await apiFetch<PaginatedEnvelope<Course>>("/courses", {
    searchParams: {
      locale,
      page: params.page,
      perPage: params.perPage,
      search: params.search,
      sort: params.sort ?? "-publishedAt",
      "filter[category]": params.category,
    },
  });

  return {
    ...response,
    data: response.data.map((course) => toCourseView(course, locale)),
  };
}

export async function getCourseBySlug(slug: string, locale: Locale): Promise<CourseItemView | null> {
  try {
    const response = await apiFetch<{ data: Course }>(`/courses/${slug}`, {
      searchParams: { locale },
    });

    return toCourseView(response.data, locale);
  } catch {
    return null;
  }
}
