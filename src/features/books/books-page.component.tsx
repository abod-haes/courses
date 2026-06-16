import type { Metadata } from "next";
import { cookies } from "next/headers";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { defaultCatalogPerPage } from "@/shared/api/paging";
import type { Locale } from "@/shared/lib/types";
import { getBooksPageCopy } from "./books.data";
import { getBooks } from "./api/books.api";
import { BooksLibrary } from "./components/books-library.component";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

function buildMetadata(locale: Locale): Metadata {
  const copy = getBooksPageCopy(locale);

  return {
    title: { absolute: copy.meta.title },
    description: copy.meta.description,
    alternates: { canonical: "/books" },
    openGraph: { title: copy.meta.ogTitle, description: copy.meta.ogDescription, type: "website", url: "/books" },
    twitter: { card: "summary_large_image", title: copy.meta.title, description: copy.meta.description },
  };
}

export async function generateBooksMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  return buildMetadata(getLocaleFromCookies(localeCookie));
}

export async function BooksPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  const locale = getLocaleFromCookies(localeCookie);
  const copy = getBooksPageCopy(locale);
  const initialPage = await getBooks({ locale, page: 1, perPage: defaultCatalogPerPage });

  return <BooksLibrary copy={copy} initialPage={initialPage} locale={locale} />;
}
