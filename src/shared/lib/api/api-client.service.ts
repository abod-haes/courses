import type { ZodType } from "zod";
import { ApiClientError, type ApiErrorCode, type ApiErrorPayload } from "./errors";
import type { ApiEnvelope, ApiResponseMeta } from "./api.type";

type RequestOptions<TRequest, TResponse> = {
  method?: "GET" | "POST";
  body?: TRequest;
  requestSchema?: ZodType<TRequest>;
  responseSchema?: ZodType<TResponse>;
  metaSchema?: ZodType<ApiResponseMeta>;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export function createApiClient(basePath = "/api") {
  async function request<TResponse, TRequest = undefined>(
    path: string,
    init: RequestOptions<TRequest, TResponse> = {},
  ): Promise<TResponse> {
    const { body, requestSchema, responseSchema, metaSchema, headers, method, cache } = init;

    const validatedBody = body !== undefined && requestSchema ? requestSchema.parse(body) : body;

    const response = await fetch(`${basePath}${path}`, {
      method,
      cache,
      headers: {
        Accept: "application/json",
        ...(validatedBody !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(headers ?? {}),
      },
      body: validatedBody !== undefined ? JSON.stringify(validatedBody) : undefined,
    });

    const envelope = (await response.json().catch(() => null)) as ApiEnvelope<TResponse, ApiErrorPayload> | null;

    if (!envelope) {
      throw new ApiClientError({
        status: response.status,
        code: "UNKNOWN_ERROR",
        message: "The server returned an empty response.",
      });
    }

    if (!response.ok || envelope.success === false) {
      const error = envelope.success === false ? envelope.error : { code: "UNKNOWN_ERROR" as const, message: "Request failed." };
      const details = "details" in error ? error.details : undefined;

      throw new ApiClientError({
        status: response.status,
        code: normalizeApiErrorCode(error.code),
        message: error.message,
        details,
      });
    }

    if (metaSchema && "meta" in envelope && envelope.meta !== undefined) {
      metaSchema.parse(envelope.meta);
    }

    const data = responseSchema ? responseSchema.parse(envelope.data) : envelope.data;

    return data;
  }

  return {
    get<TResponse>(path: string, options?: Omit<RequestOptions<undefined, TResponse>, "body" | "requestSchema">) {
      return request<TResponse>(path, { ...options, method: "GET" });
    },
    post<TResponse, TRequest = unknown>(path: string, options: RequestOptions<TRequest, TResponse> = {}) {
      return request<TResponse, TRequest>(path, { ...options, method: "POST" });
    },
  };
}

export const apiClient = createApiClient();

function normalizeApiErrorCode(code: string): ApiErrorCode {
  switch (code) {
    case "VALIDATION_ERROR":
    case "NOT_FOUND":
    case "UNAUTHORIZED":
    case "UNKNOWN_ERROR":
      return code;
    default:
      return "UNKNOWN_ERROR";
  }
}
