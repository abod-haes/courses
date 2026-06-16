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

function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/mock";
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? `${siteUrl}/api/mock`;
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

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { searchParams, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(buildApiUrl(path, searchParams), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const details = await readErrorDetails(response);
    throw new ApiError(`API request failed with status ${response.status}`, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
