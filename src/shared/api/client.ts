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

function resolveApiBaseUrl(): string {
  const configuredApiUrl = process.env.API_BASE_URL?.trim() ?? process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  if (typeof window !== "undefined") {
    return "/api/mock";
  }

  return `${resolveSiteUrl()}/api/mock`;
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

function buildApiUrl(path: string, searchParams?: Record<string, SearchParamValue>): string {
  const baseUrl = resolveApiBaseUrl().replace(/\/$/, "");
  const apiPath = path.startsWith("/") ? path : `/${path}`;

  if (baseUrl.startsWith("/")) {
    return appendSearchParams(`${baseUrl}${apiPath}`, searchParams);
  }

  return appendSearchParams(new URL(`${baseUrl}${apiPath}`).toString(), searchParams);
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

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { searchParams, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!headers.has("Authorization")) {
    const session = getClientSession();
    if (session) {
      headers.set("Authorization", `Bearer ${session}`);
    }
  }

  const response = await fetch(buildApiUrl(path, searchParams), {
    ...init,
    headers,
  });

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
