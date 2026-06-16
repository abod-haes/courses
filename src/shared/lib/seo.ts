import type { Metadata } from "next";
import type { Locale } from "@/shared/lib/types";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export const siteConfig = {
  name: "IASS",
  fullName: "International Academy of Aesthetic Science and Skills",
  url: stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  defaultImage: "/images/hero.jpg",
  logo: "/images/logo-blue.png",
} as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function trimDescription(value: string, maxLength = 155): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
  locale = "en",
  image = siteConfig.defaultImage,
  imageAlt = title,
  type = "website",
  noIndex = false,
  keywords = [],
}: Readonly<{
  title: string;
  description: string;
  path?: string;
  locale?: Locale;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: readonly string[];
}>): Metadata {
  const metaDescription = trimDescription(description);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title,
    description: metaDescription,
    keywords: [
      "IASS",
      "International Academy of Aesthetic Science and Skills",
      "aesthetic medicine training",
      "courses",
      "books",
      "articles",
      "كورسات",
      "كتب",
      "مقالات",
      ...keywords,
    ],
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description: metaDescription,
      type,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      siteName: siteConfig.name,
      url: path,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export type JsonLdData = string | number | boolean | null | JsonLdData[] | { readonly [key: string]: JsonLdData | undefined };

export function cleanJsonLd(value: JsonLdData): JsonLdData {
  if (Array.isArray(value)) return value.map(cleanJsonLd);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== "")
        .map(([key, entryValue]) => [key, cleanJsonLd(entryValue as JsonLdData)]),
    );
  }
  return value;
}

export function websiteJsonLd(locale: Locale): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: siteConfig.fullName, logo: absoluteUrl(siteConfig.logo) },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/courses")}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: Locale): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<Readonly<{ name: string; path: string }>>): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseJsonLd(course: Readonly<{ title: string; description: string; image: string; href: string; category: string }>, locale: Locale): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: trimDescription(course.description, 500),
    image: absoluteUrl(course.image),
    url: absoluteUrl(course.href),
    inLanguage: locale,
    about: course.category,
    provider: { "@type": "Organization", name: siteConfig.fullName, url: siteConfig.url },
  };
}

export function bookJsonLd(book: Readonly<{ title: string; description: string; image: string; href: string; author: string; isbn?: string }>, locale: Locale): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: trimDescription(book.description, 500),
    image: absoluteUrl(book.image),
    url: absoluteUrl(book.href),
    inLanguage: locale,
    isbn: book.isbn,
    author: { "@type": "Person", name: book.author },
    publisher: { "@type": "Organization", name: siteConfig.fullName, url: siteConfig.url },
  };
}

export function articleJsonLd(article: Readonly<{ title: string; excerpt: string; image: string; href: string; author: string; publishedAt: string }>, locale: Locale): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    url: absoluteUrl(article.href),
    inLanguage: locale,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: siteConfig.fullName, logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) } },
  };
}
