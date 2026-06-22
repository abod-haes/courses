import { NextResponse, type NextRequest } from "next/server";
import { getMockArticles, getMockBooks, getMockCategories, getMockCourses } from "@/mocks/website/data";
import type { Article, Book, CategoryType, CheckoutItemType, Course, Order, OrderItem, PaymentSummary } from "@/shared/api/types";
import { pageSlice } from "@/shared/api/paging";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";

export const dynamic = "force-dynamic";

type RouteContext = Readonly<{
  params: Promise<Readonly<{ path?: string[] }>>;
}>;

type CatalogItem = Course | Book | Article;

type MockLocale = "ar" | "en";

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

    if (sort === "price" && "price" in first && "price" in second) {
      return first.price - second.price;
    }

    if (sort === "-price" && "price" in first && "price" in second) {
      return second.price - first.price;
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

function categoriesResponse(request: NextRequest, locale: MockLocale) {
  const type = request.nextUrl.searchParams.get("filter[type]") ?? request.nextUrl.searchParams.get("type");
  const safeType: CategoryType | undefined = type === "course" || type === "book" || type === "article" ? type : undefined;
  return NextResponse.json({ data: getMockCategories(locale, safeType) });
}

function homeResponse(request: NextRequest, locale: MockLocale) {
  const { searchParams } = request.nextUrl;
  const coursesLimit = Math.min(numberParam(searchParams.get("coursesLimit"), 3), 12);
  const booksLimit = Math.min(numberParam(searchParams.get("booksLimit"), 3), 12);
  const articlesLimit = Math.min(numberParam(searchParams.get("articlesLimit"), 3), 12);

  return NextResponse.json({
    data: {
      latestCourses: sortCatalog(getMockCourses(locale), "-publishedAt").slice(0, coursesLimit),
      latestBooks: sortCatalog(getMockBooks(locale), "-publishedAt").slice(0, booksLimit),
      latestArticles: sortCatalog(getMockArticles(locale), "-publishedAt").slice(0, articlesLimit),
    },
  });
}

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

function toOrderItem(item: Course | Book, type: CheckoutItemType, id: number): OrderItem {
  return {
    id,
    type,
    itemId: item.id,
    title: item.title,
    price: item.price,
    currency: item.currency,
  };
}

function getPurchasedItems(locale: MockLocale): OrderItem[] {
  const courses = getMockCourses(locale);
  const books = getMockBooks(locale);

  return [toOrderItem(courses[0], "course", 1), toOrderItem(books[0], "book", 2)];
}

function buildMockOrder(locale: MockLocale, overrides: Partial<Pick<Order, "id" | "orderNumber" | "status" | "createdAt" | "paidAt">> = {}): Order {
  const items = getPurchasedItems(locale);
  const subtotal = money(items.reduce((sum, item) => sum + item.price, 0));
  const createdAt = overrides.createdAt ?? new Date(Date.UTC(2026, 5, 18, 10, 30)).toISOString();
  const paidAt = overrides.paidAt ?? new Date(Date.UTC(2026, 5, 18, 10, 35)).toISOString();
  const payment: PaymentSummary = {
    id: overrides.id ?? 1,
    provider: "stripe",
    status: overrides.status === "pending" ? "pending" : "paid",
    amount: subtotal,
    currency: "USD",
    processedAt: paidAt,
  };

  return {
    id: overrides.id ?? 1,
    orderNumber: overrides.orderNumber ?? "ORD-20260618-0001",
    status: overrides.status ?? "paid",
    subtotal,
    total: subtotal,
    currency: "USD",
    itemCount: items.length,
    paidAt,
    createdAt,
    items,
    payments: [payment],
  };
}

function ordersResponse(locale: MockLocale) {
  return NextResponse.json({
    data: [
      buildMockOrder(locale),
      buildMockOrder(locale, {
        id: 2,
        orderNumber: "ORD-20260612-0002",
        status: "pending",
        createdAt: new Date(Date.UTC(2026, 5, 12, 9, 20)).toISOString(),
        paidAt: null,
      }),
    ],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 2,
      lastPage: 1,
      from: 1,
      to: 2,
    },
  });
}

function libraryResponse(locale: MockLocale) {
  const courses = getMockCourses(locale);
  const books = getMockBooks(locale);

  return NextResponse.json({
    data: {
      courses: courses.slice(0, 2),
      books: books.slice(0, 2),
    },
  });
}

