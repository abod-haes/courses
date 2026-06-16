import { apiFetch } from "@/shared/api/client";
import type { Article, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { ArticleDetail, ArticleSummary } from "../articles.types";

function toArticleSummary(article: Article): ArticleSummary {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category.name,
    author: article.author,
    image: article.image?.url ?? "/images/course-1.png",
    alt: article.image?.alt ?? article.title,
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    href: `/articles/${article.slug}`,
  };
}

export async function getArticles(params: CatalogListParams): Promise<PaginatedEnvelope<ArticleSummary>> {
  const locale = params.locale ?? "en";
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
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<ArticleDetail | null> {
  try {
    const response = await apiFetch<{ data: Article }>(`/articles/${slug}`, {
      searchParams: { locale },
    });

    return {
      ...toArticleSummary(response.data),
      body: response.data.body.split("\n\n").filter(Boolean),
    };
  } catch {
    return null;
  }
}
