import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AboutPage } from "@/features/about/about-page.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { createSeoMetadata } from "@/shared/lib/seo";
import type { Locale } from "@/shared/lib/types";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);
  const isArabic = locale === "ar";

  return createSeoMetadata({
    title: isArabic ? "من نحن | IASS" : "About Us | IASS",
    description: isArabic
      ? "تعرف على الأكاديمية الدولية لعلوم ومهارات التجميل IASS والدكتور إياس عكاري ورؤية التدريب الاحترافي في الطب التجميلي."
      : "Learn about IASS, Dr. Iyas Akkari, and the academy vision for professional aesthetic medicine training.",
    path: "/about-us",
    locale,
    image: "/images/hero-blue.png",
    imageAlt: isArabic ? "الأكاديمية الدولية لعلوم ومهارات التجميل" : "International Academy of Aesthetic Science and Skills",
    keywords: isArabic ? ["إياس عكاري", "أكاديمية طب تجميلي"] : ["Dr. Iyas Akkari", "aesthetic medicine academy"],
  });
}

export default async function Page() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);

  return <AboutPage locale={locale} />;
}
