/* eslint-disable @next/next/no-img-element */
import { CalendarDays } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
    <Card className="group flex h-full flex-col overflow-hidden shadow-[0_4px_12px_rgba(17,24,39,0.05)] hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(17,24,39,0.08)]">
      <div className="p-4 pb-0">
        <div className="relative overflow-hidden rounded-[12px] border border-border/60 bg-medical-blue">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary-container" />
          <img
            src={article.image}
            alt={article.alt}
            className="relative h-[210px] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/40 bg-white/92 px-3 py-1 text-xs font-semibold text-primary shadow-[0_8px_18px_rgba(15,23,42,0.12)] backdrop-blur rtl:left-auto rtl:right-4">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground/58">
          <CalendarDays className="h-4 w-4 text-primary/70" aria-hidden="true" />
          <span>{copy.cards.published} {formatDate(article.publishedAt, copy.locale)}</span>
        </div>

        <div className="mt-3 min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-7 tracking-tight text-foreground">{article.title}</h2>
          <p className="mt-3 text-sm leading-6 text-foreground/70">{article.excerpt}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="rounded-[8px] border border-border/60 bg-surface-soft px-3 py-1 text-[11px] font-medium text-foreground/68">
            {article.author}
          </span>
          <Button href={article.href} variant="primary" size="sm">
            {copy.cards.readArticle}
          </Button>
        </div>
      </div>
    </Card>
  );
}
