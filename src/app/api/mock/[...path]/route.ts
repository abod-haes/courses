import { NextResponse, type NextRequest } from "next/server";
import { getMockArticles, getMockBooks, getMockCategories, getMockCourses } from "@/mocks/website/data";
import type { Article, Book, CategoryType, Course } from "@/shared/api/types";
import { pageSlice } from "@/shared/api/paging";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";

export const dynamic = "force-dynamic";

type RouteContext = Readonly<{
  params: Promise<Readonly<{ path?: string[] }>>;
}>;

type CatalogItem = Course | Book | Article;

function numberParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function textForSearch(item: CatalogItem): string {
  const parts = [item.title, item.slug, item.category.name];

  if ("shortDescription" in item) {
    parts.push(item.shortDescription, item.description);
  }

  if ("excerpt" in item) {
    parts.push(item.excerpt, item.author);
  }

  return parts.join(" ").toLowerCase();
}

function sortCatalog<T extends CatalogItem>(items: T[], sort: string | null): T[] {
  return [...items].sort((first, second) => {
    if (sort === "title") {
      return first.title.localeCompare(second.title);
    }

    return new Date(second.publishedAt ?? 0).getTime() - new Date(first.publishedAt ?? 0).getTime();
  });
}

function listResponse<T extends CatalogItem>(request: NextRequest, items: T[]) {
  const { searchParams } = request.nextUrl;
  const page = numberParam(searchParams.get("page"), 1);
  const perPage = numberParam(searchParams.get("perPage"), 9);
  const search = searchParams.get("search")?.trim().toLowerCase();
  const category = searchParams.get("filter[category]") ?? searchParams.get("category");
  const sort = searchParams.get("sort");

  const filtered = items.filter((item) => {
    const matchesStatus = item.status === "published";
    const matchesCategory = category ? item.category.slug === category || item.category.name === category : true;
    const matchesSearch = search ? textForSearch(item).includes(search) : true;
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return NextResponse.json(pageSlice(sortCatalog(filtered, sort), page, perPage));
}

function detailResponse<T extends CatalogItem>(items: T[], slug?: string) {
  const item = items.find((entry) => entry.slug === slug && entry.status === "published");

  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: item });
}

function categoriesResponse(request: NextRequest, locale: "ar" | "en") {
  const type = request.nextUrl.searchParams.get("filter[type]") ?? request.nextUrl.searchParams.get("type");
  const safeType: CategoryType | undefined = type === "course" || type === "book" || type === "article" ? type : undefined;
  return NextResponse.json({ data: getMockCategories(locale, safeType) });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const [resource, slug] = path;
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"));

  if (resource === "categories") {
    return categoriesResponse(request, locale);
  }

  if (resource === "courses") {
    const items = getMockCourses(locale);
    return slug ? detailResponse(items, slug) : listResponse(request, items);
  }

  if (resource === "books") {
    const items = getMockBooks(locale);
    return slug ? detailResponse(items, slug) : listResponse(request, items);
  }

  if (resource === "articles") {
    const items = getMockArticles(locale);
    return slug ? detailResponse(items, slug) : listResponse(request, items);
  }

  return NextResponse.json({ message: "Mock endpoint not found" }, { status: 404 });
}
