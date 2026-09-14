import type { Metadata } from "next";
import type { Locale } from "@/shared/lib/types";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function verificationMetadata(): Metadata["verification"] | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const other = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  if (!google && !other) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(other ? { other: { "msvalidate.01": other } } : {}),
  };
}

export const siteConfig = {
  name: "IASS",
  fullName: "International Academy of Aesthetic Science and Skills",
  url: stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  defaultImage: "/images/hero-blue.png",
  logo: "/images/logo-blue.png",
  defaultDescription:
    "IASS is a bilingual digital academy for aesthetic medicine courses, medical books, and educational articles focused on anatomy, safety, and clinical protocols.",
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
  const metaDescription = trimDescription(description || siteConfig.defaultDescription);
  const imageUrl = absoluteUrl(image);
  const canonicalUrl = absoluteUrl(path);

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: { absolute: title },
    description: metaDescription,
    keywords: [
      "IASS",
      "International Academy of Aesthetic Science and Skills",
      "aesthetic medicine training",
      "medical education",
      "medical courses",
      "medical books",
      "كورسات طبية",
      "كتب طبية",
      "طب تجميلي",
      ...keywords,
    ],
    alternates: { canonical: canonicalUrl },
    verification: verificationMetadata(),
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false, noimageindex: true },
        }
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
      url: canonicalUrl,
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

export function createPrivatePageMetadata(title = `Account | ${siteConfig.name}`): Metadata {
  return createSeoMetadata({
    title,
    description: "Private account area for authenticated IASS users.",
    path: "/",
    noIndex: true,
  });
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
    alternateName: siteConfig.fullName,
    url: siteConfig.url,
    inLanguage: locale,
    publisher: { "@type": "EducationalOrganization", name: siteConfig.fullName, logo: absoluteUrl(siteConfig.logo) },
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
    image: absoluteUrl(siteConfig.defaultImage),
    description: siteConfig.defaultDescription,
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

export function itemListJsonLd(items: ReadonlyArray<Readonly<{ name: string; path: string }>>): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function courseJsonLd(
  course: Readonly<{
    title: string;
    description: string;
    image: string;
    href: string;
    category: string;
    instructor?: string;
    amount?: number;
    currency?: string;
  }>,
  locale: Locale,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: trimDescription(course.description, 500),
    image: absoluteUrl(course.image),
    url: absoluteUrl(course.href),
    inLanguage: locale,
    about: course.category,
    provider: { "@type": "EducationalOrganization", name: siteConfig.fullName, url: siteConfig.url },
    author: course.instructor ? { "@type": "Person", name: course.instructor } : undefined,
    offers:
      typeof course.amount === "number" && course.currency
        ? {
            "@type": "Offer",
            url: absoluteUrl(course.href),
            price: course.amount.toFixed(2),
            priceCurrency: course.currency.toUpperCase(),
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };
}

export function bookJsonLd(
  book: Readonly<{
    title: string;
    description: string;
    image: string;
    href: string;
    author: string;
    isbn?: string;
    amount?: number;
    currency?: string;
  }>,
  locale: Locale,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: trimDescription(book.description, 500),
    image: absoluteUrl(book.image),
    url: absoluteUrl(book.href),
    inLanguage: locale,
    isbn: book.isbn,
    author: book.author ? { "@type": "Person", name: book.author } : undefined,
    publisher: { "@type": "EducationalOrganization", name: siteConfig.fullName, url: siteConfig.url },
    offers:
      typeof book.amount === "number" && book.currency
        ? {
            "@type": "Offer",
            url: absoluteUrl(book.href),
            price: book.amount.toFixed(2),
            priceCurrency: book.currency.toUpperCase(),
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };
}

export function articleJsonLd(
  article: Readonly<{
    title: string;
    description: string;
    image: string;
    href: string;
    author: string;
    publishedAt?: string;
    updatedAt?: string;
  }>,
  locale: Locale,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: trimDescription(article.description, 500),
    image: [absoluteUrl(article.image)],
    url: absoluteUrl(article.href),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(article.href) },
    inLanguage: locale,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { "@type": "Person", name: article.author || siteConfig.fullName },
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.fullName,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    },
  };
}
