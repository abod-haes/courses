import { apiFetch } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import type { Book, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { BookItemView } from "../books.types";

type RawRecord = Record<string, unknown>;
type RawBook = Book & RawRecord;
type RawPaginatedResponse<T> = PaginatedEnvelope<T> | T[] | { data?: T[] | { data?: T[]; meta?: RawRecord }; meta?: RawRecord; current_page?: number; per_page?: number; last_page?: number; total?: number; from?: number | null; to?: number | null };

const backendOrigin = "https://medical-courses.mustafafares.com";

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function currencyCode(value: unknown): string {
  const normalized = text(value, "USD").toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "USD";
}

function formatPrice(value: number, currency: unknown, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: currencyCode(currency),
    maximumFractionDigits: 0,
  }).format(value);
}

function emptyBooksPage(params: CatalogListParams): PaginatedEnvelope<BookItemView> {
  return {
    data: [],
    meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage),
  };
}

function rawObject(value: unknown): RawRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : null;
}

function absoluteMediaUrl(value: unknown, fallback: string): string {
  const url = text(value);
  if (!url) return fallback;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
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

function readCategory(book: RawRecord): { id: number; name: string; slug: string } {
  const category = rawObject(book.category);
  const id = numberValue(category?.id ?? book.categoryId ?? book.category_id, 0);
  return {
    id,
    name: text(category?.name ?? book.categoryName ?? book.category_name, "Book"),
    slug: text(category?.slug ?? book.categorySlug ?? book.category_slug, "book"),
  };
}

function readCover(book: RawRecord): { url: string; alt: string } | null {
  const cover = rawObject(book.cover) ?? rawObject(book.media) ?? rawObject(book.image);
  const directUrl = text(book.cover ?? book.coverUrl ?? book.cover_url ?? book.imageUrl ?? book.image_url);
  const url = text(cover?.url, directUrl);
  if (!url) return null;
  return { url: absoluteMediaUrl(url, "/images/book-1.png"), alt: text(cover?.alt ?? cover?.altText ?? cover?.alt_text ?? book.title, text(book.title, "Book cover")) };
}

function toBookView(book: RawBook, locale: Locale): BookItemView {
  const category = readCategory(book);
  const cover = readCover(book);
  const title = text(book.title, locale === "ar" ? "كتاب طبي" : "Medical book");
  const shortDescription = text(book.shortDescription ?? book.short_description ?? book.excerpt, title);
  const description = text(book.description, shortDescription);
  const price = numberValue(book.price, 0);
  const slug = text(book.slug, String(book.id));

  return {
    id: String(book.id),
    title,
    author: text(book.author, locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari"),
    categoryKey: category.id ? String(category.id) : category.slug,
    category: category.name,
    description: shortDescription,
    price: formatPrice(price, book.currency, locale),
    isbn: text(book.isbn, `IASS-${book.id}`),
    href: `/books/${slug}`,
    image: cover?.url ?? "/images/book-1.png",
    imageAlt: cover?.alt ?? title,
    details: {
      availability: locale === "ar" ? "متوفر كمرجع رقمي" : "Available as a digital reference",
      accessNote: locale === "ar" ? "يتم فتح المرجع الرقمي بعد إتمام الشراء بنجاح." : "Digital access is unlocked after successful purchase.",
      description: [description],
      highlights: locale === "ar" ? ["تنظيم أكاديمي واضح", "نقاط أمان عملية", "مناسب للمراجعة السريعة"] : ["Clear academic structure", "Practical safety notes", "Built for fast review"],
      tableOfContents: locale === "ar" ? ["المدخل العلمي", "إطار التقييم", "خطوات التطبيق", "مراجعة الأمان"] : ["Scientific overview", "Assessment framework", "Application steps", "Safety review"],
      authorBio: locale === "ar" ? ["محتوى صادر عن فريق IASS الأكاديمي تحت إشراف الدكتور إياس عكاري."] : ["Prepared by the IASS academic team under the supervision of Dr. Iyas Akkari."],
      productDetails: [
        { label: locale === "ar" ? "الصيغة" : "Format", value: locale === "ar" ? "مرجع رقمي" : "Digital reference" },
        { label: locale === "ar" ? "اللغة" : "Language", value: locale === "ar" ? "العربية والإنجليزية" : "Arabic and English" },
      ],
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
    console.log("[books-api] raw backend response", response);
    const normalized = normalizePaginatedResponse(response, params);
    const books = normalized.data.map((book) => toBookView(book, locale));
    console.log("[books-api] normalized books", { count: books.length, meta: normalized.meta, books });

    return {
      ...normalized,
      data: books,
    };
  } catch (error) {
    console.error("[books-api] failed to load books from backend", error);
    return emptyBooksPage(params);
  }
}

export async function getBookBySlug(slug: string, locale: Locale): Promise<BookItemView | null> {
  try {
    const response = await apiFetch<{ data?: RawBook } | RawBook>(`/books/${slug}`, {
      searchParams: { locale },
    });
    const record = rawObject(response);
    const payload = record?.data && rawObject(record.data) ? record.data as RawBook : response as RawBook;

    return toBookView(payload, locale);
  } catch (error) {
    console.error("[books-api] failed to load book detail from backend", { slug, error });
    return null;
  }
}
