import { apiFetch, describeApiError } from "./client";
import type { Category, CategoryType } from "./types";

export type CatalogCategoryOption = Readonly<{
  key: string;
  label: string;
}>;

type RawCategory = Partial<Category> &
  Readonly<{
    is_active?: boolean | number | string;
    category_type?: string;
    title?: string;
  }>;

type CategoriesResponse =
  | Readonly<{ data?: RawCategory[] | Readonly<{ data?: RawCategory[] }> }>
  | RawCategory[];

function arrayFromPayload(value: unknown): RawCategory[] {
  if (Array.isArray(value)) return value as RawCategory[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as RawCategory[];

    if (record.data && typeof record.data === "object") {
      const nested = record.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as RawCategory[];
    }
  }

  return [];
}

function normalizeType(value: unknown): CategoryType | null {
  if (value === "course" || value === "courses") return "course";
  if (value === "book" || value === "books") return "book";
  if (value === "article" || value === "articles") return "article";
  return null;
}

function readLocalized(value: unknown, locale: "ar" | "en"): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const record = value as Record<string, unknown>;
  const first = record[locale];
  const second = record.en;
  const third = record.ar;
  return readLocalized(first, locale) || readLocalized(second, "en") || readLocalized(third, "ar");
}

function getCategoryLabel(category: RawCategory, locale: "ar" | "en"): string {
  return readLocalized(category.name ?? category.title, locale) || String(category.name ?? category.title ?? "").trim();
}

function getCategoryKey(category: RawCategory): string {
  return String(category.id ?? category.slug ?? getCategoryLabel(category, "en")).trim();
}

export async function getCatalogCategoryOptions(
  type: CategoryType,
  locale: "ar" | "en",
  allLabel: string,
): Promise<CatalogCategoryOption[]> {
  try {
    const response = await apiFetch<CategoriesResponse>("/categories", {
      searchParams: {
        locale,
        "filter[type]": type,
      },
    });

    const categories = arrayFromPayload(response)
      .filter((category) => normalizeType(category.type ?? category.category_type) === type)
      .map((category) => ({ key: getCategoryKey(category), label: getCategoryLabel(category, locale) }))
      .filter((category) => category.key && category.label);

    return [{ key: "all", label: allLabel }, ...categories];
  } catch (error) {
    console.error("[categories-api] failed to load category options from backend", { type, error: describeApiError(error) });
    return [{ key: "all", label: allLabel }];
  }
}
