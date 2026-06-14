import { Search } from "lucide-react";
import type { BookCategoryKey } from "../books.types";

export type BooksCategoryFilter = BookCategoryKey | "all";

export type BooksCategoryOption = Readonly<{
  key: BooksCategoryFilter;
  label: string;
}>;

type BooksToolbarProps = Readonly<{
  searchTerm: string;
  searchPlaceholder: string;
  categoryOptions: BooksCategoryOption[];
  activeCategory: BooksCategoryFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: BooksCategoryFilter) => void;
}>;

export function BooksToolbar({
  searchTerm,
  searchPlaceholder,
  categoryOptions,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: BooksToolbarProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <label className="flex h-11 w-full items-center gap-3 rounded-[7px] border border-border bg-surface px-4 text-sm text-foreground/60 shadow-[0_6px_18px_rgba(17,24,39,0.03)] transition duration-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 md:max-w-[22.5rem]">
        <Search className="h-4 w-4 shrink-0 text-foreground/42" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-[0.8rem] font-medium text-foreground outline-none placeholder:text-foreground/44"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        {categoryOptions.map((category) => {
          const isActive = activeCategory === category.key;

          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onCategoryChange(category.key)}
              className={[
                "rounded-full px-4 py-2  !leading-none font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-primary text-white shadow-[0_8px_18px_rgba(29,23,213,0.16)]"
                  : "border border-border bg-surface text-foreground/72 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
              ].join(" ")}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
