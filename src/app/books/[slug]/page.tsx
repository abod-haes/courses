import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { getBookBySlug } from "@/features/books/api/books.api";
import { getBooksPageCopy } from "@/features/books/books.data";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import { createSeoMetadata } from "@/shared/lib/seo";
import type { Locale } from "@/shared/lib/types";

type PageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getCurrentLocale()]);
  const book = await getBookBySlug(slug, locale);

  if (!book) {
    return createSeoMetadata({
      title: locale === "ar" ? "الكتاب غير موجود | IASS" : "Book not found | IASS",
      description: locale === "ar" ? "الكتاب المطلوب غير متاح حاليًا." : "The requested book is not available right now.",
      path: "/books",
      locale,
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: `${book.title} | IASS Books`,
    description: book.description,
    path: book.href,
    locale,
    image: book.image,
    imageAlt: book.imageAlt,
    keywords: [book.title, book.category, book.author],
  });
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  const copy = getBooksPageCopy(locale);
  const book = await getBookBySlug(slug, locale);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-full bg-section-bg">
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <Link href="/books" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-strong">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {copy.detail.backToBooks}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start">
          <Card className="overflow-hidden rounded-[18px] bg-surface p-6 shadow-[0_12px_34px_rgba(17,24,39,0.08)]">
            <div className="relative flex h-[28rem] items-center justify-center rounded-[14px] bg-gradient-to-br from-white via-[#f3f6f8] to-[#eef2f3]">
              <Image src={book.image} alt={book.imageAlt} width={250} height={360} className="h-[86%] w-auto object-contain drop-shadow-[0_18px_22px_rgba(17,24,39,0.24)]" />
            </div>
            <Button href={`/checkout?itemType=book&itemId=${book.id}`} className="mt-5 w-full rounded-[8px] py-3 text-xs font-bold">
              {copy.detail.addToCart}
            </Button>
          </Card>

          <div>
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {book.category}
            </span>
            <h1 className="mt-5 max-w-3xl text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.5rem]">
              {book.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-foreground/58">{book.author}</p>
            <p className="mt-4 text-[1.15rem] font-black text-primary">{book.price}</p>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-foreground/68">{book.description}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card className="rounded-[14px] bg-surface p-5 shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
                <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-black text-foreground">{copy.detail.secureAccessTitle}</h2>
                <p className="mt-2 text-xs leading-6 text-foreground/60">{book.details.accessNote}</p>
              </Card>
              <Card className="rounded-[14px] bg-surface p-5 shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
                <h2 className="text-sm font-black text-foreground">{copy.detail.productDetailsTitle}</h2>
                <dl className="mt-3 space-y-2 text-xs text-foreground/64">
                  {book.details.productDetails.map((detail) => (
                    <div key={detail.label} className="flex items-center justify-between gap-3">
                      <dt>{detail.label}</dt>
                      <dd className="font-bold text-foreground">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>

            <div className="mt-8 rounded-[16px] border border-border/70 bg-surface p-6 shadow-[0_8px_24px_rgba(17,24,39,0.05)]">
              <h2 className="text-base font-black text-foreground">{copy.detail.tabs.description}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/68">
                {book.details.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {book.details.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-foreground/68">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
