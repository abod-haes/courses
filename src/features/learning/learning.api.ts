import { ApiError, apiFetch } from "@/shared/api/client";
import type { ApiEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";

export type LearningLessonSummary = Readonly<{
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  sortOrder: number;
  href: string;
}>;

export type LearningSection = Readonly<{
  id: number;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: LearningLessonSummary[];
}>;

export type LearningCourse = Readonly<{
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  thumbnail: string | null;
  sections: LearningSection[];
  firstLesson: Readonly<{
    id: number;
    title: string;
    href: string;
  }> | null;
}>;

export type ProtectedLesson = Readonly<{
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  videoUrl: string | null;
  videoMediaUrl: string | null;
  courseId: number;
  sectionId: number;
  sortOrder: number;
}>;

function authHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

function handleProtectedError(error: unknown): never {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
    throw error;
  }

  throw error;
}

export async function getLearningCourse(courseId: string | number, locale: Locale, token?: string): Promise<LearningCourse> {
  return apiFetch<ApiEnvelope<LearningCourse> | LearningCourse>(`/my/courses/${courseId}`, {
    headers: authHeaders(token),
    searchParams: { locale },
  })
    .then(unwrap)
    .catch(handleProtectedError);
}

export async function getProtectedLesson(courseId: string | number, lessonId: string | number, locale: Locale, token?: string): Promise<ProtectedLesson> {
  return apiFetch<ApiEnvelope<ProtectedLesson> | ProtectedLesson>(`/my/courses/${courseId}/lessons/${lessonId}`, {
    headers: authHeaders(token),
    searchParams: { locale },
  })
    .then(unwrap)
    .catch(handleProtectedError);
}
