import type { PaginatedEnvelope, PaginationMeta } from "./types";

export const defaultCatalogPerPage = 9;

export function nextPageFrom<T>(lastPage: PaginatedEnvelope<T>): number | undefined {
  return lastPage.meta.currentPage < lastPage.meta.lastPage ? lastPage.meta.currentPage + 1 : undefined;
}

export function buildPageMeta(total: number, page = 1, perPage = defaultCatalogPerPage): PaginationMeta {
  const currentPage = Math.max(1, page);
  const size = Math.max(1, perPage);
  const lastPage = Math.max(1, Math.ceil(total / size));

  return {
    currentPage,
    perPage: size,
    total,
    lastPage,
    from: total === 0 ? null : (currentPage - 1) * size + 1,
    to: total === 0 ? null : Math.min(currentPage * size, total),
  };
}

export function pageSlice<T>(items: readonly T[], page = 1, perPage = defaultCatalogPerPage): PaginatedEnvelope<T> {
  const meta = buildPageMeta(items.length, page, perPage);
  const start = (meta.currentPage - 1) * meta.perPage;

  return {
    data: items.slice(start, start + meta.perPage),
    meta,
  };
}
