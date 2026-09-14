import type { Metadata } from "next";
import { cookies } from "next/headers";
import { JsonLd } from "@/shared/components/seo/json-ld";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { defaultCatalogPerPage } from "@/shared/api/paging";
import { createSeoMetadata, itemListJsonLd } from "@/shared/lib/seo";
import type { Locale } from "@/shared/lib/types";
import { getBooksPageCopy } from "./books.data";
import { getBooks } from "./api/books.api";
import { BooksLibrary } from "./components/books-library.component";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

function buildMetadata(locale: Locale): Metadata {
  const copy = getBooksPageCopy(locale);

  return createSeoMetadata({
    title: copy.meta.title,
    description: copy.meta.description,
    path: "/books",
    locale,
    keywords: locale === "ar" ? ["كتب طبية", "كتب طب تجميلي", "كتب طبية رقمية"] : ["medical books", "aesthetic medicine books", "digital medical books"],
  });
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

  return (
    <>
      <JsonLd data={itemListJsonLd(initialPage.data.map((book) => ({ name: book.title, path: book.href })))} />
      <BooksLibrary copy={copy} initialPage={initialPage} locale={locale} />
    </>
  );
}
