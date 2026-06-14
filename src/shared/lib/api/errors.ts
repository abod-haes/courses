export type ApiErrorCode = "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "UNKNOWN_ERROR";

export type ApiErrorPayload = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
};

export class ApiClientError extends Error {
  status: number;
  code: ApiErrorCode;
  details?: unknown;

  constructor({ status, code, message, details }: Readonly<{ status: number; code: ApiErrorCode; message: string; details?: unknown }>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
