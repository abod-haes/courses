"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { CatalogPagination } from "@/shared/components/catalog/catalog-pagination.component";
import { getCatalogCategoryOptions } from "@/shared/api/categories.api";
import type { PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import { getCourses } from "../api/courses.api";
import type { CourseCategoryKey, CourseItemView, CoursesPageCopy } from "../courses.types";
import { CourseTileView } from "./course-tile-view.component";
import { CoursesHero } from "./courses-hero.component";
import { CoursesToolbar, type CoursesCategoryFilter, type CoursesCategoryOption } from "./courses-toolbar.component";

type CoursesLibraryProps = Readonly<{
  copy: CoursesPageCopy;
  initialPage: PaginatedEnvelope<CourseItemView>;
  locale: Locale;
}>;

function useDebouncedValue(value: string, delay = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function paginationCopy(locale: Locale) {
  return locale === "ar"
    ? { previous: "السابق", next: "التالي", page: "صفحة", of: "من", results: "نتيجة" }
    : { previous: "Previous", next: "Next", page: "Page", of: "of", results: "results" };
}

function LoadingNotice({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 rounded-[14px] border border-primary/12 bg-primary/5 px-4 py-3 text-sm font-bold text-primary shadow-[0_10px_28px_rgba(29,23,213,0.06)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" aria-hidden="true" />
      {locale === "ar" ? "جاري جلب البيانات..." : "Fetching data..."}
    </div>
  );
}

export function CoursesLibrary({ copy, initialPage, locale }: CoursesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<CoursesCategoryFilter>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isSearchDebouncing = searchTerm.trim() !== debouncedSearch;
  const isInitialQuery = debouncedSearch.length === 0 && activeCategory === "all" && page === 1;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory]);

  const query = useQuery({
    queryKey: ["courses", locale, debouncedSearch, activeCategory, page, initialPage.meta.perPage],
    queryFn: () =>
      getCourses({
        locale,
        page,
        perPage: initialPage.meta.perPage,
        search: debouncedSearch,
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
    initialData: isInitialQuery ? initialPage : undefined,
    placeholderData: (previousData) => previousData,
  });

  const fallbackCategoryOptions = useMemo<CoursesCategoryOption[]>(() => {
    const categoryLabels = new Map<CourseCategoryKey, string>();

    initialPage.data.forEach((course) => {
      categoryLabels.set(course.categoryKey, course.category);
    });

    return [
      { key: "all", label: copy.filters.all },
      ...Array.from(categoryLabels.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [copy.filters.all, initialPage.data]);

  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories", "course", locale],
    queryFn: () => getCatalogCategoryOptions("course", locale, copy.filters.all),
    initialData: fallbackCategoryOptions,
    staleTime: 5 * 60 * 1000,
  });

  const pageData = query.data ?? initialPage;
  const courses = pageData.data;
  const categoryOptions = categoriesQuery.data ?? fallbackCategoryOptions;
  const showInitialLoading = query.isFetching && courses.length === 0;
  const showFilterLoading = !showInitialLoading && (query.isFetching || isSearchDebouncing);
  const showEmpty = !showInitialLoading && !showFilterLoading && courses.length === 0;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <SiteContainer className="pb-8 pt-8 lg:pb-10 lg:pt-10">
          <CoursesHero copy={copy} />
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-6 lg:py-8">
        <CoursesToolbar
          searchTerm={searchTerm}
          searchPlaceholder={copy.searchPlaceholder}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
        />

        {showFilterLoading ? <LoadingNotice locale={locale} /> : null}

        {courses.length > 0 ? (
          <div className="relative">
            <StaggerList className={`mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${showFilterLoading ? "opacity-50" : "opacity-100"}`}>
              {courses.map((course) => (
                <CourseTileView key={course.id} course={course} viewDetailsLabel={copy.labels.viewDetails} />
              ))}
            </StaggerList>
          </div>
        ) : null}

        {pageData.meta.total > 0 ? (
          <CatalogPagination meta={pageData.meta} copy={paginationCopy(locale)} isLoading={query.isFetching || isSearchDebouncing} onPageChange={setPage} />
        ) : null}

        {showInitialLoading ? (
          <div className="mt-8 rounded-[18px] border border-border/60 bg-surface/80 p-6 text-center text-sm font-semibold text-foreground/60">
            {locale === "ar" ? "جاري تحميل النتائج..." : "Loading results..."}
          </div>
        ) : null}

        {showEmpty ? (
          <div className="mt-8 rounded-[12px] border border-dashed border-border bg-surface p-10 text-center shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
            <h2 className="text-lg font-black text-foreground">{copy.labels.noResultsTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
              {copy.labels.noResultsDescription}
            </p>
          </div>
        ) : null}
      </SiteContainer>
    </div>
  );
}
