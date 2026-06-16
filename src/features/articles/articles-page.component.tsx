/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { Button } from "@/shared/components/ui/button";
import { defaultCatalogPerPage } from "@/shared/api/paging";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { localeCookieName } from "@/shared/lib/preferences";
import type { Locale } from "@/shared/lib/types";
import { ArticleRichContent } from "./components/article-rich-content.component";
import { ArticlesLibrary } from "./components/articles-library.component";
import { getArticleBySlug, getArticles } from "./api/articles.api";
import { getArticlePageCopy } from "./articles.data";

type ArticleDetailsParams = Readonly<{
  slug: string;
}>;

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(localeCookieName)?.value);
}

export async function generateArticlesMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const copy = getArticlePageCopy(locale);

  return {
    title: { absolute: copy.meta.listTitle },
    description: copy.meta.listDescription,
    alternates: { canonical: "/articles" },
    openGraph: {
      title: copy.meta.listTitle,
      description: copy.meta.listDescription,
      type: "website",
      url: "/articles",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.listTitle,
      description: copy.meta.listDescription,
    },
  };
}

export async function generateArticleDetailsMetadata({ params }: { params: Promise<ArticleDetailsParams> }): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getCurrentLocale()]);
  const copy = getArticlePageCopy(locale);
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    return { title: copy.meta.detailsTitleSuffix };
  }

  return {
    title: `${article.title} | ${copy.meta.detailsTitleSuffix}`,
    description: article.excerpt,
    alternates: { canonical: article.href },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: article.href,
      images: [{ url: article.image, alt: article.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export async function ArticlesPage() {
  const locale = await getCurrentLocale();
  const copy = getArticlePageCopy(locale);
  const initialPage = await getArticles({ locale, page: 1, perPage: defaultCatalogPerPage });

  return <ArticlesLibrary copy={copy} initialPage={initialPage} locale={locale} />;
}

export async function ArticleDetailsPage({ params }: { params: Promise<ArticleDetailsParams> }) {
  const [{ slug }, locale] = await Promise.all([params, getCurrentLocale()]);
  const copy = getArticlePageCopy(locale);
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const backIcon = locale === "ar" ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-medical-blue via-background to-background">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(29,23,213,0.12),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <Reveal preset="fadeUp">
            <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-strong">
              {backIcon}
              {copy.details.backToArticles}
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <Reveal preset="fadeUp" className="max-w-3xl">
              <span className="inline-flex rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {article.category}
              </span>
              <h1 className="mt-5 text-hero-lg-mobile font-bold tracking-[-0.02em] text-foreground sm:text-hero-lg">{article.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">{article.excerpt}</p>
            </Reveal>

            <Reveal preset="softScale" className="overflow-hidden rounded-[24px] border border-border/70 bg-surface p-3 shadow-[0_18px_48px_rgba(17,24,39,0.08)]">
              <div className="relative overflow-hidden rounded-[18px] bg-medical-blue">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary-container" />
                <img src={article.image} alt={article.alt} className="relative h-[280px] w-full object-cover lg:h-[340px]" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ArticleRichContent article={article} copy={copy} />

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-20">
        <Reveal preset="fadeUp" className="rounded-[22px] border border-border/70 bg-surface p-6 shadow-[0_12px_34px_rgba(17,24,39,0.06)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{copy.details.continueLearningTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/70">{copy.details.continueLearningDescription}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/courses" variant="primary" size="sm">{copy.details.browseCourses}</Button>
            <Button href="/books" variant="secondary" size="sm">{copy.details.browseBooks}</Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
