import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import type { Locale } from "@/shared/lib/types";
import { getBookById, getBooksPageCopy } from "./books.data";
import { BookDetailHero } from "./components/book-detail-hero.component";
import { BookDetailTabs } from "./components/book-detail-tabs.component";
import { BookProductDetailsCard } from "./components/book-product-details-card.component";

function getLocaleFromCookies(cookieLocale: string | null | undefined): Locale {
  return resolveLocale(cookieLocale);
}

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  return getLocaleFromCookies(localeCookie);
}

export async function generateBookDetailMetadata(bookId: string): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const book = getBookById(locale, bookId);

  if (!book) {
    return {
      title: "Book not found",
    };
  }

  return {
    title: {
      absolute: `${book.title} - IASS`,
    },
    description: book.description,
    alternates: {
      canonical: book.href,
    },
    openGraph: {
      title: `${book.title} - IASS`,
      description: book.description,
      type: "website",
      url: book.href,
      images: [book.image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} - IASS`,
      description: book.description,
      images: [book.image],
    },
  };
}

export async function BookDetailPage({ bookId }: Readonly<{ bookId: string }>) {
  const locale = await getCurrentLocale();
  const copy = getBooksPageCopy(locale);
  const book = getBookById(locale, bookId);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-full bg-section-bg">
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <BookDetailHero book={book} copy={copy.detail} />

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <BookDetailTabs book={book} labels={copy.detail.tabs} />
          <BookProductDetailsCard title={copy.detail.productDetailsTitle} details={book.details.productDetails} />
        </section>
      </div>
    </div>
  );
}
