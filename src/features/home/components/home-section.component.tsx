import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Reveal } from "@/shared/components/animation/reveal.component";
import { StaggerList } from "@/shared/components/animation/stagger-list.component";
import type { HomeCatalogItem, HomeMessages, HomeSectionKey } from "../home.types";
import { HomeCard } from "./home-card.component";

type HomeSectionProps = Readonly<{
  section: HomeSectionKey;
  title: string;
  description: string;
  emptyState: string;
  items: HomeCatalogItem[];
  ctaLabel: string;
  ctaHref: string;
  copy: HomeMessages;
}>;

export function HomeSection({ section, title, description, emptyState, items, ctaLabel, ctaHref, copy }: HomeSectionProps) {
  const anchorId = section === "books" ? "books" : section === "articles" ? "articles" : "courses";
  const visibleItems = section === "courses" ? items.slice(0, 3) : items;

  return (
    <section id={anchorId} className="scroll-mt-24 py-12 lg:py-16">
      <Reveal preset="fadeUp" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 text-base leading-7 text-foreground/70">{description}</p>
        </div>

        <Button
          href={ctaHref}
          variant="ghost"
          size="sm"
          className="view-all-button group inline-flex items-center gap-2 rounded-[10px] border border-border/60 bg-white px-4 py-2.5 text-sm font-medium text-primary shadow-[0_6px_16px_rgba(17,24,39,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary-strong hover:shadow-[0_10px_24px_rgba(29,23,213,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:text-[#cdd3ff] dark:shadow-[0_10px_22px_rgba(0,0,0,0.18)] dark:hover:border-primary/30 dark:hover:bg-primary/12 dark:hover:text-white dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.26)]"
        >
          {ctaLabel}
          <ArrowRight className="view-all-arrow h-4 w-4 transition duration-200 group-hover:translate-x-1 group-hover:text-primary-strong dark:group-hover:text-white rtl:rotate-180" aria-hidden="true" />
        </Button>
      </Reveal>

      {visibleItems.length > 0 ? (
        <StaggerList className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <div key={item.title} className="h-full">
              <HomeCard item={item} section={section} copy={copy} />
            </div>
          ))}
        </StaggerList>
      ) : (
        <Reveal preset="fadeUp" className="mt-8 rounded-[14px] border border-border bg-surface p-8 text-sm leading-6 text-foreground/70 shadow-[0_4px_12px_rgba(17,24,39,0.06)]">
          {emptyState}
        </Reveal>
      )}
    </section>
  );
}
