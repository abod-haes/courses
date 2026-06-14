import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { BookCategoryKey, BookItemView } from "../books.types";

type BookCardProps = Readonly<{
  book: BookItemView;
  viewDetailsLabel: string;
}>;

const coverBackgroundClasses: Record<BookCategoryKey, string> = {
  anatomy: "bg-[#071013]",
  cardiology: "bg-gradient-to-br from-white via-[#f3f6f8] to-[#eef2f3]",
  surgery: "bg-gradient-to-br from-[#d5f4ee] via-[#c5eee8] to-[#a8ded7]",
  pediatrics: "bg-gradient-to-br from-white via-[#f5f6f6] to-[#eeeeee]",
};

const coverImageClasses: Record<BookCategoryKey, string> = {
  anatomy: "h-[88%] w-auto",
  cardiology: "h-[84%] w-auto",
  surgery: "h-[76%] w-auto",
  pediatrics: "h-[70%] w-auto",
};

function BookCover({ book }: Readonly<{ book: BookItemView }>) {
  return (
    <div className={cn("relative flex h-[16rem] items-center justify-center overflow-hidden", coverBackgroundClasses[book.categoryKey])}>
      <span className="absolute left-3 top-3 z-10 rounded-[4px] bg-primary/10 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.08em] text-primary rtl:left-auto rtl:right-3">
        {book.category}
      </span>

      <Image
        src={book.image}
        alt={book.imageAlt}
        width={210}
        height={300}
        sizes="(max-width: 640px) 80vw, (max-width: 1280px) 35vw, 220px"
        className={cn(
          "object-contain drop-shadow-[0_18px_22px_rgba(17,24,39,0.24)] transition duration-300 group-hover:scale-[1.03]",
          coverImageClasses[book.categoryKey],
        )}
      />
    </div>
  );
}

export function BookCard({ book, viewDetailsLabel }: BookCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_7px_20px_rgba(17,24,39,0.05)] hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_18px_40px_rgba(29,23,213,0.10)]">
      <BookCover book={book} />

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-1 text-[0.92rem] font-black leading-5 tracking-[-0.01em] text-foreground">
            {book.title}
          </h2>
          <p className="mt-1 text-[0.72rem] font-medium text-foreground/58">{book.author}</p>

          <p className="mt-3 line-clamp-3 text-[0.78rem] leading-5 text-foreground/68">
            {book.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[0.88rem] font-black text-primary">{book.price}</p>

          <Link
            href={book.href}
            className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold text-primary transition duration-200 hover:translate-x-0.5 hover:text-primary-strong rtl:hover:-translate-x-0.5"
          >
            {viewDetailsLabel}
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
