import type { Locale } from "@/shared/lib/types";

export type ArticleSort = "newest" | "title";

export type ArticleSummary = Readonly<{
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  alt: string;
  publishedAt: string;
  href: string;
}>;

export type ArticleDetail = ArticleSummary &
  Readonly<{
    bodyHtml?: string;
    body?: readonly string[];
  }>;

export type ArticlePageCopy = Readonly<{
  locale: Locale;
  brand: string;
  meta: Readonly<{
    listTitle: string;
    listDescription: string;
    detailsTitleSuffix: string;
  }>;
  hero: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  filters: Readonly<{
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    allCategories: string;
    sortLabel: string;
    newest: string;
    title: string;
    apply: string;
    reset: string;
  }>;
  cards: Readonly<{
    readArticle: string;
    published: string;
  }>;
  empty: Readonly<{
    title: string;
    description: string;
  }>;
  details: Readonly<{
    backToArticles: string;
    writtenBy: string;
    browseCourses: string;
    browseBooks: string;
    continueLearningTitle: string;
    continueLearningDescription: string;
  }>;
}>;
