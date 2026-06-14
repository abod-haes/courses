import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createJsonLdScript } from "@/shared/lib/helpers/jsonld.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";
import { getHomeMessages } from "./home.data";
import { HomeHero } from "./components/home-hero.component";
import { AboutUsSection } from "./components/about-us-section.component";
import { FounderSection } from "./components/founder-section.component";
import { HomeStatsSection } from "./components/home-stats-section.component";
import { HomeSection } from "./components/home-section.component";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

function buildMetadata(locale: Locale): Metadata {
  const copy = getHomeMessages(locale);

  return {
    title: {
      absolute: copy.meta.title,
    },
    description: copy.meta.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: copy.meta.ogTitle,
      description: copy.meta.ogDescription,
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
    },
  };
}

export async function generateHomeMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  return buildMetadata(getLocaleFromCookies(localeCookie));
}

export async function HomePage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  const locale = getLocaleFromCookies(localeCookie);
  const copy = getHomeMessages(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: copy.brand,
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      description: copy.meta.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: copy.brand,
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    },
  ];

  return (
    <div className="home-scroll-area h-full overflow-y-auto">
      <HomeHero copy={copy} />
      <AboutUsSection copy={copy} />
      <FounderSection copy={copy} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSection
          section="courses"
          title={copy.sections.courses.title}
          description={copy.sections.courses.description}
          emptyState={copy.sections.courses.emptyState}
          items={copy.catalog.courses}
          ctaLabel={copy.actions.viewAll}
          ctaHref="/courses"
          copy={copy}
        />

        <HomeSection
          section="books"
          title={copy.sections.books.title}
          description={copy.sections.books.description}
          emptyState={copy.sections.books.emptyState}
          items={copy.catalog.books}
          ctaLabel={copy.actions.viewAll}
          ctaHref="/books"
          copy={copy}
        />
        <HomeStatsSection copy={copy} />

        <HomeSection
          section="articles"
          title={copy.sections.articles.title}
          description={copy.sections.articles.description}
          emptyState={copy.sections.articles.emptyState}
          items={copy.catalog.articles}
          ctaLabel={copy.actions.viewAll}
          ctaHref="/articles"
          copy={copy}
        />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: createJsonLdScript(jsonLd) }} />
    </div>
  );
}
