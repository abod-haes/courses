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
      className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Catalog pagination"
    >
      <p className="text-xs font-bold tracking-wide text-foreground/50">
        {meta.from ?? 0}-{meta.to ?? 0} {copy.of} {meta.total} {copy.results}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border/70 bg-transparent px-3.5 text-xs font-extrabold text-foreground/68 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {copy.previous}
        </button>

        <div className="mx-0.5 flex items-center gap-1.5">
          {pages.map((page, index) => {
            const previousPage = pages[index - 1];
            const showGap = previousPage !== undefined && page - previousPage > 1;
            const isActive = page === currentPage;

            return (
              <span key={page} className="inline-flex items-center gap-1.5">
                {showGap ? <span className="px-1 text-xs font-black text-foreground/28">…</span> : null}
                <button
                  type="button"
                  disabled={isLoading || isActive}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-xs font-black transition disabled:pointer-events-none",
                    isActive
                      ? "bg-primary text-white shadow-[0_6px_14px_rgba(0,74,198,0.12)]"
                      : "border border-transparent bg-transparent text-foreground/62 hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              </span>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border/70 bg-transparent px-3.5 text-xs font-extrabold text-foreground/68 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-35"
        >
          {copy.next}
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
