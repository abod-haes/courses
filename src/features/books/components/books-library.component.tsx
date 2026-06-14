"use client";

import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import type { Locale } from "@/shared/lib/types";
import type { BookCategoryKey, BookItemView, BooksPageCopy } from "../books.types";
import { BookCard } from "./book-card.component";

type BooksLibraryProps = Readonly<{
  locale: Locale;
  copy: BooksPageCopy;
  books: BookItemView[];
}>;

type CategoryFilter = BookCategoryKey | "all";

type CategoryOption = Readonly<{
  key: CategoryFilter;
  label: string;
}>;

export function BooksLibrary({ locale, copy, books }: BooksLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const isArabic = locale === "ar";

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const categories = new Map<BookCategoryKey, string>();

    books.forEach((book) => {
      categories.set(book.categoryKey, book.category);
    });

    return [
      { key: "all", label: copy.filters.all },
      ...Array.from(categories.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [books, copy.filters.all]);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory = activeCategory === "all" || book.categoryKey === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [book.title, book.author, book.category, book.description, book.isbn]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, books, searchTerm]);

  const stats = [
    { value: `${books.length}+`, label: copy.stats.books },
    { value: `${Math.max(categoryOptions.length - 1, 0)}`, label: copy.stats.categories },
    { value: "24/7", label: copy.stats.access },
  ];

  return (
    <div className="min-h-full bg-background">
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-section-bg via-background to-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="pointer-events-none absolute -right-28 top-12 h-72 w-72 rounded-full bg-primary/8 blur-3xl rtl:left-[-7rem] rtl:right-auto" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-52 w-52 rounded-full bg-primary/5 blur-3xl rtl:left-auto rtl:right-8" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <Reveal preset="fadeUp" className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-[12px] border border-border/70 bg-surface/86 px-3 py-2 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
                <span className="relative block h-8 w-28">
                  <Image
                    src="/images/logo-blue.png"
                    alt="IASS logo"
                    fill
                    sizes="112px"
                    className="object-contain object-left rtl:object-right"
                    priority
                  />
                </span>
                <span className="h-5 w-px bg-border" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {copy.eyebrow}
                </span>
              </div>

              <h1 className="font-display text-hero-lg-mobile font-bold leading-[1.08] tracking-tight text-foreground sm:text-[44px] lg:text-hero-lg">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/68 sm:text-lg">
                {copy.subtitle}
              </p>
            </Reveal>

            <Reveal preset="softScale" className="grid grid-cols-3 gap-3 rounded-[18px] border border-border/70 bg-surface/86 p-3 shadow-[0_18px_45px_rgba(29,23,213,0.07)] backdrop-blur">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[14px] border border-border/60 bg-surface-soft px-3 py-4 text-center">
                  <p className="text-lg font-black text-primary">{item.value}</p>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-foreground/56">{item.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Reveal preset="fadeUp" className="rounded-[18px] border border-border/70 bg-surface/92 p-4 shadow-[0_14px_38px_rgba(17,24,39,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex h-12 w-full items-center gap-3 rounded-[10px] border border-border/70 bg-background px-4 text-sm text-foreground/55 transition duration-200 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/8 xl:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-foreground/35" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full bg-transparent outline-none placeholder:text-foreground/40"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="me-1 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45 sm:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                {isArabic ? "التصنيفات" : "Filters"}
              </span>
              {categoryOptions.map((category) => {
                const isActive = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "bg-primary text-white shadow-[0_10px_22px_rgba(29,23,213,0.16)]"
                        : "border border-border/70 bg-background text-foreground/66 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-foreground/55">
            <span className="font-black text-primary">{filteredBooks.length}</span> {copy.labels.results}
          </p>
        </div>

        {filteredBooks.length > 0 ? (
          <StaggerList className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isbnLabel={copy.labels.isbn}
                viewDetailsLabel={copy.labels.viewDetails}
              />
            ))}
          </StaggerList>
        ) : (
          <Reveal preset="softScale" className="mt-6 rounded-[18px] border border-dashed border-border bg-surface p-10 text-center shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
            <h2 className="text-xl font-bold text-foreground">{copy.labels.noResultsTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
              {copy.labels.noResultsDescription}
            </p>
          </Reveal>
        )}
      </section>
    </div>
  );
}
