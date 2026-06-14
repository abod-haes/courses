"use client";

import { useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import type { BookCategoryKey, BookItemView, BooksPageCopy } from "../books.types";
import { BookCard } from "./book-card.component";
import { BooksEmptyState } from "./books-empty-state.component";
import { BooksHero } from "./books-hero.component";
import { BooksToolbar, type BooksCategoryFilter, type BooksCategoryOption } from "./books-toolbar.component";

type BooksLibraryProps = Readonly<{
  copy: BooksPageCopy;
  books: BookItemView[];
}>;

export function BooksLibrary({ copy, books }: BooksLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<BooksCategoryFilter>("all");

  const categoryOptions = useMemo<BooksCategoryOption[]>(() => {
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

        {filteredBooks.length > 0 ? (
          <StaggerList className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} viewDetailsLabel={copy.labels.viewDetails} />
            ))}
          </StaggerList>
        ) : (
          <BooksEmptyState title={copy.labels.noResultsTitle} description={copy.labels.noResultsDescription} />
        )}
      </section>
    </div>
  );
}
