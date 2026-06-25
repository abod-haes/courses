import { apiFetch } from "@/shared/api/client";
import { buildPageMeta, defaultCatalogPerPage } from "@/shared/api/paging";
import type { Book, CatalogListParams, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { BookItemView } from "../books.types";

function formatPrice(value: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function emptyBooksPage(params: CatalogListParams): PaginatedEnvelope<BookItemView> {
  return {
    data: [],
    meta: buildPageMeta(0, params.page, params.perPage ?? defaultCatalogPerPage),
  };
}

function toBookView(book: Book, locale: Locale): BookItemView {
  const description = book.description ?? book.shortDescription;

  return {
    id: String(book.id),
    title: book.title,
    author: locale === "ar" ? "د. إياس عكاري" : "Dr. Iyas Akkari",
    categoryKey: book.category.slug,
    category: book.category.name,
    description: book.shortDescription,
    price: formatPrice(book.price, book.currency, locale),
    isbn: book.isbn ?? `IASS-${book.id}`,
    href: `/books/${book.slug}`,
    image: book.cover?.url ?? "/images/book-1.png",
    imageAlt: book.cover?.alt ?? book.title,
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
    const response = await apiFetch<PaginatedEnvelope<Book>>("/books", {
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
      data: response.data.map((book) => toBookView(book, locale)),
    };
  } catch {
    return emptyBooksPage(params);
  }
}

export async function getBookBySlug(slug: string, locale: Locale): Promise<BookItemView | null> {
  try {
    const response = await apiFetch<{ data: Book }>(`/books/${slug}`, {
      searchParams: { locale },
    });

    return toBookView(response.data, locale);
  } catch {
    return null;
  }
}
