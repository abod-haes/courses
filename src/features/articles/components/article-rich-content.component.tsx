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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fallbackBodyHtml(article: ArticleDetail): string {
  if (article.bodyHtml?.trim()) return article.bodyHtml;
  return (article.body ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

export function ArticleRichContent({ article, copy }: ArticleRichContentProps) {
  return (
    <article className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-foreground/62">
        <span className="rounded-full border border-primary/14 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
          {article.category}
        </span>
        <span>{copy.cards.published} {formatDate(article.publishedAt, copy.locale)}</span>
        <span aria-hidden="true">•</span>
        <span>{copy.details.writtenBy} {article.author}</span>
      </div>

      <div
        className="article-content rounded-[28px] border border-border/70 bg-surface px-5 py-6 text-[1.02rem] leading-8 text-foreground/78 shadow-[0_18px_52px_rgba(17,24,39,0.07)] sm:px-8 sm:py-8 sm:text-[1.06rem] lg:px-10 lg:py-10 [&_*:first-child]:mt-0 [&_*:last-child]:mb-0 [&_a]:font-bold [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_blockquote]:my-8 [&_blockquote]:rounded-2xl [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.055] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-foreground/78 [&_code]:rounded-md [&_code]:bg-primary/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em] [&_figcaption]:mt-3 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:font-semibold [&_figcaption]:text-foreground/50 [&_figure]:my-9 [&_figure]:overflow-hidden [&_figure]:rounded-[24px] [&_figure]:border [&_figure]:border-border/70 [&_figure]:bg-gradient-to-b [&_figure]:from-primary/[0.035] [&_figure]:to-surface [&_figure]:p-2 [&_figure]:shadow-[0_18px_46px_rgba(17,24,39,0.09)] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-[1.45rem] [&_h2]:font-black [&_h2]:leading-tight [&_h2]:tracking-[-0.025em] [&_h2]:text-foreground sm:[&_h2]:text-[1.7rem] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-[1.2rem] [&_h3]:font-extrabold [&_h3]:tracking-[-0.015em] [&_h3]:text-foreground [&_hr]:my-8 [&_hr]:border-border [&_img]:mx-auto [&_img]:my-0 [&_img]:max-h-[620px] [&_img]:w-full [&_img]:rounded-[18px] [&_img]:border [&_img]:border-border/70 [&_img]:object-contain [&_img]:shadow-[0_14px_36px_rgba(17,24,39,0.08)] [&_li]:my-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:my-5 [&_pre]:my-7 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-foreground [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-background [&_strong]:font-black [&_table]:my-7 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-2xl [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-3 [&_th]:border [&_th]:border-border [&_th]:bg-primary/[0.06] [&_th]:p-3 [&_th]:text-start [&_ul]:my-6 [&_ul]:list-disc [&_ul]:ps-6"
        dangerouslySetInnerHTML={{ __html: fallbackBodyHtml(article) }}
      />
    </article>
  );
}
