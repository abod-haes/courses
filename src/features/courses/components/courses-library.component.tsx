"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import type { CourseCategoryKey, CourseItemView, CoursesPageCopy } from "../courses.types";
import { CourseTileView } from "./course-tile-view.component";
import { CoursesHero } from "./courses-hero.component";
import { CoursesToolbar, type CoursesCategoryFilter, type CoursesCategoryOption } from "./courses-toolbar.component";

const filterOrder: CourseCategoryKey[] = ["cardiology", "neurology", "pediatrics", "surgery", "pharmacology", "emergency"];

type CoursesLibraryProps = Readonly<{
  copy: CoursesPageCopy;
  courses: CourseItemView[];
}>;

export function CoursesLibrary({ copy, courses }: CoursesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<CoursesCategoryFilter>("all");

  const categoryOptions = useMemo<CoursesCategoryOption[]>(() => {
    const categoryLabels = new Map<CourseCategoryKey, string>();

    courses.forEach((course) => {
      categoryLabels.set(course.categoryKey, course.category);
    });

    return [
      { key: "all", label: copy.filters.all },
      ...filterOrder
        .filter((category) => categoryLabels.has(category))
        .map((category) => ({ key: category, label: categoryLabels.get(category) ?? category })),
    ];
  }, [copy.filters.all, courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory = activeCategory === "all" || course.categoryKey === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [course.title, course.instructor, course.category, course.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, courses, searchTerm]);

  return (
    <div className="min-h-full bg-section-bg">
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <CoursesHero copy={copy} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <CoursesToolbar
          searchTerm={searchTerm}
          searchPlaceholder={copy.searchPlaceholder}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
        />

        {filteredCourses.length > 0 ? (
          <StaggerList className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseTileView key={course.id} course={course} viewDetailsLabel={copy.labels.viewDetails} />
            ))}
          </StaggerList>
        ) : (
          <div className="mt-8 rounded-[12px] border border-dashed border-border bg-surface p-10 text-center shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
            <h2 className="text-lg font-black text-foreground">{copy.labels.noResultsTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
              {copy.labels.noResultsDescription}
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] border border-primary px-9 py-3 text-sm font-bold text-primary transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white"
          >
            {copy.labels.loadMore}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
