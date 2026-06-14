import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { BookItemView } from "../books.types";

type BookCardProps = Readonly<{
  book: BookItemView;
  viewDetailsLabel: string;
  isbnLabel: string;
}>;

const coverToneClasses: Record<BookItemView["coverTone"], string> = {
  blue: "border-blue-100 from-blue-50 via-white to-blue-100 text-blue-950",
  cyan: "border-cyan-100 from-cyan-50 via-white to-cyan-100 text-cyan-950",
  teal: "border-teal-100 from-teal-50 via-white to-teal-100 text-teal-950",
  slate: "border-slate-200 from-slate-50 via-white to-slate-200 text-slate-950",
  violet: "border-violet-100 from-violet-50 via-white to-violet-100 text-violet-950",
  emerald: "border-emerald-100 from-emerald-50 via-white to-emerald-100 text-emerald-950",
};

const coverIconToneClasses: Record<BookItemView["coverTone"], string> = {
  blue: "bg-blue-600/10 text-blue-700 ring-blue-500/10",
  cyan: "bg-cyan-600/10 text-cyan-700 ring-cyan-500/10",
  teal: "bg-teal-600/10 text-teal-700 ring-teal-500/10",
  slate: "bg-slate-900/10 text-slate-700 ring-slate-500/10",
  violet: "bg-violet-600/10 text-violet-700 ring-violet-500/10",
  emerald: "bg-emerald-600/10 text-emerald-700 ring-emerald-500/10",
};

function BookCover({ book }: Readonly<{ book: BookItemView }>) {
  return (
    <div className="relative flex h-[15.5rem] items-center justify-center rounded-[14px] bg-surface-soft p-5">
      <div
        className={`relative flex h-full w-[9.6rem] overflow-hidden rounded-[10px] border bg-gradient-to-br shadow-[0_18px_35px_rgba(17,24,39,0.16)] transition duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_22px_45px_rgba(29,23,213,0.16)] ${coverToneClasses[book.coverTone]}`}
      >
        <div className="absolute inset-y-0 start-0 w-6 border-e border-white/70 bg-slate-950/[0.05]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute -bottom-12 left-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative flex min-w-0 flex-1 flex-col justify-between p-5 ps-9">
          <span className="inline-flex w-fit rounded-[6px] border border-white/70 bg-white/70 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-primary shadow-sm">
            {book.category}
          </span>

          <div className="space-y-3">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-[9px] ring-1 ${coverIconToneClasses[book.coverTone]}`}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="text-[0.95rem] font-black leading-5 tracking-tight">
              {book.title}
            </h3>
          </div>

          <div className="space-y-1.5 opacity-70">
            <span className="block h-px w-16 bg-current/30" />
            <span className="block h-px w-11 bg-current/20" />
            <span className="block h-px w-14 bg-current/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book, viewDetailsLabel, isbnLabel }: BookCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-surface shadow-[0_8px_22px_rgba(17,24,39,0.05)] hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_18px_45px_rgba(29,23,213,0.10)]">
      <div className="p-4 pb-0">
        <BookCover book={book} />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex rounded-[7px] border border-primary/10 bg-primary/6 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
              {book.category}
            </span>
            <span className="text-sm font-extrabold text-primary">{book.price}</span>
          </div>

          <h2 className="text-[1.02rem] font-bold leading-6 tracking-tight text-foreground">
            {book.title}
          </h2>
          <p className="mt-1 text-xs font-medium text-foreground/55">{book.author}</p>

          <p className="mt-3 text-sm leading-6 text-foreground/68">
            {book.description}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4">
          <p className="text-[11px] font-medium text-foreground/48">
            {isbnLabel}: <span className="text-foreground/65">{book.isbn}</span>
          </p>

          <Button href={book.href} variant="secondary" size="sm" className="w-full rounded-[9px]">
            {viewDetailsLabel}
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
