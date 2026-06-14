import type { Locale } from "@/shared/lib/types";

export type BookCategoryKey = "anatomy" | "cardiology" | "surgery" | "pediatrics";

type LocalizedText = Readonly<Record<Locale, string>>;

export type BookCatalogItem = Readonly<{
  id: string;
  title: LocalizedText;
  author: LocalizedText;
  categoryKey: BookCategoryKey;
  category: LocalizedText;
  description: LocalizedText;
  price: string;
  isbn: string;
  href: string;
  image: string;
  imageAlt: LocalizedText;
}>;

export type BookItemView = Readonly<{
  id: string;
  title: string;
  author: string;
  categoryKey: BookCategoryKey;
  category: string;
  description: string;
  price: string;
  isbn: string;
  href: string;
  image: string;
  imageAlt: string;
}>;

export type BooksPageCopy = Readonly<{
  meta: Readonly<{
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  }>;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filters: Readonly<{
    all: string;
  }>;
  labels: Readonly<{
    viewDetails: string;
    noResultsTitle: string;
    noResultsDescription: string;
  }>;
}>;
