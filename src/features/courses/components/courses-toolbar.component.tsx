import { Search } from "lucide-react";
import type { CourseCategoryKey } from "../courses.types";
import { CategoryPills } from "@/shared/components/category-pills.component";

export type CoursesCategoryFilter = CourseCategoryKey | "all";

export type CoursesCategoryOption = Readonly<{
  key: CoursesCategoryFilter;
  label: string;
}>;

type CoursesToolbarProps = Readonly<{
  searchTerm: string;
  searchPlaceholder: string;
  categoryOptions: CoursesCategoryOption[];
  activeCategory: CoursesCategoryFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: CoursesCategoryFilter) => void;
}>;

export function CoursesToolbar({
  searchTerm,
  searchPlaceholder,
  categoryOptions,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: CoursesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <label className="flex h-11 w-full items-center gap-3 rounded-[7px] border border-border bg-surface px-4 text-sm text-foreground/60 shadow-[0_6px_18px_rgba(17,24,39,0.03)] transition duration-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 md:max-w-[25rem]">
        <Search className="h-4 w-4 shrink-0 text-foreground/42" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-[0.8rem] font-medium text-foreground outline-none placeholder:text-foreground/44"
        />
      </label>

      <CategoryPills
        activeKey={activeCategory}
        onSelect={(key) => onCategoryChange(key as CoursesCategoryFilter)}
        items={categoryOptions.map((category) => ({ key: category.key, label: category.label }))}
      />
    </div>
  );
}
