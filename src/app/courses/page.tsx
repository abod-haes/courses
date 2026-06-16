import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CoursesLibrary } from "@/features/courses/components/courses-library.component";
import { getCoursesPageCopy } from "@/features/courses/courses.data";
import { getCourses } from "@/features/courses/api/courses.api";
import { defaultCatalogPerPage } from "@/shared/api/paging";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCoursesPageCopy(locale);

  return {
    title: { absolute: copy.meta.title },
    description: copy.meta.description,
    alternates: { canonical: "/courses" },
    openGraph: { title: copy.meta.ogTitle, description: copy.meta.ogDescription, type: "website", url: "/courses" },
    twitter: { card: "summary_large_image", title: copy.meta.title, description: copy.meta.description },
  };
}

export default async function Page() {
  const locale = await getCurrentLocale();
  const initialPage = await getCourses({ locale, page: 1, perPage: defaultCatalogPerPage });

  return <CoursesLibrary copy={getCoursesPageCopy(locale)} initialPage={initialPage} locale={locale} />;
}
