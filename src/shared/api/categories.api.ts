import { apiFetch } from "./client";
import type { Category, CategoryType } from "./types";

export type CatalogCategoryOption = Readonly<{
  key: string;
  label: string;
}>;

type CategoriesResponse = Readonly<{
  data?: Category[];
}> | Category[];

function getCategoriesPayload(response: CategoriesResponse): Category[] {
  return Array.isArray(response) ? response : response.data ?? [];
}

export async function getCatalogCategoryOptions(
  type: CategoryType,
  locale: "ar" | "en",
  allLabel: string,
): Promise<CatalogCategoryOption[]> {
  const response = await apiFetch<CategoriesResponse>("/categories", {
    searchParams: {
      locale,
      "filter[type]": type,
      "filter[isActive]": true,
    },
  });

  const categories = getCategoriesPayload(response)
    .filter((category) => category.isActive !== false && category.type === type)
    .map((category) => ({ key: category.slug, label: category.name }));

  return [{ key: "all", label: allLabel }, ...categories];
}
