/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import type { ArticlePageCopy, ArticleSummary } from "../articles.types";

type ArticleCardProps = Readonly<{
  article: ArticleSummary;
  copy: ArticlePageCopy;
}>;

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ArticleCard({ article, copy }: ArticleCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_7px_20px_rgba(17,24,39,0.05)] hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_18px_40px_rgba(29,23,213,0.10)]">
      <div className="relative overflow-hidden bg-medical-blue">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary-container" />
        <img
          src={article.image}
          alt={article.alt}
          className="relative h-[13.5rem] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 z-10 rounded-[4px] bg-primary/10 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.08em] text-primary backdrop-blur rtl:left-auto rtl:right-3">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="flex items-center gap-2 text-[0.72rem] font-medium text-foreground/58">
          <CalendarDays className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
          <span>{copy.cards.published} {formatDate(article.publishedAt, copy.locale)}</span>
        </div>

        <div className="mt-3 min-w-0 flex-1">
          <h2 className="line-clamp-2 text-[0.92rem] font-black leading-5 tracking-[-0.01em] text-foreground">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-[0.78rem] leading-5 text-foreground/68">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="line-clamp-1 text-[0.72rem] font-medium text-foreground/58">{article.author}</p>

          <Link
            href={article.href}
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.72rem] font-bold text-primary transition duration-200 hover:translate-x-0.5 hover:text-primary-strong rtl:hover:-translate-x-0.5"
          >
            {copy.cards.readArticle}
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
