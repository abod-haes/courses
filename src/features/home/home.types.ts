import type { Locale } from "@/shared/lib/types";

export type HomeSectionKey = "courses" | "books" | "articles";

export type HomeCatalogItem = Readonly<{
  category: string;
  title: string;
  author: string;
  modules: number;
  description?: string;
  price?: string;
  image: string;
  alt: string;
  href: string;
}>;

export type HomeCatalog = Readonly<{
  courses: HomeCatalogItem[];
  books: HomeCatalogItem[];
  articles: HomeCatalogItem[];
}>;

export type HomeSectionCopy = Readonly<{
  title: string;
  description: string;
  emptyState: string;
}>;

export type HomeStatItem = Readonly<{
  value: string;
  label: string;
  description: string;
  icon: "users" | "award" | "star" | "book";
}>;

export type HomeMessages = Readonly<{
  meta: Readonly<{
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  }>;
  brand: string;
  navigation: Readonly<{
    home?: string;
    courses: string;
    textbooks: string;
    articles: string;
    specialties: string;
  }>;
  actions: Readonly<{
    signIn: string;
    getStarted: string;
    searchPlaceholder: string;
    browseCourses: string;
    exploreBooks: string;
    viewAll: string;
    startCourse: string;
    viewDetails: string;
    readArticle: string;
  }>;
  controls: Readonly<{
    language: string;
    theme: string;
    light: string;
    dark: string;
    english: string;
    arabic: string;
    toggleLanguageAria: string;
    toggleThemeLightAria: string;
    toggleThemeDarkAria: string;
  }>;
  hero: Readonly<{
    badge: string;
    title: string;
    subtitle: string;
  }>;
  founder: Readonly<{
    label: string;
    title: string;
    subtitle: string;
    name: string;
    description: string;
    ctaLabel: string;
    imageAlt: string;
  }>;
  aboutUs: Readonly<{
    label: string;
    title: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    imageSrc: string;
    imageAlt: string;
    highlights: ReadonlyArray<Readonly<{
      label: string;
      description: string;
    }>>;
  }>;
  visual: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    resources: Readonly<{
      courses: string;
      books: string;
      articles: string;
    }>;
  }>;
  sections: Readonly<{
    courses: HomeSectionCopy;
    books: HomeSectionCopy;
    articles: HomeSectionCopy;
  }>;
  stats: Readonly<{
    label: string;
    title: string;
    subtitle: string;
    items: HomeStatItem[];
  }>;
  trustStrip: string[];
  cards: Readonly<{
    modulesLabel: string;
  }>;
  footer: Readonly<{
    description: string;
    learn: string;
    company: string;
    support: string;
    socialTitle: string;
    social: ReadonlyArray<Readonly<{
      label: string;
      href: string;
      icon: "instagram" | "x" | "linkedin" | "facebook";
    }>>;
    links: Readonly<{
      courses: string;
      textbooks: string;
      articles: string;
      about: string;
      faculty: string;
      careers: string;
      helpCenter: string;
      contact: string;
      privacy: string;
    }>;
    copyright: string;
  }>;
  catalog: HomeCatalog;
}>;

export type HomeCopy = Readonly<{
  locale: Locale;
  messages: HomeMessages;
}>;
