import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ArticlePageCopy, ArticleSort } from "../articles.types";

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
  return (
    <div className="rounded-[18px] border border-border/70 bg-surface p-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] sm:p-5">
      <form action="/articles" className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-end">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">{copy.filters.searchLabel}</span>
          <input
            name="q"
            defaultValue={search}
            placeholder={copy.filters.searchPlaceholder}
            className="mt-2 h-11 w-full rounded-[12px] border border-border/80 bg-surface-soft px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/42 focus:border-primary/40 focus:bg-surface focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">{copy.filters.sortLabel}</span>
          <select
            name="sort"
            defaultValue={sort}
            className="mt-2 h-11 w-full rounded-[12px] border border-border/80 bg-surface-soft px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-surface focus:ring-4 focus:ring-primary/10"
          >
            <option value="newest">{copy.filters.newest}</option>
            <option value="title">{copy.filters.title}</option>
          </select>
        </label>

        {category ? <input type="hidden" name="category" value={category} /> : null}

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="sm" className="h-11 flex-1 px-5 lg:flex-none">
            {copy.filters.apply}
          </Button>
          <Button href="/articles" variant="secondary" size="sm" className="h-11 flex-1 px-5 lg:flex-none">
            {copy.filters.reset}
          </Button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2" aria-label={copy.filters.categoryLabel}>
        <Link
          href={buildCategoryHref(undefined, search, sort)}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-semibold transition",
            !category
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border/70 bg-surface-soft text-foreground/68 hover:border-primary/20 hover:text-primary",
          )}
        >
          {copy.filters.allCategories}
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            href={buildCategoryHref(item, search, sort)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition",
              category === item
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border/70 bg-surface-soft text-foreground/68 hover:border-primary/20 hover:text-primary",
            )}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
