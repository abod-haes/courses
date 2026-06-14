import type { Locale } from "@/shared/lib/types";

export type BookCategoryKey = "anatomy" | "cardiology" | "surgery" | "pediatrics" | "dermatology" | "aesthetics";

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
  coverTone: "blue" | "cyan" | "teal" | "slate" | "violet" | "emerald";
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
  coverTone: BookCatalogItem["coverTone"];
}>;

export type BooksPageCopy = Readonly<{
  meta: Readonly<{
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filters: Readonly<{
    all: string;
  }>;
  stats: Readonly<{
    books: string;
    categories: string;
    access: string;
  }>;
  labels: Readonly<{
    isbn: string;
    viewDetails: string;
    results: string;
    noResultsTitle: string;
    noResultsDescription: string;
  }>;
}>;
