import type { ApiPaginatedResponse, ApiPaginationMeta } from "./api.type";

export function createPaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number,
): ApiPaginationMeta {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

export function createPaginatedResponse<TItem, TMeta extends Record<string, unknown> = Record<string, never>>(
  items: TItem[],
  totalItems: number,
  params: { page: number; pageSize: number } & Partial<TMeta>,
): ApiPaginatedResponse<TItem, TMeta> {
  const { page, pageSize, ...rest } = params;

  return {
    items,
    meta: {
      ...(rest as unknown as TMeta),
      pagination: createPaginationMeta(totalItems, page, pageSize),
    },
  };
}
