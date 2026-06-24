import { websiteSessionKey } from "./website-session";

type SearchParamValue = string | number | boolean | null | undefined;

type ApiFetchOptions = RequestInit &
  Readonly<{
    searchParams?: Record<string, SearchParamValue>;
  }>;

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

function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function resolveSiteUrl(): string {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return withProtocol(configuredSiteUrl);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim() ?? process.env.NEXT_PUBLIC_VERCEL_URL?.trim();

  if (vercelUrl) {
    return withProtocol(vercelUrl);
  }

  return "http://localhost:3000";
}

function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/$/, "");

  if (!trimmed || trimmed.startsWith("/")) {
    return trimmed;
  }

  const withScheme = withProtocol(trimmed);

  try {
    const url = new URL(withScheme);
    const pathname = url.pathname.replace(/\/$/, "");

    if (!pathname || pathname === "") {
      url.pathname = "/api";
      return url.toString().replace(/\/$/, "");
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return withScheme;
  }
}

function resolveMockBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/mock";
  }

  return `${resolveSiteUrl()}/api/mock`;
}

function shouldUseMockFallback(): boolean {
  return process.env.API_ENABLE_MOCK_FALLBACK !== "false" && process.env.NEXT_PUBLIC_API_ENABLE_MOCK_FALLBACK !== "false";
}

function resolveApiBaseUrls(): { primary: string; fallback: string | null } {
  const configuredApiUrl = process.env.API_BASE_URL?.trim() ?? process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const mockBaseUrl = resolveMockBaseUrl();

  if (!configuredApiUrl) {
    return { primary: mockBaseUrl, fallback: null };
  }

  const primary = normalizeApiBaseUrl(configuredApiUrl);

  return {
    primary,
    fallback: shouldUseMockFallback() && primary !== mockBaseUrl ? mockBaseUrl : null,
  };
}

function appendSearchParams(url: string, params?: Record<string, SearchParamValue>): string {
  if (!params) return url;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${url}${url.includes("?") ? "&" : "?"}${query}` : url;
}

function buildApiUrl(baseUrl: string, path: string, searchParams?: Record<string, SearchParamValue>): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const apiPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBaseUrl.startsWith("/")) {
    return appendSearchParams(`${normalizedBaseUrl}${apiPath}`, searchParams);
  }

  return appendSearchParams(new URL(`${normalizedBaseUrl}${apiPath}`).toString(), searchParams);
}

async function readErrorDetails(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

function getClientSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(websiteSessionKey);
}

function redirectClientToLogin(): void {
  if (typeof window === "undefined") return;

  if (window.location.pathname === "/login") return;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  window.localStorage.removeItem(websiteSessionKey);
  window.location.assign(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
}

function isNetworkFailure(error: unknown): boolean {
  return error instanceof TypeError || (error instanceof Error && /fetch failed|network|failed/i.test(error.message));
}

async function sendRequest(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, init);
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { searchParams, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  const { primary, fallback } = resolveApiBaseUrls();

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
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

  let response: Response;

  try {
    response = await sendRequest(buildApiUrl(primary, path, searchParams), requestInit);
  } catch (error) {
    if (!fallback || !isNetworkFailure(error)) {
      throw new ApiError("Unable to reach the API server.", 0, error);
    }

    response = await sendRequest(buildApiUrl(fallback, path, searchParams), requestInit);
  }

  if (!response.ok && fallback && response.status >= 500) {
    response = await sendRequest(buildApiUrl(fallback, path, searchParams), requestInit);
  }

  if (!response.ok) {
    const details = await readErrorDetails(response);

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
