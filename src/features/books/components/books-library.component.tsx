"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { SiteContainer } from "@/shared/components/layout/site-container";
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

export function BooksLibrary({ copy, initialPage, locale }: BooksLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<BooksCategoryFilter>("all");
  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isInitialQuery = debouncedSearch.length === 0 && activeCategory === "all";

  const query = useQuery({
    queryKey: ["books", locale, debouncedSearch, activeCategory],
    queryFn: () =>
      getBooks({
        locale,
        page: 1,
        perPage: initialPage.meta.perPage,
        search: debouncedSearch,
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
    initialData: isInitialQuery ? initialPage : undefined,
  });

  const books = query.data?.data ?? [];

  const categoryOptions = useMemo<BooksCategoryOption[]>(() => {
    const categories = new Map<BookCategoryKey, string>();

    initialPage.data.forEach((book) => {
      categories.set(book.categoryKey, book.category);
    });

    return [
      { key: "all", label: copy.filters.all },
      ...Array.from(categories.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [initialPage.data, copy.filters.all]);

  const showInitialLoading = query.isFetching && books.length === 0;
  const showEmpty = !showInitialLoading && books.length === 0;

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

        {books.length > 0 ? (
          <StaggerList className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} viewDetailsLabel={copy.labels.viewDetails} />
            ))}
          </StaggerList>
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
