"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

const dividerVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
  },
};

export function HomeSection({ section, title, description, emptyState, items, ctaLabel, ctaHref, copy }: HomeSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const anchorId = section === "books" ? "books" : section === "articles" ? "articles" : "courses";
  const visibleItems = section === "courses" ? items.slice(0, 3) : items;

  return (
    <section id={anchorId} className="relative scroll-mt-24 py-10 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-8 hidden h-32 bg-[radial-gradient(circle_at_center,rgba(29,23,213,0.06),transparent_62%)] lg:block dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_62%)]" />

      <motion.div
        className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.28 }}
        variants={headingVariants}
      >
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <motion.span
              className="h-px w-9 origin-left bg-gradient-to-r from-primary to-transparent sm:w-10"
              variants={dividerVariants}
              aria-hidden="true"
            />
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/80 sm:text-xs">{anchorId}</span>
          </div>
          <h2 className="text-[1.65rem] font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/70 sm:text-base">{description}</p>
        </div>

        <Button
          href={ctaHref}
          variant="ghost"
          size="sm"
          className="view-all-button group inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-border/60 bg-white px-4 py-2.5 text-sm font-medium text-primary shadow-[0_6px_16px_rgba(17,24,39,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary-strong hover:shadow-[0_10px_24px_rgba(29,23,213,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:text-[#cdd3ff] dark:shadow-[0_10px_22px_rgba(0,0,0,0.18)] dark:hover:border-primary/30 dark:hover:bg-primary/12 dark:hover:text-white dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.26)] sm:w-auto"
        >
          {ctaLabel}
          <ArrowRight className="view-all-arrow h-4 w-4 transition duration-200 group-hover:translate-x-1 group-hover:text-primary-strong dark:group-hover:text-white rtl:rotate-180" aria-hidden="true" />
        </Button>
      </motion.div>

      {visibleItems.length > 0 ? (
        <StaggerList className="relative mt-7 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <div key={item.title} className="h-full min-w-0">
              <HomeCard item={item} section={section} copy={copy} />
            </div>
          ))}
        </StaggerList>
      ) : (
        <Reveal preset="fadeUp" className="mt-8 rounded-[14px] border border-border bg-surface p-6 text-sm leading-6 text-foreground/70 shadow-[0_4px_12px_rgba(17,24,39,0.06)] sm:p-8">
          {emptyState}
        </Reveal>
      )}
    </section>
  );
}
