import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CoursesLibrary } from "@/features/courses/components/courses-library.component";
import { getCoursesPageCopy } from "@/features/courses/courses.data";
import { getCourses } from "@/features/courses/api/courses.api";
import { defaultCatalogPerPage } from "@/shared/api/paging";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { createSeoMetadata, itemListJsonLd } from "@/shared/lib/seo";
import type { Locale } from "@/shared/lib/types";

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getCoursesPageCopy(locale);

  return createSeoMetadata({
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/courses",
    locale,
    keywords: locale === "ar" ? ["كورسات طب تجميلي", "كورسات طبية أونلاين"] : ["aesthetic medicine courses", "online medical courses"],
  });
}

export default async function Page() {
  const locale = await getCurrentLocale();
  const initialPage = await getCourses({ locale, page: 1, perPage: defaultCatalogPerPage });

  return (
    <>
      <JsonLd data={itemListJsonLd(initialPage.data.map((course) => ({ name: course.title, path: course.href })))} />
      <CoursesLibrary copy={getCoursesPageCopy(locale)} initialPage={initialPage} locale={locale} />
    </>
  );
}
