import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { getBookAccessFromApi, type BookAccessResponse } from "@/features/checkout/checkout.api";

export const dynamic = "force-dynamic";

const defaultBackendOrigin = "https://medical-courses.mustafafares.com";
const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

type RouteContext = Readonly<{ params: Promise<{ bookId: string }> }>;

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

function appOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "https://iass-mocha.vercel.app";
  return /^https?:\/\//i.test(configured) ? configured.replace(/\/+$/, "") : `https://${configured.replace(/\/+$/, "")}`;
}

function isFrontendHost(hostname: string): boolean {
  const appHostname = (() => {
    try {
      return new URL(appOrigin()).hostname;
    } catch {
      return "";
    }
  })();

  return hostname === appHostname || hostname.endsWith(".vercel.app");
}

function backendOrigin(): string {
  const configured = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultBackendOrigin;
  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = url.pathname.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
    url.search = "";
    url.hash = "";

    if (isLocalUrl(url) || isFrontendHost(url.hostname)) {
      return defaultBackendOrigin;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return defaultBackendOrigin;
  }
}

function isLocalUrl(url: URL): boolean {
  return localHosts.has(url.hostname) || url.hostname.endsWith(".localhost");
}

function normalizeBookAccessUrl(value: string): string {
  const accessUrl = value.trim();
  const apiOrigin = backendOrigin();

  if (!accessUrl) return "";

  try {
    const url = new URL(accessUrl, apiOrigin);

    if (isLocalUrl(url) || isFrontendHost(url.hostname)) {
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

function apiErrorResponse(error: unknown, returnTo: string): NextResponse {
  if (error instanceof ApiError && error.status === 401) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(returnTo)}&sessionExpired=1`, appOrigin()));
  }

  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
    return NextResponse.json({ message: "Book file is not available." }, { status: 404 });
  }

  return NextResponse.json({ message: "Could not prepare book download." }, { status: 502 });
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

  let access: BookAccessResponse;

  try {
    access = await getBookAccessFromApi(bookId, locale, tokenOrRedirect);
  } catch (error) {
    return apiErrorResponse(error, returnTo);
  }

  const accessUrl = normalizeBookAccessUrl(access.accessUrl);

  if (!accessUrl) {
    return NextResponse.json({ message: "Book file is not available." }, { status: 404 });
  }

  return redirectToAccessUrl(accessUrl, downloadFilename(access, locale, accessUrl));
}
