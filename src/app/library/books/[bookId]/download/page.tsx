import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/shared/api/client";
import { websiteSessionCookieName } from "@/shared/api/website-session";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { getBookAccessFromApi } from "@/features/checkout/checkout.api";

export const dynamic = "force-dynamic";

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

  redirect(access.accessUrl);
}
