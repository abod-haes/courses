import { apiFetch } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import type { Article, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { ArticleDetail, ArticleSummary } from "../articles.types";

function emptyArticlesPage(params: CatalogListParams): PaginatedEnvelope<ArticleSummary> {
  return {
    data: [],
    meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage),
  };
}

function toArticleSummary(article: Article): ArticleSummary {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category.name,
    author: article.author ?? "IASS Academic Team",
    image: article.image?.url ?? "/images/course-1.png",
    alt: article.image?.alt ?? article.title,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    href: `/articles/${article.slug}`,
  };
}

export async function getArticles(params: CatalogListParams): Promise<PaginatedEnvelope<ArticleSummary>> {
  const locale = params.locale ?? "en";

  try {
    const response = await apiFetch<PaginatedEnvelope<Article>>("/articles", {
      searchParams: {
        locale,
        page: params.page,
        perPage: params.perPage,
        search: params.search,
        sort: params.sort ?? "-publishedAt",
        "filter[category]": params.category,
      },
    });

    return {
      ...response,
      data: response.data.map(toArticleSummary),
    };
  } catch {
    return emptyArticlesPage(params);
  }
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<ArticleDetail | null> {
  try {
    const response = await apiFetch<{ data: Article }>(`/articles/${slug}`, {
      searchParams: { locale },
    });

    return {
      ...toArticleSummary(response.data),
      body: (response.data.body ?? response.data.excerpt).split("\n\n").filter(Boolean),
    };
  } catch {
    return null;
  }
}
