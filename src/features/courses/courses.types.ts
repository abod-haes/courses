import type { Locale } from "@/shared/lib/types";

export type CourseCategoryKey = string;

type LocalizedText = Readonly<Record<Locale, string>>;

export type CourseCurriculumModule = Readonly<{
  title: LocalizedText;
  description: LocalizedText;
  duration: string;
  locked?: boolean;
}>;

export type CourseCatalogItem = Readonly<{
  id: string;
  title: LocalizedText;
  instructor: LocalizedText;
  categoryKey: CourseCategoryKey;
  category: LocalizedText;
  description: LocalizedText;
  longDescription: LocalizedText;
  price: string;
  image: string;
  imageAlt: LocalizedText;
  hours: string;
  lessons: number;
  modules: number;
  isCmeEligible: boolean;
  includes: LocalizedText[];
  curriculum: CourseCurriculumModule[];
  href: string;
}>;

export type CourseItemView = Readonly<{
  id: string;
  title: string;
  instructor: string;
  categoryKey: CourseCategoryKey;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  image: string;
  imageAlt: string;
  hours: string;
  lessons: number;
  modules: number;
  isCmeEligible: boolean;
  includes: string[];
  curriculum: ReadonlyArray<{
    title: string;
    description: string;
    duration: string;
    locked?: boolean;
  }>;
  href: string;
}>;

export type CoursesPageCopy = Readonly<{
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
    loadMore: string;
    noResultsTitle: string;
    noResultsDescription: string;
  }>;
}>;

export type CourseDetailCopy = Readonly<{
  backLabel: string;
  purchaseLabel: string;
  addToCart: string;
  unlockNote: string;
  includesTitle: string;
  curriculumTitle: string;
  modulesLabel: string;
  lessonsLabel: string;
  cmeEligible: string;
  noCourseTitle: string;
}>;
