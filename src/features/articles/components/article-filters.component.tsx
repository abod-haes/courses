import { Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CategoryPills } from "@/shared/components/category-pills.component";
import type { ArticlePageCopy, ArticleSort } from "../articles.types";
import { ArticleSortSelect } from "./article-sort-select.component";

type ArticleFiltersProps = Readonly<{
  copy: ArticlePageCopy;
  categories: readonly string[];
  search?: string;
  category?: string;
  sort: ArticleSort;
}>;

function buildCategoryHref(category: string | undefined, search: string | undefined, sort: ArticleSort): string {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  if (category) {
    params.set("category", category);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  const query = params.toString();
  return query ? `/articles?${query}` : "/articles";
}

export function ArticleFilters({ copy, categories, search, category, sort }: ArticleFiltersProps) {
  const sortOptions = [
    { value: "newest", label: copy.filters.newest },
    { value: "title", label: copy.filters.title },
  ] as const;

  return (
    <div className="rounded-[18px] border border-border/70 bg-surface p-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] sm:p-5">
      <form action="/articles" className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.82fr)_auto] lg:items-end">
        <label className="flex h-11 items-center gap-3 rounded-[7px] border border-border bg-surface px-4 text-sm text-foreground/60 shadow-[0_6px_18px_rgba(17,24,39,0.03)] transition duration-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-4 w-4 shrink-0 text-foreground/42" aria-hidden="true" />
          <input
            name="q"
            defaultValue={search}
            placeholder={copy.filters.searchPlaceholder}
            className="w-full bg-transparent text-[0.8rem] font-medium text-foreground outline-none placeholder:text-foreground/44"
          />
        </label>

        <ArticleSortSelect key={sort} name="sort" value={sort} label={copy.filters.sortLabel} options={sortOptions} />

        {category ? <input type="hidden" name="category" value={category} /> : null}

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button type="submit" size="sm" className="rounded-full px-4 py-2 text-xs font-bold">
            {copy.filters.apply}
          </Button>
          <Button href="/articles" variant="secondary" size="sm" className="rounded-full px-4 py-2 text-xs font-bold">
            {copy.filters.reset}
          </Button>
        </div>
      </form>

      <CategoryPills
        ariaLabel={copy.filters.categoryLabel}
        activeKey={category ?? "all"}
        items={[
          { key: "all", label: copy.filters.allCategories, href: buildCategoryHref(undefined, search, sort) },
          ...categories.map((item) => ({ key: item, label: item, href: buildCategoryHref(item, search, sort) })),
        ]}
      />
    </div>
  );
}