function bookAccessResponse(locale: MockLocale, id?: string) {
  const book = getMockBooks(locale).find((item) => String(item.id) === id || item.slug === id);

  if (!book) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      bookId: book.id,
      title: book.title,
      accessType: "signed_url",
      accessUrl: `/mock-files/books/${book.slug}.pdf?signature=mock-secure-access`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
    },
  });
}

function lessonAccessResponse(locale: MockLocale, courseId?: string, lessonId?: string) {
  const course = getMockCourses(locale).find((item) => String(item.id) === courseId || item.slug === courseId);
  const lesson = course?.sections.flatMap((section) => section.lessons).find((item) => String(item.id) === lessonId || item.slug === lessonId);

  if (!course || !lesson) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...lesson,
      courseId: course.id,
      content: locale === "ar" ? "محتوى تدريبي محمي يظهر بعد التحقق من صلاحية الشراء." : "Protected lesson content returned after purchase access verification.",
      videoUrl: "https://player.vimeo.com/video/mock-iass-lesson",
    },
  });
}

async function checkoutResponse(request: NextRequest, locale: MockLocale) {
  const body = (await request.json().catch(() => ({}))) as { items?: Array<{ type?: CheckoutItemType; id?: number }> };
  const requestedItems = body.items ?? [];

  if (requestedItems.length === 0) {
    return NextResponse.json({ message: "The items field is required.", errors: { items: ["At least one checkout item is required."] } }, { status: 422 });
  }

  const courses = getMockCourses(locale);
  const books = getMockBooks(locale);
  const items = requestedItems.map((entry, index) => {
    const source = entry.type === "course" ? courses.find((course) => course.id === entry.id) : books.find((book) => book.id === entry.id);

    if (!source || (entry.type !== "course" && entry.type !== "book")) {
      return null;
    }

    return toOrderItem(source, entry.type, index + 1);
  });

  if (items.some((item) => item === null)) {
    return NextResponse.json({ message: "Invalid checkout item." }, { status: 422 });
  }

  const safeItems = items.filter((item): item is OrderItem => item !== null);
  const total = money(safeItems.reduce((sum, item) => sum + item.price, 0));

  return NextResponse.json({
    data: {
      orderId: 99,
      orderNumber: "ORD-MOCK-000099",
      checkoutUrl: "/checkout/success?mockPayment=1",
      status: "pending",
      total,
      currency: "USD",
    },
  });
}

async function authResponse(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; name?: string };

  if (!body.email || (request.nextUrl.pathname.endsWith("/login") && !body.password)) {
    return NextResponse.json({ message: "The given data was invalid.", errors: { email: ["Email is required."], password: ["Password is required."] } }, { status: 422 });
  }

  return NextResponse.json({
    data: {
      user: {
        id: 1,
        name: body.name ?? "IASS Student",
        email: body.email,
        userType: "student",
        avatarUrl: null,
      },
      token: "mock-student-token",
    },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const [resource, slug, nestedResource, nestedId] = path;
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"));

  if (resource === "home") {
    return homeResponse(request, locale);
  }

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

  if (resource === "me") {
    return NextResponse.json({ data: { id: 1, name: "IASS Student", email: "student@example.com", userType: "student", avatarUrl: null } });
  }

  if (resource === "my" && slug === "library") {
    return libraryResponse(locale);
  }

  if (resource === "my" && slug === "orders") {
    return ordersResponse(locale);
  }

  if (resource === "my" && slug === "books" && nestedResource) {
    return bookAccessResponse(locale, nestedResource);
  }

  if (resource === "my" && slug === "courses" && nestedResource && nestedId) {
    return lessonAccessResponse(locale, nestedResource, nestedId);
  }

  return NextResponse.json({ message: "Mock endpoint not found" }, { status: 404 });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const [resource, action] = path;
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"));

  if (resource === "auth" && (action === "login" || action === "register")) {
    return authResponse(request);
  }

  if (resource === "auth" && action === "logout") {
    return NextResponse.json(null, { status: 204 });
  }

  if (resource === "checkout") {
    return checkoutResponse(request, locale);
  }

  return NextResponse.json({ message: "Mock endpoint not found" }, { status: 404 });
}