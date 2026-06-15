"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import type { ArticlePageCopy, ArticleSummary } from "../articles.types";
import { ArticleCard } from "./article-card.component";
import { ArticleFilters, type ArticleCategoryFilter, type ArticleCategoryOption } from "./article-filters.component";

type ArticlesLibraryProps = Readonly<{
  copy: ArticlePageCopy;
  articles: ArticleSummary[];
}>;

function ArticlesHero({ copy }: Readonly<{ copy: ArticlePageCopy }>) {
  return (
    <Reveal preset="fadeUp" className="max-w-2xl">
      <h1 className=" text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.5rem]">
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
      <h2 className="text-lg font-black text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
        {description}
      </p>
    </Reveal>
  );
}

export function ArticlesLibrary({ copy, articles }: ArticlesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategoryFilter>("all");

  const categoryOptions = useMemo<ArticleCategoryOption[]>(() => {
    const categories = new Set<string>();

    articles.forEach((article) => {
      categories.add(article.category);
    });

    return [
      { key: "all", label: copy.filters.allCategories },
      ...Array.from(categories).map((label) => ({ key: label, label })),
    ];
  }, [articles, copy.filters.allCategories]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory = activeCategory === "all" || article.category === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [article.title, article.excerpt, article.category, article.author]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, articles, searchTerm]);

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

        {filteredArticles.length > 0 ? (
          <StaggerList className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} copy={copy} />
            ))}
          </StaggerList>
        ) : (
          <ArticlesEmptyState title={copy.empty.title} description={copy.empty.description} />
        )}
      </section>
    </div>
  );
}
