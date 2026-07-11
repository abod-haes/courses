"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { CatalogPagination } from "@/shared/components/catalog/catalog-pagination.component";
import { getCatalogCategoryOptions } from "@/shared/api/categories.api";
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

function LoadingNotice({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 rounded-[14px] border border-primary/12 bg-primary/5 px-4 py-3 text-sm font-bold text-primary shadow-[0_10px_28px_rgba(29,23,213,0.06)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" aria-hidden="true" />
      {locale === "ar" ? "جاري جلب البيانات..." : "Fetching data..."}
    </div>
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

function paginationCopy(locale: Locale) {
  return locale === "ar"
    ? { previous: "السابق", next: "التالي", page: "صفحة", of: "من", results: "نتيجة" }
    : { previous: "Previous", next: "Next", page: "Page", of: "of", results: "results" };
}

export function ArticlesLibrary({ copy, initialPage, locale }: ArticlesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategoryFilter>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isSearchDebouncing = searchTerm.trim() !== debouncedSearch;
  const isInitialQuery = debouncedSearch.length === 0 && activeCategory === "all" && page === 1;

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleCategoryChange(value: ArticleCategoryFilter) {
    setActiveCategory(value);
    setPage(1);
  }

  const query = useQuery({
    queryKey: ["articles", locale, debouncedSearch, activeCategory, page, initialPage.meta.perPage],
    queryFn: () =>
      getArticles({
        locale,
        page,
        perPage: initialPage.meta.perPage,
        search: debouncedSearch,
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
    initialData: isInitialQuery ? initialPage : undefined,
    placeholderData: (previousData) => previousData,
  });

  const fallbackCategoryOptions = useMemo<ArticleCategoryOption[]>(() => {
    const categories = new Map<string, string>();

    initialPage.data.forEach((article) => {
      categories.set(article.category, article.category);
    });

    return [
      { key: "all", label: copy.filters.allCategories },
      ...Array.from(categories).map(([key, label]) => ({ key, label })),
    ];
  }, [initialPage.data, copy.filters.allCategories]);

  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories", "article", locale],
    queryFn: () => getCatalogCategoryOptions("article", locale, copy.filters.allCategories),
    initialData: fallbackCategoryOptions,
    staleTime: 5 * 60 * 1000,
  });

  const pageData = query.data ?? initialPage;
  const articles = pageData.data;
  const categoryOptions = categoriesQuery.data ?? fallbackCategoryOptions;
  const showInitialLoading = query.isFetching && articles.length === 0;
  const showFilterLoading = !showInitialLoading && (query.isFetching || isSearchDebouncing);
  const showEmpty = !showInitialLoading && !showFilterLoading && articles.length === 0;

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <SiteContainer className="pb-7 pt-7 lg:pb-8 lg:pt-8">
          <ArticlesHero copy={copy} />
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-8 lg:py-10">
        <ArticleFilters
          searchTerm={searchTerm}
          searchPlaceholder={copy.filters.searchPlaceholder}
          categoryLabel={copy.filters.categoryLabel}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />

        {showFilterLoading ? <LoadingNotice locale={locale} /> : null}

        {articles.length > 0 ? (
          <StaggerList className={`mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${showFilterLoading ? "opacity-50" : "opacity-100"}`}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} copy={copy} />
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

        {showEmpty ? <ArticlesEmptyState title={copy.empty.title} description={copy.empty.description} /> : null}
      </SiteContainer>
    </div>
  );
}
