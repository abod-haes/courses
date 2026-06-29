import { apiFetch, describeApiError } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import { absoluteMediaUrl, formatMoney, localizedText, numberValue, rawObject, type RawRecord } from "@/shared/api/normalizers";
import type { Book, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { BookItemView } from "../books.types";

type RawBook = Book & RawRecord;
type RawPaginatedResponse<T> = PaginatedEnvelope<T> | T[] | { data?: T[] | { data?: T[]; meta?: RawRecord }; meta?: RawRecord; current_page?: number; per_page?: number; last_page?: number; total?: number; from?: number | null; to?: number | null };

function text(value: unknown, fallback = "", locale: Locale = "en"): string {
  return localizedText(value, fallback, locale);
}

function formatPrice(value: unknown, currency: unknown, locale: Locale): string {
  return formatMoney(value, currency, locale, { maximumFractionDigits: 0 });
}

function emptyBooksPage(params: CatalogListParams): PaginatedEnvelope<BookItemView> {
  return { data: [], meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage) };
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

function readCategory(book: RawRecord, locale: Locale): { id: number; name: string; slug: string } {
  const category = rawObject(book.category);
  const id = numberValue(category?.id ?? book.categoryId ?? book.category_id, 0);
  return { id, name: text(category?.name ?? book.categoryName ?? book.category_name, "Book", locale), slug: text(category?.slug ?? book.categorySlug ?? book.category_slug, "book", locale) };
}

function readCover(book: RawRecord, locale: Locale): { url: string; alt: string } | null {
  const cover = rawObject(book.cover) ?? rawObject(book.media) ?? rawObject(book.image);
  const directUrl = text(book.cover ?? book.coverUrl ?? book.cover_url ?? book.imageUrl ?? book.image_url, "", locale);
  const url = text(cover?.url, directUrl, locale);
  if (!url) return null;
  const title = text(book.title, "Medical book", locale);
  return { url: absoluteMediaUrl(url, "/images/book-1.png"), alt: text(cover?.alt ?? cover?.altText ?? cover?.alt_text ?? book.title, title, locale) };
}

function readStringList(value: unknown, locale: Locale): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item, "", locale)).filter(Boolean);
}

function readProductDetails(book: RawRecord, locale: Locale): BookItemView["details"]["productDetails"] {
  const details = book.productDetails ?? book.product_details;
  if (!Array.isArray(details)) return [];

  return details
    .map((item) => {
      const record = rawObject(item);
      if (!record) return null;
      const label = text(record.label, "", locale);
      const value = text(record.value, "", locale);
      return label && value ? { label, value } : null;
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

function toBookView(book: RawBook, locale: Locale): BookItemView {
  const category = readCategory(book, locale);
  const cover = readCover(book, locale);
  const title = text(book.title, "Medical book", locale);
  const shortDescription = text(book.shortDescription ?? book.short_description ?? book.excerpt, title, locale);
  const description = text(book.description, shortDescription, locale);
  const slug = text(book.slug, String(book.id), locale);

  return {
    id: String(book.id),
    title,
    author: text(book.author, "", locale),
    categoryKey: category.id ? String(category.id) : category.slug,
    category: category.name,
    description: shortDescription,
    price: formatPrice(book.price, book.currency, locale),
    isbn: text(book.isbn, "", locale),
    href: `/books/${slug}`,
    image: cover?.url ?? "/images/book-1.png",
    imageAlt: cover?.alt ?? title,
    details: {
      availability: text(book.availability, "", locale),
      accessNote: text(book.accessNote ?? book.access_note, "", locale),
      description: description ? [description] : [],
      highlights: readStringList(book.highlights, locale),
      tableOfContents: readStringList(book.tableOfContents ?? book.table_of_contents, locale),
      authorBio: readStringList(book.authorBio ?? book.author_bio, locale),
      productDetails: readProductDetails(book, locale),
    },
  };
}

export async function getBooks(params: CatalogListParams): Promise<PaginatedEnvelope<BookItemView>> {
  const locale = params.locale ?? "en";

  try {
    const response = await apiFetch<RawPaginatedResponse<RawBook>>("/books", {
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
    const books = normalized.data.map((book) => toBookView(book, locale));

    return { ...normalized, data: books };
  } catch (error) {
    console.error("[books-api] failed to load books from backend", describeApiError(error));
    return emptyBooksPage(params);
  }
}

export async function getBookBySlug(slug: string, locale: Locale): Promise<BookItemView | null> {
  try {
    const response = await apiFetch<{ data?: RawBook } | RawBook>(`/books/${slug}`, { searchParams: { locale } });
    const record = rawObject(response);
    const payload = record?.data && rawObject(record.data) ? record.data as RawBook : response as RawBook;

    return toBookView(payload, locale);
  } catch (error) {
    console.error("[books-api] failed to load book detail from backend", { slug, error: describeApiError(error) });
    return null;
  }
}
