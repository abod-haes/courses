import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cairo, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { ClinicalCursorFollower } from "@/shared/components/clinical-cursor-follower";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { localeCookieName, themeCookieName } from "@/shared/lib/preferences";
import { messagesByLocale } from "@/shared/lib/messages";
import { getLocaleDirection, resolveLocale, resolveTheme } from "@/shared/lib/helpers/locale.helper";
import { createSeoMetadata, organizationJsonLd, websiteJsonLd } from "@/shared/lib/seo";
import { getHomeMessages } from "@/features/home/home.data";
import { HomeFooter } from "@/features/home/components/home-footer.component";
import { HomeHeader } from "@/features/home/components/home-header.component";
import "./globals.css";
import "./typography.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = createSeoMetadata({
  title: "IASS - International Academy of Aesthetic Science and Skills",
  description:
    "IASS is a bilingual digital academy for aesthetic medicine courses, books, and articles focused on anatomy, safety, and clinical protocols.",
  path: "/",
  image: "/images/hero-blue.png",
  imageAlt: "IASS aesthetic medicine academy",
  keywords: [
    "medical education platform",
    "aesthetic medicine academy",
    "clinical protocols",
    "digital medical books",
    "منصة تعليم طبي",
    "أكاديمية طب تجميلي",
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  const themeCookie = cookieStore.get(themeCookieName)?.value;
  const locale = resolveLocale(localeCookie);
  const theme = resolveTheme(themeCookie);
  const copy = getHomeMessages(locale);

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      suppressHydrationWarning
      className={`${inter.variable} ${cairo.variable} ${theme === "dark" ? "dark" : ""} h-full antialiased`}
    >
      <body suppressHydrationWarning className="h-screen overflow-hidden bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
          <Providers initialLocale={locale} initialTheme={theme}>
            <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
            <ClinicalCursorFollower />
            <div className="flex h-full flex-col bg-background text-foreground">
              <HomeHeader copy={copy} />
              <div className="relative z-0 flex-1 overflow-y-auto">
                <main className="min-h-0">{children}</main>
                <HomeFooter copy={copy} />
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
