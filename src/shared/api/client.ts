import { websiteSessionCookieName, websiteSessionKey, websiteUserKey } from "./website-session";

type SearchParamValue = string | number | boolean | null | undefined;

type ApiFetchOptions = RequestInit &
  Readonly<{
    searchParams?: Record<string, SearchParamValue>;
  }>;

type SerializedError = Readonly<{
  name?: string;
  message: string;
  stack?: string;
  code?: string;
  cause?: unknown;
}>;

const checkoutCartStorageKey = "iass:checkout:cart";
const defaultApiBaseUrl = "https://medical-courses.mustafafares.com/api";
const transportOnlySearchParams = new Set(["locale"]);

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    const record = error as Error & { code?: string; cause?: unknown };
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: record.code,
      cause: record.cause instanceof Error ? serializeError(record.cause) : record.cause,
    };
  }

  if (isRecord(error)) {
    return {
      name: typeof error.name === "string" ? error.name : undefined,
      message: typeof error.message === "string" ? error.message : JSON.stringify(error),
      code: typeof error.code === "string" ? error.code : undefined,
      cause: error.cause,
    };
  }

  return { message: String(error) };
}

export function describeApiError(error: unknown): unknown {
  if (error instanceof ApiError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      details: error.details instanceof Error ? serializeError(error.details) : error.details,
    };
  }

  return serializeError(error);
}

function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");

  if (!trimmed || trimmed.startsWith("/")) {
    return trimmed;
  }

  const withScheme = withProtocol(trimmed);

  try {
    const url = new URL(withScheme);
    const pathname = url.pathname.replace(/\/+$/, "");

    if (!pathname || pathname === "") {
      url.pathname = "/api";
      return url.toString().replace(/\/+$/, "");
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return withScheme;
  }
}

function isMockApiBaseUrl(baseUrl: string): boolean {
  const normalized = baseUrl.trim().replace(/\/+$/, "").toLowerCase();
  return normalized === "/api/mock" || normalized.endsWith("/api/mock");
}

function resolveApiBaseUrl(): string {
  const configuredApiUrl = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultApiBaseUrl;
  const apiBaseUrl = normalizeApiBaseUrl(configuredApiUrl);

  if (!apiBaseUrl || isMockApiBaseUrl(apiBaseUrl)) {
    throw new ApiError("Mock API is disabled. Configure a real Laravel API base URL.", 0);
  }

  return apiBaseUrl;
}

function resolveServerFallbackBaseUrl(): string | null {
  if (typeof window !== "undefined") return null;
  const value = process.env.API_SERVER_FALLBACK_BASE_URL?.trim();
  if (!value) return null;

  const normalized = normalizeApiBaseUrl(value);
  return normalized && !isMockApiBaseUrl(normalized) ? normalized : null;
}

function languageFromSearchParams(params?: Record<string, SearchParamValue>): "ar" | "en" | null {
  const value = params?.locale;
  return value === "ar" || value === "en" ? value : null;
}

function appendSearchParams(url: string, params?: Record<string, SearchParamValue>): string {
  if (!params) return url;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (transportOnlySearchParams.has(key) || value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${url}${url.includes("?") ? "&" : "?"}${query}` : url;
}

function buildApiUrl(baseUrl: string, path: string, searchParams?: Record<string, SearchParamValue>): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const apiPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBaseUrl.startsWith("/")) {
    return appendSearchParams(`${normalizedBaseUrl}${apiPath}`, searchParams);
  }

  return appendSearchParams(new URL(`${normalizedBaseUrl}${apiPath}`).toString(), searchParams);
}

function serverHttpFallbackUrl(url: string): string | null {
  if (typeof window !== "undefined") return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "medical-courses.mustafafares.com") return null;
    parsed.protocol = "http:";
    return parsed.toString();
  } catch {
    return null;
  }
}

function uniqueValues(values: readonly (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function buildRequestUrls(apiBaseUrl: string, path: string, searchParams?: Record<string, SearchParamValue>): string[] {
  const primaryUrl = buildApiUrl(apiBaseUrl, path, searchParams);
  const fallbackBaseUrl = resolveServerFallbackBaseUrl();
  const configuredFallbackUrl = fallbackBaseUrl ? buildApiUrl(fallbackBaseUrl, path, searchParams) : null;

  return uniqueValues([primaryUrl, configuredFallbackUrl, serverHttpFallbackUrl(primaryUrl)]);
}

async function readErrorDetails(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function getClientSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(websiteSessionKey) ?? readCookie(websiteSessionCookieName);
}

export function clearWebsiteClientSession(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(websiteSessionKey);
  window.localStorage.removeItem(websiteUserKey);
  window.localStorage.removeItem(checkoutCartStorageKey);
  document.cookie = `${websiteSessionCookieName}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("iass:website-session-changed"));
  window.dispatchEvent(new Event("iass:checkout-cart-changed"));
}

function redirectClientToLogin(): void {
  if (typeof window === "undefined") return;

  if (window.location.pathname === "/login") {
    clearWebsiteClientSession();
    return;
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;
  clearWebsiteClientSession();
  window.location.assign(`/login?redirectTo=${encodeURIComponent(currentPath)}&sessionExpired=1`);
}

async function sendRequest(url: string, init: RequestInit, attempt: number): Promise<Response> {
  console.log("[apiFetch] request", { method: init.method ?? "GET", url, attempt });
  const response = await fetch(url, init);
  console.log("[apiFetch] response", { status: response.status, ok: response.ok, url, attempt });
  return response;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { searchParams, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  const apiBaseUrl = resolveApiBaseUrl();
  const locale = languageFromSearchParams(searchParams);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (locale && !headers.has("Accept-Language")) {
    headers.set("Accept-Language", locale);
  }

  if (locale && !headers.has("X-Accept-Language")) {
    headers.set("X-Accept-Language", locale);
  }

  if (!headers.has("Authorization")) {
    const session = getClientSession();
    if (session) {
      headers.set("Authorization", `Bearer ${session}`);
    }
  }

  const requestInit: RequestInit = {
    cache: "no-store",
    ...init,
    headers,
  };

  let response: Response | null = null;
  const urls = buildRequestUrls(apiBaseUrl, path, searchParams);
  const transportErrors: unknown[] = [];

  for (const [index, url] of urls.entries()) {
    try {
      response = await sendRequest(url, requestInit, index + 1);
      break;
    } catch (error) {
      const serialized = serializeError(error);
      transportErrors.push({ url, error: serialized });
      console.error("[apiFetch] unable to reach API", { url, attempt: index + 1, error: serialized });
    }
  }

  if (!response) {
    throw new ApiError("Unable to reach the API server.", 0, { path, attempts: transportErrors });
  }

  if (!response.ok) {
    const details = await readErrorDetails(response);
    console.error("[apiFetch] API request failed", { url: response.url, status: response.status, details });

    if (response.status === 401) {
      redirectClientToLogin();
    }

    throw new ApiError(`API request failed with status ${response.status}`, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
