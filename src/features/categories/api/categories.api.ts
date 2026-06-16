import { apiFetch } from "@/shared/api/client";
import type { ApiEnvelope, Category, CategoryType } from "@/shared/api/types";
import type { Locale } from "@/shared/lib/types";

export async function getCategories(type: CategoryType, locale: Locale): Promise<Category[]> {
  const response = await apiFetch<ApiEnvelope<Category[]>>("/categories", {
    searchParams: {
      locale,
      "filter[type]": type,
    },
  });

  return response.data;
}
