import { getBooks } from "@/features/books/api/books.api";
import type { BookItemView } from "@/features/books/books.types";
import { getCourses } from "@/features/courses/api/courses.api";
import type { CourseItemView } from "@/features/courses/courses.types";
import { ApiError, apiFetch } from "@/shared/api/client";
import { currencyCode, formatMoney, localizedText, mediaAlt, mediaUrl, numberValue, rawObject } from "@/shared/api/normalizers";
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

function text(value: unknown, fallback = "", locale: Locale = "en"): string {
  return localizedText(value, fallback, locale);
}

function stringValue(value: unknown, fallback = ""): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function entityRecord(record: Record<string, unknown>, key: "course" | "book"): Record<string, unknown> {
  return rawObject(record[key]) ?? rawObject(record.item) ?? rawObject(record.resource) ?? record;
}

function entityId(record: Record<string, unknown>, key: "course" | "book"): string {
  const source = entityRecord(record, key);
  const idKey = key === "course" ? source.courseId ?? source.course_id : source.bookId ?? source.book_id;
  return stringValue(source.id ?? idKey ?? source.itemId ?? source.item_id ?? record.id ?? record.itemId ?? record.item_id ?? source.slug);
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

function courseToCheckoutItem(course: CourseItemView, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  const amount = numberValue(course.amount ?? course.price, 0);
  const currency = currencyCode(course.currency);

  return {
    id: course.id,
    type: "course",
    typeLabel: copy.labels.course,
    title: course.title,
    description: course.description,
    category: course.category,
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: course.image,
    imageAlt: course.imageAlt,
    href: course.href,
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function bookToCheckoutItem(book: BookItemView, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  const amount = numberValue(book.amount ?? book.price, 0);
  const currency = currencyCode(book.currency);

  return {
    id: book.id,
    type: "book",
    typeLabel: copy.labels.book,
    title: book.title,
    description: book.description,
    category: book.category,
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: book.image,
    imageAlt: book.imageAlt,
    href: book.href,
    accessLabel: copy.labels.digitalAccess,
  };
}

function rawCourseToCheckoutItem(course: Course, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  const record = course as unknown as Record<string, unknown>;
  const source = entityRecord(record, "course");
  const category = rawObject(source.category ?? record.category);
  const firstLesson = rawObject(source.firstLesson ?? source.first_lesson ?? record.firstLesson ?? record.first_lesson);
  const id = entityId(record, "course");
  const title = text(source.title ?? record.title, copy.labels.course, locale);
  const amount = numberValue(source.price ?? record.price, 0);
  const currency = currencyCode(source.currency ?? record.currency);
  const thumbnail = source.thumbnail ?? source.thumbnailUrl ?? source.thumbnail_url ?? source.image ?? source.imageUrl ?? source.image_url ?? source.cover ?? source.media ?? record.thumbnail ?? record.thumbnailUrl ?? record.thumbnail_url ?? record.image ?? record.imageUrl ?? record.image_url ?? record.media;

  return {
    id,
    type: "course",
    typeLabel: copy.labels.course,
    title,
    description: text(source.shortDescription ?? source.short_description ?? source.description ?? record.shortDescription ?? record.short_description ?? record.description, title, locale),
    category: text(category?.name ?? source.categoryName ?? source.category_name ?? record.categoryName ?? record.category_name, copy.labels.course, locale),
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: mediaUrl(thumbnail, "/images/course-1.png"),
    imageAlt: mediaAlt(thumbnail, title, locale),
    href: text(firstLesson?.href, `/learn/courses/${id}`, locale),
    accessLabel: copy.labels.lifetimeAccess,
  };
}

function rawBookToCheckoutItem(book: Book, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  const record = book as unknown as Record<string, unknown>;
  const source = entityRecord(record, "book");
  const category = rawObject(source.category ?? record.category);
  const id = entityId(record, "book");
  const title = text(source.title ?? record.title, copy.labels.book, locale);
  const amount = numberValue(source.price ?? record.price, 0);
  const currency = currencyCode(source.currency ?? record.currency);
  const cover = source.cover ?? source.coverUrl ?? source.cover_url ?? source.thumbnail ?? source.thumbnailUrl ?? source.thumbnail_url ?? source.image ?? source.imageUrl ?? source.image_url ?? source.media ?? record.cover ?? record.coverUrl ?? record.cover_url ?? record.image ?? record.imageUrl ?? record.image_url ?? record.media;

  return {
    id,
    type: "book",
    typeLabel: copy.labels.book,
    title,
    description: text(source.shortDescription ?? source.short_description ?? source.description ?? record.shortDescription ?? record.short_description ?? record.description, title, locale),
    category: text(category?.name ?? source.categoryName ?? source.category_name ?? record.categoryName ?? record.category_name, copy.labels.book, locale),
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: mediaUrl(cover, "/images/book-1.png"),
    imageAlt: mediaAlt(cover, title, locale),
    href: `/library/books/${id}/download`,
    accessLabel: copy.labels.digitalAccess,
  };
}

function orderItemToCheckoutItem(item: OrderItem, locale: Locale, copy: CheckoutCopy): CheckoutItemView {
  const currency = currencyCode(item.currency);
  const amount = numberValue(item.price, 0);

  return {
    id: String(item.itemId),
    type: item.type,
    typeLabel: item.type === "course" ? copy.labels.course : copy.labels.book,
    title: item.title,
    description: item.type === "course" ? copy.labels.lifetimeAccess : copy.labels.digitalAccess,
    category: item.type === "course" ? copy.labels.course : copy.labels.book,
    price: formatMoney(amount, currency, locale),
    amount,
    currency,
    image: item.type === "course" ? "/images/course-1.png" : "/images/book-1.png",
    imageAlt: item.title,
    href: item.type === "course" ? `/learn/courses/${item.itemId}` : `/library/books/${item.itemId}/download`,
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
      return course ? [courseToCheckoutItem(course, locale, copy)] : [];
    }

    const book = booksPage.data.find((entry) => String(entry.id) === String(item.id));
    return book ? [bookToCheckoutItem(book, locale, copy)] : [];
  });
}

export function getCheckoutTotal(items: readonly CheckoutItemView[], locale: Locale): string {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const currency = items[0]?.currency ?? "USD";
  return formatMoney(total, currency, locale);
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
    return course ? [courseToCheckoutItem(course, locale, copy)] : [];
  }

  if (itemType === "book") {
    const page = await getBooks({ locale, page: 1, perPage: 100 });
    const book = page.data.find((entry) => String(entry.id) === String(itemId));
    return book ? [bookToCheckoutItem(book, locale, copy)] : [];
  }

  return [];
}

export async function createCheckoutSession(items: readonly CheckoutItemView[]): Promise<string> {
  const checkoutItems = uniqueCartItems(
    items.map((item) => ({ type: item.type, id: Number(item.id) })),
  );

  if (checkoutItems.length === 0 || checkoutItems.some((item) => !Number.isInteger(item.id) || item.id < 1)) {
    throw new ApiError("One or more checkout item IDs are invalid.", 422, {
      errors: { items: ["One or more selected items are invalid. Refresh the catalog and try again."] },
    });
  }

  const response = await apiFetch<CheckoutSessionResponse>("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: checkoutItems,
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
    total: formatMoney(order.total, order.currency, locale),
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
