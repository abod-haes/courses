"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/shared/api/types";
import { cn } from "@/shared/lib/utils";

export type CatalogPaginationCopy = Readonly<{
  previous: string;
  next: string;
  page: string;
  of: string;
  results: string;
}>;

type CatalogPaginationProps = Readonly<{
  meta: PaginationMeta;
  copy: CatalogPaginationCopy;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}>;

function getVisiblePages(currentPage: number, lastPage: number): number[] {
  const pages = new Set<number>([1, lastPage, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((first, second) => first - second);
}

export function CatalogPagination({ meta, copy, isLoading = false, onPageChange }: CatalogPaginationProps) {
  const currentPage = Math.max(1, meta.currentPage);
  const lastPage = Math.max(1, meta.lastPage);
  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < lastPage && !isLoading;
  const pages = getVisiblePages(currentPage, lastPage);

  return (
    <nav
      className="mt-8 flex flex-col gap-3 rounded-[12px] border border-border/70 bg-surface px-4 py-3 shadow-[0_8px_24px_rgba(17,24,39,0.04)] sm:flex-row sm:items-center sm:justify-between"
      aria-label="Catalog pagination"
    >
      <p className="text-xs font-semibold text-foreground/58">
        {meta.from ?? 0}-{meta.to ?? 0} {copy.of} {meta.total} {copy.results}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border/70 bg-background px-3 text-xs font-bold text-foreground/72 transition hover:border-primary/25 hover:bg-primary/6 hover:text-primary disabled:pointer-events-none disabled:opacity-45"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {copy.previous}
        </button>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const showGap = previousPage !== undefined && page - previousPage > 1;
          const isActive = page === currentPage;

          return (
            <span key={page} className="inline-flex items-center gap-2">
              {showGap ? <span className="text-xs font-bold text-foreground/35">…</span> : null}
              <button
                type="button"
                disabled={isLoading || isActive}
                onClick={() => onPageChange(page)}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-[8px] px-3 text-xs font-black transition disabled:pointer-events-none",
                  isActive
                    ? "bg-primary text-white shadow-[0_8px_18px_rgba(0,74,198,0.16)]"
                    : "border border-border/70 bg-background text-foreground/70 hover:border-primary/25 hover:bg-primary/6 hover:text-primary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border/70 bg-background px-3 text-xs font-bold text-foreground/72 transition hover:border-primary/25 hover:bg-primary/6 hover:text-primary disabled:pointer-events-none disabled:opacity-45"
        >
          {copy.next}
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
