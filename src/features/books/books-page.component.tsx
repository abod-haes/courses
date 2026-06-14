import type { Metadata } from "next";
import { cookies } from "next/headers";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";
import { getBooks, getBooksPageCopy } from "./books.data";
import { BooksLibrary } from "./components/books-library.component";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

function buildMetadata(locale: Locale): Metadata {
  const copy = getBooksPageCopy(locale);

  return {
    title: {
      absolute: copy.meta.title,
    },
    description: copy.meta.description,
    alternates: {
      canonical: "/books",
    },
    openGraph: {
      title: copy.meta.ogTitle,
      description: copy.meta.ogDescription,
      type: "website",
      url: "/books",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
    },
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
  const books = getBooks(locale);

  return <BooksLibrary locale={locale} copy={copy} books={books} />;
}
