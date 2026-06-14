export { apiClient, createApiClient } from "@/shared/lib/api/api-client.service";
export type { ApiErrorCode, ApiErrorPayload } from "@/shared/lib/api/errors";
export { ApiClientError, isApiClientError } from "@/shared/lib/api/errors";
export type {
  ApiEnvelope,
  ApiPaginatedResponse,
  ApiPaginationMeta,
  ApiPaginationParams,
  ApiResponseMeta,
  ApiSuccessEnvelope,
  ApiFailureEnvelope,
} from "@/shared/lib/api/api.type";
