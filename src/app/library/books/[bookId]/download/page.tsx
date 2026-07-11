import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { getBookAccessFromApi } from "@/features/checkout/checkout.api";

export const dynamic = "force-dynamic";

const defaultBackendOrigin = "https://medical-courses.mustafafares.com";
const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

type PageProps = Readonly<{ params: Promise<{ bookId: string }> }>;

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

async function requireSessionToken(returnTo: string): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(websiteSessionCookieName)?.value;

  if (!token) redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}`);

  return token;
}

function backendOrigin(): string {
  const configured = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultBackendOrigin;
  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = url.pathname.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
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

  if (!accessUrl) return "/library?tab=books";

  try {
    const url = new URL(accessUrl, apiOrigin);

    if (isLocalUrl(url)) {
      const productionOrigin = new URL(apiOrigin);
      url.protocol = productionOrigin.protocol;
      url.host = productionOrigin.host;
    }

    return url.toString();
  } catch {
    return accessUrl;
  }
}

function handleBookAccessError(error: unknown, returnTo: string): never {
  if (error instanceof ApiError && error.status === 401) {
    redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}&sessionExpired=1`);
  }

  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
    notFound();
  }

  throw error;
}

export default async function Page({ params }: PageProps) {
  const { bookId } = await params;
  const returnTo = `/library/books/${bookId}/download`;
  const locale = await getCurrentLocale();
  const token = await requireSessionToken(returnTo);
  const access = await getBookAccessFromApi(bookId, locale, token).catch((error) => handleBookAccessError(error, returnTo));

  redirect(normalizeBookAccessUrl(access.accessUrl));
}
