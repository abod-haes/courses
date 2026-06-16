import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { ClinicalCursorFollower } from "@/shared/components/clinical-cursor-follower";
import { localeCookieName, themeCookieName } from "@/shared/lib/preferences";
import { messagesByLocale } from "@/shared/lib/messages";
import { getLocaleDirection, resolveLocale, resolveTheme } from "@/shared/lib/helpers/locale.helper";
import { getHomeMessages } from "@/features/home/home.data";
import { HomeFooter } from "@/features/home/components/home-footer.component";
import { HomeHeader } from "@/features/home/components/home-header.component";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "IASS ",
    template: "%s | IASS ",
  },
  description:
    "A clean, academic, and modern website for IASS with bilingual content, elegant UI, and strong brand identity.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IASS ",
    description: "Modern academic website experience for IASS with a clean visual identity and bilingual support.",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "IASS ",
    description: "Modern academic website experience for IASS with a clean visual identity and bilingual support.",
  },
};

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
      className={`${inter.variable} ${tajawal.variable} ${theme === "dark" ? "dark" : ""} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
          <Providers initialLocale={locale} initialTheme={theme}>
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
