"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { CatalogPagination } from "@/shared/components/catalog/catalog-pagination.component";
import { getCatalogCategoryOptions } from "@/shared/api/categories.api";
import type { PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import { getBooks } from "../api/books.api";
import type { BookCategoryKey, BookItemView, BooksPageCopy } from "../books.types";
import { BookCard } from "./book-card.component";
import { BooksEmptyState } from "./books-empty-state.component";
import { BooksHero } from "./books-hero.component";
import { BooksToolbar, type BooksCategoryFilter, type BooksCategoryOption } from "./books-toolbar.component";

type BooksLibraryProps = Readonly<{
  copy: BooksPageCopy;
  initialPage: PaginatedEnvelope<BookItemView>;
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

export function BooksLibrary({ copy, initialPage, locale }: BooksLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<BooksCategoryFilter>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isSearchDebouncing = searchTerm.trim() !== debouncedSearch;
  const isInitialQuery = debouncedSearch.length === 0 && activeCategory === "all" && page === 1;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory]);

  const query = useQuery({
    queryKey: ["books", locale, debouncedSearch, activeCategory, page, initialPage.meta.perPage],
    queryFn: () =>
      getBooks({
        locale,
        page,
        perPage: initialPage.meta.perPage,
        search: debouncedSearch,
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
    initialData: isInitialQuery ? initialPage : undefined,
    placeholderData: (previousData) => previousData,
  });

  const fallbackCategoryOptions = useMemo<BooksCategoryOption[]>(() => {
    const categories = new Map<BookCategoryKey, string>();

    initialPage.data.forEach((book) => {
      categories.set(book.categoryKey, book.category);
    });

    return [
      { key: "all", label: copy.filters.all },
      ...Array.from(categories.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [initialPage.data, copy.filters.all]);

  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories", "book", locale],
    queryFn: () => getCatalogCategoryOptions("book", locale, copy.filters.all),
    initialData: fallbackCategoryOptions,
    staleTime: 5 * 60 * 1000,
  });

  const pageData = query.data ?? initialPage;
  const books = pageData.data;
  const categoryOptions = categoriesQuery.data ?? fallbackCategoryOptions;
  const showInitialLoading = query.isFetching && books.length === 0;
  const showFilterLoading = !showInitialLoading && (query.isFetching || isSearchDebouncing);
  const showEmpty = !showInitialLoading && !showFilterLoading && books.length === 0;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <SiteContainer className="pb-7 pt-7 lg:pb-8 lg:pt-8">
          <BooksHero copy={copy} />
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-8 lg:py-10">
        <BooksToolbar
          searchTerm={searchTerm}
          searchPlaceholder={copy.searchPlaceholder}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
        />

        {showFilterLoading ? <LoadingNotice locale={locale} /> : null}

        {books.length > 0 ? (
          <StaggerList className={`mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${showFilterLoading ? "opacity-50" : "opacity-100"}`}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} viewDetailsLabel={copy.labels.viewDetails} />
            ))}
          </StaggerList>
        ) : null}

        {pageData.meta.total > 0 ? (
          <CatalogPagination meta={pageData.meta} copy={paginationCopy(locale)} isLoading={query.isFetching || isSearchDebouncing} onPageChange={setPage} />
        ) : null}

        {showInitialLoading ? (
          <div className="mt-8 rounded-[18px] border border-border/60 bg-surface/80 p-6 text-center text-sm font-semibold text-foreground/60">
            {locale === "ar" ? "جاري تحميل النتائج..." : "Loading results..."}
          </div>
        ) : null}

        {showEmpty ? <BooksEmptyState title={copy.labels.noResultsTitle} description={copy.labels.noResultsDescription} /> : null}
      </SiteContainer>
    </div>
  );
}
