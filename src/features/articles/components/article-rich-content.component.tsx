import type { ArticleDetail, ArticlePageCopy } from "../articles.types";

type ArticleRichContentProps = Readonly<{
  article: ArticleDetail;
  copy: ArticlePageCopy;
}>;

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ArticleRichContent({ article, copy }: ArticleRichContentProps) {
  return (
    <article className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-foreground/62">
        <span className="rounded-full border border-primary/14 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
          {article.category}
        </span>
        <span>{copy.cards.published} {formatDate(article.publishedAt, copy.locale)}</span>
        <span aria-hidden="true">•</span>
        <span>{copy.details.writtenBy} {article.author}</span>
      </div>

      <div className="space-y-6 text-[1.02rem] leading-8 text-foreground/78 sm:text-[1.06rem]">
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
