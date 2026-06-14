import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiErrorPayload } from "./errors";
import type { ApiFailureEnvelope, ApiResponseMeta, ApiSuccessEnvelope } from "./api.type";

export function apiSuccess<TData, TMeta = ApiResponseMeta>(data: TData, init?: ResponseInit, meta?: TMeta) {
  return NextResponse.json<ApiSuccessEnvelope<TData, TMeta>>(
    {
      success: true,
      data,
      ...(meta !== undefined ? { meta } : {}),
    },
    init,
  );
}

export function apiFailure<TMeta = ApiResponseMeta>(
  message: string,
  status = 400,
  code: ApiErrorCode = "UNKNOWN_ERROR",
  details?: unknown,
  meta?: TMeta,
) {
  return NextResponse.json<ApiFailureEnvelope<ApiErrorPayload, TMeta>>(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      ...(meta !== undefined ? { meta } : {}),
    },
    { status },
  );
}
