import type { Metadata } from "next";
import type { Locale } from "@/shared/lib/types";

type WebsiteMetadataInput = Readonly<{
  locale: Locale;
  title: {
    en: string;
    ar: string;
  };
  description: string;
  url?: string;
}>;

export function createWebsiteMetadata({ locale, title, description, url = "/" }: WebsiteMetadataInput): Metadata {
  const resolvedTitle = locale === "ar" ? title.ar : title.en;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}
