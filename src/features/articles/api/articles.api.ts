import { apiFetch } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import { absoluteMediaUrl, localizedText, numberValue, rawObject, type RawRecord } from "@/shared/api/normalizers";
import type { Article, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { ArticleDetail, ArticleSummary } from "../articles.types";

type RawArticle = Article & RawRecord;
type RawPaginatedResponse<T> = PaginatedEnvelope<T> | T[] | { data?: T[] | { data?: T[]; meta?: RawRecord }; meta?: RawRecord; current_page?: number; per_page?: number; last_page?: number; total?: number; from?: number | null; to?: number | null };

function emptyArticlesPage(params: CatalogListParams): PaginatedEnvelope<ArticleSummary> {
  return {
    data: [],
    meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage),
  };
}

function text(value: unknown, fallback = "", locale: Locale = "en"): string {
  return localizedText(value, fallback, locale);
}

function safePublishedAt(value: unknown): string {
  const date = new Date(text(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizePaginatedResponse<T>(response: RawPaginatedResponse<T>, params: CatalogListParams): PaginatedEnvelope<T> {
  if (Array.isArray(response)) return { data: response, meta: buildPageMeta(response.length, params.page, params.perPage ?? defaultCatalogPerPage) };

  const record = rawObject(response) ?? {};
  const nested = rawObject(record.data);
  const data = Array.isArray(record.data) ? record.data as T[] : Array.isArray(nested?.data) ? nested.data as T[] : [];
  const meta = (rawObject(record.meta) ?? rawObject(nested?.meta) ?? nested ?? record) as RawRecord;
  const page = numberValue(meta.currentPage ?? meta.current_page, params.page ?? 1);
  const perPage = numberValue(meta.perPage ?? meta.per_page, params.perPage ?? defaultCatalogPerPage);
  const total = numberValue(meta.total, data.length);

  return {
    data,
    meta: {
      currentPage: Math.max(1, page),
      perPage: Math.max(1, perPage),
      total,
      lastPage: numberValue(meta.lastPage ?? meta.last_page, Math.max(1, Math.ceil(total / Math.max(1, perPage)))),
      from: meta.from === null || meta.from === undefined ? (total ? (Math.max(1, page) - 1) * Math.max(1, perPage) + 1 : null) : numberValue(meta.from, 1),
      to: meta.to === null || meta.to === undefined ? (total ? Math.min(Math.max(1, page) * Math.max(1, perPage), total) : null) : numberValue(meta.to, data.length),
    },
  };
}

function readCategory(article: RawRecord, locale: Locale): string {
  const category = rawObject(article.category);
  return text(category?.name ?? article.categoryName ?? article.category_name, "Article", locale);
}

function readImage(article: RawRecord, locale: Locale): { url: string; alt: string } | null {
  const image = rawObject(article.image) ?? rawObject(article.media) ?? rawObject(article.thumbnail);
  const directUrl = text(article.image ?? article.imageUrl ?? article.image_url ?? article.articleImage ?? article.article_image ?? article.thumbnail ?? article.thumbnailUrl ?? article.thumbnail_url, "", locale);
  const url = text(image?.url, directUrl, locale);
  if (!url) return null;
  const title = text(article.title, "Article", locale);
  return { url: absoluteMediaUrl(url, "/images/course-1.png"), alt: text(image?.alt ?? image?.altText ?? image?.alt_text ?? article.title, title, locale) };
}

function toArticleSummary(article: RawArticle, locale: Locale): ArticleSummary {
  const image = readImage(article, locale);
  const title = text(article.title, "Article", locale);
  const slug = text(article.slug, String(article.id), locale);
  const excerpt = text(article.excerpt ?? article.shortDescription ?? article.short_description, title, locale);

  return {
    id: numberValue(article.id, 0),
    slug,
    title,
    excerpt,
    category: readCategory(article, locale),
    author: text(article.author, "IASS Academic Team", locale),
    image: image?.url ?? "/images/course-1.png",
    alt: image?.alt ?? title,
    publishedAt: safePublishedAt(article.publishedAt ?? article.published_at),
    href: `/articles/${slug}`,
  };
}

export async function getArticles(params: CatalogListParams): Promise<PaginatedEnvelope<ArticleSummary>> {
  const locale = params.locale ?? "en";

  try {
    const response = await apiFetch<RawPaginatedResponse<RawArticle>>("/articles", {
      searchParams: {
        locale,
        page: params.page,
        perPage: params.perPage,
        search: params.search,
        sort: params.sort ?? "-publishedAt",
        "filter[categoryId]": params.category,
      },
    });
    const normalized = normalizePaginatedResponse(response, params);
    const articles = normalized.data.map((article) => toArticleSummary(article, locale));

    return {
      ...normalized,
      data: articles,
    };
  } catch (error) {
    console.error("[articles-api] failed to load articles from backend", error);
    return emptyArticlesPage(params);
  }
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<ArticleDetail | null> {
  try {
    const response = await apiFetch<{ data?: RawArticle } | RawArticle>(`/articles/${slug}`, {
      searchParams: { locale },
    });
    const record = rawObject(response);
    const payload = record?.data && rawObject(record.data) ? record.data as RawArticle : response as RawArticle;

    return {
      ...toArticleSummary(payload, locale),
      body: text(payload.body, text(payload.excerpt, "", locale), locale).split("\n\n").filter(Boolean),
    };
  } catch (error) {
    console.error("[articles-api] failed to load article detail from backend", { slug, error });
    return null;
  }
}
