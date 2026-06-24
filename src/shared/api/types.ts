export type CategoryType = "course" | "book" | "article";
export type ContentStatus = "draft" | "published" | "hidden";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "expired";
export type CheckoutItemType = "course" | "book";

export type ApiEnvelope<T> = Readonly<{
  data: T;
}>;

export type PaginationMeta = Readonly<{
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  from: number | null;
  to: number | null;
}>;

export type PaginatedEnvelope<T> = Readonly<{
  data: T[];
  meta: PaginationMeta;
}>;

export type Category = Readonly<{
  id: number;
  type: CategoryType;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}>;

export type Media = Readonly<{
  id: number;
  url: string;
  alt: string;
}>;

export type LessonPublic = Readonly<{
  id: number;
  title: string;
  slug: string;
  summary: string;
  isPreview?: boolean;
  durationMinutes: number;
  sortOrder: number;
  status?: ContentStatus;
}>;

export type CourseSection = Readonly<{
  id: number;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: LessonPublic[];
}>;

export type Course = Readonly<{
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  price: number;
  currency: string;
  category: Pick<Category, "id" | "name" | "slug" | "type">;
  thumbnail: Media | null;
  status?: ContentStatus;
  publishedAt: string | null;
  sections?: CourseSection[];
}>;

export type Book = Readonly<{
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  price: number;
  currency: string;
  category: Pick<Category, "id" | "name" | "slug" | "type">;
  cover: Media | null;
  hasProtectedFile: boolean;
  status?: ContentStatus;
  publishedAt: string | null;
  isbn?: string;
}>;

export type Article = Readonly<{
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body?: string;
  category: Pick<Category, "id" | "name" | "slug" | "type">;
  image: Media | null;
  status?: ContentStatus;
  publishedAt: string | null;
  author?: string;
}>;

export type User = Readonly<{
  id: number;
  name: string;
  email: string;
  userType: "student" | "admin";
  avatarUrl: string | null;
}>;

export type OrderItem = Readonly<{
  id: number;
  type: CheckoutItemType;
  itemId: number;
  title: string;
  price: number;
  currency: string;
}>;

export type PaymentSummary = Readonly<{
  id: number;
  provider: "stripe";
  status: string;
  amount: number;
  currency: string;
  processedAt: string | null;
}>;

export type Order = Readonly<{
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  currency: string;
  itemCount: number;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
  payments: PaymentSummary[];
}>;

export type CheckoutRequestBody = Readonly<{
  items?: Array<{
    type?: CheckoutItemType;
    id?: number;
  }>;
}>;

export type CatalogListParams = Readonly<{
  locale?: "ar" | "en";
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  sort?: string;
}>;
