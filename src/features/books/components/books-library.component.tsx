"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { InfiniteScrollSentinel } from "@/shared/components/infinite-scroll-sentinel.component";
import { LoadMoreSkeleton } from "@/shared/components/load-more-skeleton.component";
import { nextPageFrom } from "@/shared/api/paging";
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

  const query = useInfiniteQuery({
    queryKey: ["books", locale, debouncedSearch, activeCategory],
    queryFn: ({ pageParam }) =>
      getBooks({
        locale,
        page: pageParam,
        perPage: initialPage.meta.perPage,
        search: debouncedSearch,
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
    initialPageParam: 1,
    getNextPageParam: nextPageFrom,
    initialData: isInitialQuery ? { pages: [initialPage], pageParams: [1] } : undefined,
  });

  const books = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);

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

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const showInitialLoading = query.isFetching && !query.isFetchingNextPage && books.length === 0;
  const showEmpty = !showInitialLoading && books.length === 0;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-7 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          <BooksHero copy={copy} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <BooksToolbar
          searchTerm={searchTerm}
          searchPlaceholder={copy.searchPlaceholder}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
        />

        {books.length > 0 ? (
          <StaggerList className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} viewDetailsLabel={copy.labels.viewDetails} />
            ))}
          </StaggerList>
        ) : null}

        {showInitialLoading ? <LoadMoreSkeleton /> : null}
        {showEmpty ? <BooksEmptyState title={copy.labels.noResultsTitle} description={copy.labels.noResultsDescription} /> : null}
        {query.isFetchingNextPage ? <LoadMoreSkeleton /> : null}
        <InfiniteScrollSentinel enabled={Boolean(query.hasNextPage && !query.isFetchingNextPage)} onLoadMore={handleLoadMore} />
      </section>
    </div>
  );
}
