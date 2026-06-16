import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, LockKeyhole, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { BookItemView, BooksPageCopy } from "../books.types";

type BookDetailHeroProps = Readonly<{
  book: BookItemView;
  copy: BooksPageCopy["detail"];
}>;

export function BookDetailHero({ book, copy }: BookDetailHeroProps) {
  return (
    <section className="pt-7 sm:pt-9">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-[0.72rem] font-bold text-primary transition duration-200 hover:-translate-x-0.5 hover:text-primary-strong rtl:hover:translate-x-0.5"
      >
        <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        {copy.backToBooks}
      </Link>

      <div className="mt-6 grid gap-7 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <Card className="flex h-[17.5rem] items-center justify-center rounded-[8px] bg-surface p-4 shadow-[0_10px_28px_rgba(17,24,39,0.05)] sm:h-[19rem]">
          <div className="relative flex h-full w-full items-center justify-center rounded-[6px] bg-section-bg p-6">
            <Image
              src={book.image}
              alt={book.imageAlt}
              width={190}
              height={270}
              priority
              className="max-h-full w-auto object-contain drop-shadow-[0_18px_24px_rgba(17,24,39,0.18)]"
            />
          </div>
        </Card>

        <div className="min-w-0 pt-1">
          <span className="text-[0.64rem] font-black uppercase tracking-[0.12em] text-primary">
            {book.category}
          </span>

          <h1 className="mt-2 max-w-4xl text-[2rem] font-black leading-tight tracking-[-0.035em] text-foreground sm:text-[2.5rem] lg:text-[2.85rem]">
            {book.title}
          </h1>

          <p className="mt-2 text-sm font-semibold text-foreground/68">
            {book.author}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-[1.35rem] font-black tracking-[-0.02em] text-foreground">
              {book.price}
            </p>
            <span className="text-xs font-bold text-emerald-600">{book.details.availability}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={`/checkout?itemType=book&itemId=${book.id}`} className="rounded-[4px] px-5" size="sm">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {copy.addToCart}
            </Button>

            <Button variant="secondary" className="rounded-[4px] bg-surface px-5" size="sm">
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              {copy.saveForLater}
            </Button>
          </div>

          <Card className="mt-7 max-w-4xl rounded-[8px] bg-primary/5 p-5 shadow-none">
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-surface text-primary shadow-[0_5px_15px_rgba(29,23,213,0.08)]">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-black text-foreground">{copy.secureAccessTitle}</h2>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-foreground/62">
                  {book.details.accessNote}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
