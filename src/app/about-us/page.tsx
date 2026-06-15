import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AboutPage } from "@/features/about/about-page.component";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "من نحن | IASS"
      : "About Us | IASS",
    description: isArabic
      ? "تعرف على الأكاديمية الدولية لعلوم ومهارات التجميل IASS والدكتور إياس عكاري ورؤية التدريب الاحترافي في الطب التجميلي."
      : "Learn about IASS, Dr. Iyas Akkari, and the academy vision for professional aesthetic medicine training.",
    alternates: {
      canonical: "/about-us",
    },
    openGraph: {
      title: isArabic ? "من نحن | IASS" : "About Us | IASS",
      description: isArabic
        ? "منصة تعليمية رقمية للتدريب على الطب التجميلي المبني على العلم، الدقة، والأمان."
        : "A digital academy for aesthetic medicine training built on science, precision, and safety.",
      type: "website",
      url: "/about-us",
    },
  };
}

export default async function Page() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore.get(localeCookieName)?.value);

  return <AboutPage locale={locale} />;
}
