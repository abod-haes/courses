import { getBooks } from "@/features/books/api/books.api";
import type { BookItemView } from "@/features/books/books.types";
import { getCourses } from "@/features/courses/api/courses.api";
import type { CourseItemView } from "@/features/courses/courses.types";
import { ApiError, apiFetch } from "@/shared/api/client";
import type { Book, CheckoutItemType, Course, Order, OrderItem, PaginatedEnvelope } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";
import type { CheckoutCopy, CheckoutItemView, OrderView } from "./checkout.types";

type CheckoutSessionResponse = Readonly<{
  data?: Readonly<{
    orderId?: number | string;
    orderNumber?: string;
    checkoutUrl?: string;
    paymentUrl?: string;
    url?: string;
    status?: string;
    total?: number;
    currency?: string;
  }>;
  checkoutUrl?: string;
  paymentUrl?: string;
  url?: string;
}>;

type LibraryResponse = Readonly<{
  data?: Readonly<{
    courses?: Course[];
    books?: Book[];
  }>;
  courses?: Course[];
  books?: Book[];
}>;

function formatPrice(value: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function parseAmount(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, "");
  return Number.parseFloat(normalized) || 0;
}

function statusLabel(status: Order["status"], copy: CheckoutCopy): string {
  if (status === "paid") return copy.labels.paid;
  if (status === "pending") return copy.labels.pending;
  return copy.labels.cancelled;
}

function formatOrderDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function courseToCheckoutItem(course: CourseItemView, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: course.id,
    type: "course",
    typeLabel: copy.labels.course,
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    amount: parseAmount(course.price),
    image: course.image,
    imageAlt: course.imageAlt,
    href: course.href,
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function bookToCheckoutItem(book: BookItemView, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: book.id,
    type: "book",
    typeLabel: copy.labels.book,
    title: book.title,
    description: book.description,
    category: book.category,
    price: book.price,
    amount: parseAmount(book.price),
    image: book.image,
    imageAlt: book.imageAlt,
    href: book.href,
    accessLabel: copy.labels.digitalAccess,
  };
}

function rawCourseToCheckoutItem(course: Course, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: String(course.id),
    type: "course",
    typeLabel: copy.labels.course,
    title: course.title,
    description: course.shortDescription,
    category: course.category.name,
    price: formatPrice(course.price, course.currency, locale),
    amount: course.price,
    image: course.thumbnail?.url ?? "/images/course-1.png",
    imageAlt: course.thumbnail?.alt ?? course.title,
    href: `/courses/${course.slug}`,
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function rawBookToCheckoutItem(book: Book, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: String(book.id),
    type: "book",
    typeLabel: copy.labels.book,
    title: book.title,
    description: book.shortDescription,
    category: book.category.name,
    price: formatPrice(book.price, book.currency, locale),
    amount: book.price,
    image: book.cover?.url ?? "/images/book-1.png",
    imageAlt: book.cover?.alt ?? book.title,
    href: `/books/${book.slug}`,
    accessLabel: copy.labels.digitalAccess,
  };
}

function orderItemToCheckoutItem(item: OrderItem, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: String(item.itemId),
    type: item.type,
    typeLabel: item.type === "course" ? copy.labels.course : copy.labels.book,
    title: item.title,
    description: item.type === "course" ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
    category: item.type === "course" ? copy.labels.course : copy.labels.book,
    price: formatPrice(item.price, item.currency, locale),
    amount: item.price,
    image: item.type === "course" ? "/images/course-1.png" : "/images/book-1.png",
    imageAlt: item.title,
    href: item.type === "course" ? `/courses/${item.itemId}` : `/books/${item.itemId}`,
    accessLabel: item.type === "course" ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
  };
}

function authHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function checkoutReturnUrl(path: "/checkout/success" | "/checkout/cancel"): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export function getCheckoutTotal(items: readonly CheckoutItemView[], locale: Locale): string {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return formatPrice(total, "USD", locale);
}

export async function getCheckoutSelectionFromApi(
  locale: Locale,
  copy: CheckoutCopy,
  itemType?: CheckoutItemType | string,
  itemId?: string,
  isEmpty?: boolean,
): Promise<CheckoutItemView[]> {
  if (isEmpty || !itemType || !itemId) return [];

  if (itemType === "course") {
    const page = await getCourses({ locale, page: 1, perPage: 100 });
    const course = page.data.find((entry) => entry.id === itemId);
    return course ? [courseToCheckoutItem(course, copy)] : [];
  }

  if (itemType === "book") {
    const page = await getBooks({ locale, page: 1, perPage: 100 });
    const book = page.data.find((entry) => entry.id === itemId);
    return book ? [bookToCheckoutItem(book, copy)] : [];
  }

  return [];
}

export async function createCheckoutSession(items: readonly CheckoutItemView[]): Promise<string> {
  const response = await apiFetch<CheckoutSessionResponse>("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({ type: item.type, id: Number(item.id) })),
      successUrl: checkoutReturnUrl("/checkout/success"),
      cancelUrl: checkoutReturnUrl("/checkout/cancel"),
    }),
  });

  const payload = response.data ?? response;
  const checkoutUrl = payload.checkoutUrl ?? payload.paymentUrl ?? payload.url;

  if (!checkoutUrl) {
    throw new ApiError("Checkout URL was not returned by the API.", 502, response);
  }

  return checkoutUrl;
}

export async function getOrdersFromApi(locale: Locale, copy: CheckoutCopy, token?: string): Promise<OrderView[]> {
  const response = await apiFetch<PaginatedEnvelope<Order>>("/my/orders", {
    headers: authHeaders(token),
    searchParams: { locale, page: 1, perPage: 20 },
  });

  return response.data.map((order) => ({
    id: String(order.id),
    orderNumber: order.orderNumber,
    status: order.status === "failed" || order.status === "expired" ? "cancelled" : order.status,
    statusLabel: statusLabel(order.status, copy),
    date: formatOrderDate(order.createdAt, locale),
    total: formatPrice(order.total, order.currency, locale),
    itemCount: order.itemCount,
    items: order.items.map((item) => orderItemToCheckoutItem(item, locale, copy)),
    paymentSummary:
      order.payments[0]?.status ??
      (locale === "ar" ? "لا توجد عملية دفع مسجلة لهذا الطلب." : "No payment entry is recorded for this order."),
  }));
}

export async function getLibraryFromApi(locale: Locale, copy: CheckoutCopy, token?: string) {
  const response = await apiFetch<LibraryResponse>("/my/library", {
    headers: authHeaders(token),
    searchParams: { locale },
  });

  const payload = response.data ?? response;

  return {
    courses: (payload.courses ?? []).map((course) => rawCourseToCheckoutItem(course, locale, copy)),
    books: (payload.books ?? []).map((book) => rawBookToCheckoutItem(book, locale, copy)),
  };
}
