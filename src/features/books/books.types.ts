import type { Locale } from "@/shared/lib/types";

export type BookCategoryKey = string;

type LocalizedText = Readonly<Record<Locale, string>>;
type LocalizedTextList = Readonly<Record<Locale, readonly string[]>>;

export type BookProductDetail = Readonly<{
  label: LocalizedText;
  value: LocalizedText;
}>;

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
  details: Readonly<{
    availability: LocalizedText;
    accessNote: LocalizedText;
    description: LocalizedTextList;
    highlights: LocalizedTextList;
    tableOfContents: LocalizedTextList;
    authorBio: LocalizedTextList;
    productDetails: readonly BookProductDetail[];
  }>;
}>;

export type BookDetailView = Readonly<{
  availability: string;
  accessNote: string;
  description: readonly string[];
  highlights: readonly string[];
  tableOfContents: readonly string[];
  authorBio: readonly string[];
  productDetails: readonly Readonly<{
    label: string;
    value: string;
  }>[];
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
  details: BookDetailView;
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
  detail: Readonly<{
    backToBooks: string;
    addToCart: string;
    saveForLater: string;
    secureAccessTitle: string;
    productDetailsTitle: string;
    tabs: Readonly<{
      description: string;
      tableOfContents: string;
      authorBio: string;
    }>;
  }>;
}>;
