import { getBooks } from "@/features/books/api/books.api";
import type { BookItemView } from "@/features/books/books.types";
import { getCourses } from "@/features/courses/api/courses.api";
import type { CourseItemView } from "@/features/courses/courses.types";
import { ApiError, apiFetch } from "@/shared/api/client";
import type { ApiEnvelope, Book, CheckoutItemType, Course, Order, OrderItem, PaginatedEnvelope } from "@/shared/api/types";
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

type CheckoutCartItem = Readonly<{
  type: CheckoutItemType;
  id: number;
}>;

export type BookAccessResponse = Readonly<{
  bookId: number;
  title: string | Record<string, string | null>;
  accessType: "external_url" | "signed_url";
  accessUrl: string;
  expiresAt: string | null;
}>;

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function text(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const record = value as Record<string, unknown>;
  return text(record.en) || text(record.ar) || fallback;
}

function formatPrice(value: unknown, currency: unknown, locale: Locale): string {
  const amount = numberValue(value, 0);
  const currencyCode = text(currency, "USD").toUpperCase();
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currencyCode) ? currencyCode : "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
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
    title: text(course.title, copy.labels.course),
    description: text(course.shortDescription, text(course.title, copy.labels.course)),
    category: text(course.category.name, copy.labels.course),
    price: formatPrice(course.price, course.currency, locale),
    amount: numberValue(course.price, 0),
    image: course.thumbnail?.url ?? "/images/course-1.png",
    imageAlt: course.thumbnail?.alt ?? text(course.title, copy.labels.course),
    href: `/courses/${course.slug}`,
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function rawBookToCheckoutItem(book: Book, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  return {
    id: String(book.id),
    type: "book",
    typeLabel: copy.labels.book,
    title: text(book.title, copy.labels.book),
    description: text(book.shortDescription, text(book.title, copy.labels.book)),
    category: text(book.category.name, copy.labels.book),
    price: formatPrice(book.price, book.currency, locale),
    amount: numberValue(book.price, 0),
    image: book.cover?.url ?? "/images/book-1.png",
    imageAlt: book.cover?.alt ?? text(book.title, copy.labels.book),
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
    amount: numberValue(item.price, 0),
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

function unwrap<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === "object" && "data" in response) return (response as ApiEnvelope<T>).data;
  return response as T;
}

function uniqueCartItems(items: readonly CheckoutCartItem[]): CheckoutCartItem[] {
  const seen = new Set<string>();
  const result: CheckoutCartItem[] = [];

  for (const item of items) {
    const key = `${item.type}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

async function getStoredCheckoutSelectionFromApi(locale: Locale, copy: CheckoutCopy, cartItems: readonly CheckoutCartItem[]): Promise<CheckoutItemView[]> {
  const selectedItems = uniqueCartItems(cartItems);
  const shouldLoadCourses = selectedItems.some((item) => item.type === "course");
  const shouldLoadBooks = selectedItems.some((item) => item.type === "book");

  const [coursesPage, booksPage] = await Promise.all([
    shouldLoadCourses ? getCourses({ locale, page: 1, perPage: 100 }) : Promise.resolve({ data: [] as CourseItemView[] }),
    shouldLoadBooks ? getBooks({ locale, page: 1, perPage: 100 }) : Promise.resolve({ data: [] as BookItemView[] }),
  ]);

  return selectedItems.flatMap((item) => {
    if (item.type === "course") {
      const course = coursesPage.data.find((entry) => String(entry.id) === String(item.id));
      return course ? [courseToCheckoutItem(course, copy)] : [];
    }

    const book = booksPage.data.find((entry) => String(entry.id) === String(item.id));
    return book ? [bookToCheckoutItem(book, copy)] : [];
  });
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
  cartItems: readonly CheckoutCartItem[] = [],
): Promise<CheckoutItemView[]> {
  if (isEmpty) return [];

  if (cartItems.length > 0 && (!itemType || !itemId)) {
    return getStoredCheckoutSelectionFromApi(locale, copy, cartItems);
  }

  if (!itemType || !itemId) return [];

  if (itemType === "course") {
    const page = await getCourses({ locale, page: 1, perPage: 100 });
    const course = page.data.find((entry) => String(entry.id) === String(itemId));
    return course ? [courseToCheckoutItem(course, copy)] : [];
  }

  if (itemType === "book") {
    const page = await getBooks({ locale, page: 1, perPage: 100 });
    const book = page.data.find((entry) => String(entry.id) === String(itemId));
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

export async function getBookAccessFromApi(bookId: string | number, locale: Locale, token?: string): Promise<BookAccessResponse> {
  const response = await apiFetch<ApiEnvelope<BookAccessResponse> | BookAccessResponse>(`/my/books/${bookId}/access`, {
    headers: authHeaders(token),
    searchParams: { locale },
  });

  return unwrap(response);
}
