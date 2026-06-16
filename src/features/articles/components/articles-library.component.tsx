"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { InfiniteScrollSentinel } from "@/shared/components/infinite-scroll-sentinel.component";
import { LoadMoreSkeleton } from "@/shared/components/load-more-skeleton.component";
import { nextPageFrom } from "@/shared/api/paging";
import type { PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import { getArticles } from "../api/articles.api";
import type { ArticlePageCopy, ArticleSummary } from "../articles.types";
import { ArticleCard } from "./article-card.component";
import { ArticleFilters, type ArticleCategoryFilter, type ArticleCategoryOption } from "./article-filters.component";

type ArticlesLibraryProps = Readonly<{
  copy: ArticlePageCopy;
  initialPage: PaginatedEnvelope<ArticleSummary>;
  locale: Locale;
}>;

function ArticlesHero({ copy }: Readonly<{ copy: ArticlePageCopy }>) {
  return (
    <Reveal preset="fadeUp" className="max-w-2xl">
      <h1 className="text-[1.65rem] font-black leading-tight tracking-[-0.035em] text-foreground sm:text-[2.1rem] lg:text-[2.25rem]">
        {copy.hero.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/68 sm:text-[0.95rem]">
        {copy.hero.description}
      </p>
    </Reveal>
  );
}

function ArticlesEmptyState({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <Reveal
      preset="softScale"
      className="mt-7 rounded-[12px] border border-dashed border-border bg-surface p-10 text-center shadow-[0_8px_24px_rgba(17,24,39,0.04)]"
    >
      <h2 className="text-base font-black text-foreground sm:text-lg">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
        {description}
      </p>
    </Reveal>
  );
}

function useDebouncedValue(value: string, delay = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function ArticlesLibrary({ copy, initialPage, locale }: ArticlesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategoryFilter>("all");
  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isInitialQuery = debouncedSearch.length === 0 && activeCategory === "all";

  const query = useInfiniteQuery({
    queryKey: ["articles", locale, debouncedSearch, activeCategory],
    queryFn: ({ pageParam }) =>
      getArticles({
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

  const articles = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);

  const categoryOptions = useMemo<ArticleCategoryOption[]>(() => {
    const categories = new Map<string, string>();

    initialPage.data.forEach((article) => {
      categories.set(article.category, article.category);
    });

    return [
      { key: "all", label: copy.filters.allCategories },
      ...Array.from(categories).map(([key, label]) => ({ key, label })),
    ];
  }, [initialPage.data, copy.filters.allCategories]);

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const showInitialLoading = query.isFetching && !query.isFetchingNextPage && articles.length === 0;
  const showEmpty = !showInitialLoading && articles.length === 0;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-7 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          <ArticlesHero copy={copy} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <ArticleFilters
          searchTerm={searchTerm}
          searchPlaceholder={copy.filters.searchPlaceholder}
          categoryLabel={copy.filters.categoryLabel}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
        />

        {articles.length > 0 ? (
          <StaggerList className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} copy={copy} />
            ))}
          </StaggerList>
        ) : null}

        {showInitialLoading ? <LoadMoreSkeleton /> : null}
        {showEmpty ? <ArticlesEmptyState title={copy.empty.title} description={copy.empty.description} /> : null}
        {query.isFetchingNextPage ? <LoadMoreSkeleton /> : null}
        <InfiniteScrollSentinel enabled={Boolean(query.hasNextPage && !query.isFetchingNextPage)} onLoadMore={handleLoadMore} />
      </section>
    </div>
  );
}