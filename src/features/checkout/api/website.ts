import { apiFetch } from "@/shared/api/client";
import { currencyCode, formatMoney as formatSharedMoney, mediaUrl, numberValue, rawObject } from "@/shared/api/normalizers";
import type { ApiEnvelope, Book, Course, Order, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { CheckoutCopy, CheckoutItemView, OrderView } from "../checkout.types";

function formatMoney(value: number, currency: string, locale: Locale): string {
  return formatSharedMoney(value, currency, locale, { maximumFractionDigits: 0 });
}

export function getCheckoutTotal(items: readonly CheckoutItemView[]): string {
  const amount = items.reduce((total, item) => total + item.amount, 0);
  return formatMoney(amount, items[0]?.currency ?? "USD", "en");
}

function toCheckoutItem(source: Course | Book, type: "course" | "book", copy: CheckoutCopy, locale: Locale): CheckoutItemView {
  const isCourse = type === "course";
  const record = source as unknown as Record<string, unknown>;
  const media = isCourse ? record.thumbnail : record.cover;
  const amount = numberValue(record.price, 0);
  const currency = currencyCode(record.currency);
  const title = typeof source.title === "string" ? source.title : String(source.id);

  return {
    id: String(source.id),
    type,
    typeLabel: isCourse ? copy.labels.course : copy.labels.book,
    title,
    description: typeof source.shortDescription === "string" ? source.shortDescription : title,
    category: source.category.name,
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: mediaUrl(media, isCourse ? "/images/course-1.png" : "/images/book-1.png"),
    imageAlt: typeof rawObject(media)?.alt === "string" ? String(rawObject(media)?.alt) : title,
    href: isCourse ? `/courses/${source.slug}` : `/books/${source.slug}`,
    accessLabel: isCourse ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
  };
}

export async function getCheckoutSelectionFromApi(locale: Locale, itemType: string | undefined, itemId: string | undefined, isEmpty: boolean | undefined, copy: CheckoutCopy): Promise<CheckoutItemView[]> {
  if (isEmpty) return [];

  if (itemType === "course" && itemId) {
    const response = await apiFetch<PaginatedEnvelope<Course>>("/courses", { searchParams: { locale, page: 1, perPage: 100 } });
    return response.data.filter((course) => String(course.id) === itemId).map((course) => toCheckoutItem(course, "course", copy, locale));
  }

  if (itemType === "book" && itemId) {
    const response = await apiFetch<PaginatedEnvelope<Book>>("/books", { searchParams: { locale, page: 1, perPage: 100 } });
    return response.data.filter((book) => String(book.id) === itemId).map((book) => toCheckoutItem(book, "book", copy, locale));
  }

  const [courses, books] = await Promise.all([
    apiFetch<PaginatedEnvelope<Course>>("/courses", { searchParams: { locale, page: 1, perPage: 2 } }),
    apiFetch<PaginatedEnvelope<Book>>("/books", { searchParams: { locale, page: 1, perPage: 1 } }),
  ]);

  return [
    ...courses.data.map((course) => toCheckoutItem(course, "course", copy, locale)),
    ...books.data.map((book) => toCheckoutItem(book, "book", copy, locale)),
  ].slice(0, 2);
}

export async function createCheckout(items: Array<{ type: "course" | "book"; id: number }>): Promise<{ checkoutUrl: string }> {
  const response = await apiFetch<ApiEnvelope<{ checkoutUrl: string }>>("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  return response.data;
}

export async function getLibraryFromApi(locale: Locale, copy: CheckoutCopy, headers?: HeadersInit): Promise<{ courses: CheckoutItemView[]; books: CheckoutItemView[] }> {
  const response = await apiFetch<ApiEnvelope<{ courses: Course[]; books: Book[] }>>("/my/library", { headers, searchParams: { locale } });

  return {
    courses: response.data.courses.map((course) => toCheckoutItem(course, "course", copy, locale)),
    books: response.data.books.map((book) => toCheckoutItem(book, "book", copy, locale)),
  };
}

export async function getOrdersFromApi(locale: Locale, copy: CheckoutCopy, headers?: HeadersInit): Promise<OrderView[]> {
  const response = await apiFetch<PaginatedEnvelope<Order>>("/my/orders", { headers, searchParams: { locale, page: 1, perPage: 20 } });

  return response.data.map((order) => ({
    id: String(order.id),
    orderNumber: order.orderNumber,
    status: order.status === "paid" || order.status === "pending" ? order.status : "cancelled",
    statusLabel: order.status === "paid" ? copy.labels.paid : order.status === "pending" ? copy.labels.pending : copy.labels.cancelled,
    date: new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-US", { dateStyle: "medium" }).format(new Date(order.createdAt)),
    total: formatMoney(order.total, order.currency, locale),
    itemCount: order.itemCount,
    items: order.items.map((item) => ({
      id: String(item.itemId),
      type: item.type,
      typeLabel: item.type === "course" ? copy.labels.course : copy.labels.book,
      title: item.title,
      description: item.type === "course" ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
      category: item.type === "course" ? copy.labels.course : copy.labels.book,
      price: formatMoney(item.price, item.currency, locale),
      amount: item.price,
      currency: currencyCode(item.currency),
      image: item.type === "course" ? "/images/course-1.png" : "/images/book-1.png",
      imageAlt: item.title,
      href: item.type === "course" ? `/courses/${item.itemId}` : `/books/${item.itemId}`,
      accessLabel: item.type === "course" ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
    })),
    paymentSummary: order.payments[0] ? `${order.payments[0].provider} · ${order.payments[0].status}` : copy.orders.paymentSummary,
  }));
}
