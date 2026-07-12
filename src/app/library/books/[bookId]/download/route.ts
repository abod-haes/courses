import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";

export const dynamic = "force-dynamic";

const defaultBackendApiBaseUrl = "https://medical-courses.mustafafares.com/api";
const defaultBackendOrigin = "https://medical-courses.mustafafares.com";
const defaultAppOrigin = "https://iass-mocha.vercel.app";
const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

type RouteContext = Readonly<{ params: Promise<{ bookId: string }> }>;

type BookAccessResponse = Readonly<{
  bookId: number;
  title: string | Record<string, string | null>;
  accessType: "external_url" | "signed_url";
  accessUrl: string;
  expiresAt: string | null;
}>;

type BookAccessEnvelope = Readonly<{
  data?: BookAccessResponse;
}>;

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

async function requireSessionToken(returnTo: string): Promise<string | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(websiteSessionCookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(returnTo)}`, appOrigin()));
  }

  return token;
}

function withProtocol(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function appOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || defaultAppOrigin;
  return withProtocol(configured).replace(/\/+$/, "");
}

function isLocalHost(hostname: string): boolean {
  return localHosts.has(hostname) || hostname.endsWith(".localhost");
}

function isFrontendHost(hostname: string): boolean {
  try {
    const appHostname = new URL(appOrigin()).hostname;
    return hostname === appHostname || hostname.endsWith(".vercel.app");
  } catch {
    return hostname.endsWith(".vercel.app");
  }
}

function normalizeBackendApiBaseUrl(value: string): string {
  const configured = withProtocol(value.trim().replace(/\/+$/, ""));

  try {
    const url = new URL(configured);

    if (isLocalHost(url.hostname) || isFrontendHost(url.hostname)) {
      return defaultBackendApiBaseUrl;
    }

    url.pathname = url.pathname.replace(/\/+$/, "");
    if (!url.pathname || url.pathname === "/") url.pathname = "/api";
    if (!url.pathname.endsWith("/api")) url.pathname = `${url.pathname}/api`.replace(/\/+/g, "/");
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return defaultBackendApiBaseUrl;
  }
}

function backendApiBaseUrl(): string {
  return normalizeBackendApiBaseUrl(
    process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultBackendApiBaseUrl,
  );
}

function backendOrigin(): string {
  try {
    const url = new URL(backendApiBaseUrl());
    url.pathname = url.pathname.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return defaultBackendOrigin;
  }
}

function normalizeBookAccessUrl(value: string): string {
  const accessUrl = value.trim();
  const apiOrigin = backendOrigin();

  if (!accessUrl) return "";

  try {
    const url = new URL(accessUrl, apiOrigin);

    if (isLocalHost(url.hostname) || isFrontendHost(url.hostname)) {
      const productionOrigin = new URL(apiOrigin);
      url.protocol = productionOrigin.protocol;
      url.host = productionOrigin.host;
    }

    return url.toString();
  } catch {
    return accessUrl;
  }
}

function localizedTitle(title: BookAccessResponse["title"], locale: Locale): string {
  if (typeof title === "string" && title.trim()) return title.trim();
  if (title && typeof title === "object" && !Array.isArray(title)) {
    return String(title[locale] ?? title.en ?? title.ar ?? "book").trim() || "book";
  }

  return "book";
}

function sanitizeFilename(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "book";
}

function extensionFromUrl(url: string): string {
  try {
    return new URL(url).pathname.match(/\.[a-z0-9]{2,8}$/i)?.[0] ?? ".pdf";
  } catch {
    return ".pdf";
  }
}

function downloadFilename(access: BookAccessResponse, locale: Locale, url: string): string {
  const title = sanitizeFilename(localizedTitle(access.title, locale));
  const extension = extensionFromUrl(url);
  return title.toLowerCase().endsWith(extension.toLowerCase()) ? title : `${title}${extension}`;
}

function backendAccessUrl(bookId: string): string {
  const url = new URL(`${backendApiBaseUrl()}/my/books/${encodeURIComponent(bookId)}/access`);
  return url.toString();
}

async function fetchBookAccess(bookId: string, locale: Locale, token: string): Promise<BookAccessResponse | NextResponse> {
  const response = await fetch(backendAccessUrl(bookId), {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "X-Accept-Language": locale,
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!response) {
    return NextResponse.json({ message: "Could not reach the book access API." }, { status: 502 });
  }

  if (response.status === 401) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(`/library/books/${bookId}/download`)}&sessionExpired=1`, appOrigin()));
  }

  if (response.status === 403 || response.status === 404) {
    return NextResponse.json({ message: "Book file is not available." }, { status: 404 });
  }

  if (!response.ok) {
    return NextResponse.json({ message: "Could not prepare book download." }, { status: 502 });
  }

  const payload = (await response.json().catch(() => null)) as BookAccessEnvelope | BookAccessResponse | null;
  const access = payload && "data" in payload ? payload.data : payload;

  if (!access?.accessUrl) {
    return NextResponse.json({ message: "Book file is not available." }, { status: 404 });
  }

  return access;
}

function redirectToAccessUrl(accessUrl: string, filename: string): NextResponse {
  const response = NextResponse.redirect(accessUrl, 302);
  response.headers.set("cache-control", "private, no-store, max-age=0");
  response.headers.set("x-iass-download-filename", filename);
  return response;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { bookId } = await params;
  const returnTo = `/library/books/${bookId}/download`;
  const locale = await getCurrentLocale();
  const tokenOrRedirect = await requireSessionToken(returnTo);

  if (typeof tokenOrRedirect !== "string") return tokenOrRedirect;

  const access = await fetchBookAccess(bookId, locale, tokenOrRedirect);

  if (access instanceof NextResponse) return access;

  const accessUrl = normalizeBookAccessUrl(access.accessUrl);

  if (!accessUrl) {
    return NextResponse.json({ message: "Book file is not available." }, { status: 404 });
  }

  return redirectToAccessUrl(accessUrl, downloadFilename(access, locale, accessUrl));
}
