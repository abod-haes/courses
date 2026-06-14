export type ApiPaginationParams = Readonly<{
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
}>;

export type ApiPaginationMeta = Readonly<{
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>;

export type ApiResponseMeta = Readonly<{
  requestId?: string;
  timestamp?: string;
  pagination?: ApiPaginationMeta;
  [key: string]: unknown;
}>;

export type ApiSuccessEnvelope<TData, TMeta = ApiResponseMeta> = Readonly<{
  success: true;
  data: TData;
  meta?: TMeta;
}>;

export type ApiFailureEnvelope<TError, TMeta = ApiResponseMeta> = Readonly<{
  success: false;
  error: TError;
  meta?: TMeta;
}>;

export type ApiEnvelope<TData, TError, TMeta = ApiResponseMeta> =
  | ApiSuccessEnvelope<TData, TMeta>
  | ApiFailureEnvelope<TError, TMeta>;

export type ApiPaginatedResponse<TItem, TMeta = ApiResponseMeta> = Readonly<{
  items: TItem[];
  meta: TMeta & {
    pagination: ApiPaginationMeta;
  };
}>;
