"use client";

import { ArrowRight, BookOpen, GraduationCap, Newspaper } from "lucide-react";
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
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
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

const sectionMeta = {
  courses: {
    icon: GraduationCap,
    eyebrow: "Courses",
    glow: "from-primary/14 via-blue-500/6 to-transparent dark:from-blue-400/16 dark:via-blue-400/8",
    iconClass: "bg-primary text-white shadow-primary/25 dark:bg-blue-400 dark:text-slate-950 dark:shadow-blue-400/20",
  },
  books: {
    icon: BookOpen,
    eyebrow: "Books",
    glow: "from-secondary/14 via-emerald-400/8 to-transparent dark:from-emerald-300/16 dark:via-emerald-300/8",
    iconClass: "bg-secondary text-white shadow-secondary/25 dark:bg-emerald-300 dark:text-slate-950 dark:shadow-emerald-300/20",
  },
  articles: {
    icon: Newspaper,
    eyebrow: "Articles",
    glow: "from-sky-500/14 via-primary/6 to-transparent dark:from-sky-300/16 dark:via-blue-300/8",
    iconClass: "bg-sky-600 text-white shadow-sky-500/25 dark:bg-sky-300 dark:text-slate-950 dark:shadow-sky-300/20",
  },
} satisfies Record<"courses" | "books" | "articles", { icon: typeof GraduationCap; eyebrow: string; glow: string; iconClass: string }>;

export function HomeSection({ section, title, description, emptyState, items, ctaLabel, ctaHref, copy }: HomeSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const anchorId = section === "books" ? "books" : section === "articles" ? "articles" : "courses";
  const visibleItems = section === "courses" ? items.slice(0, 3) : items;
  const meta = sectionMeta[anchorId];
  const SectionIcon = meta.icon;

  return (
    <section id={anchorId} className="relative scroll-mt-24 py-10 sm:py-12 lg:py-16">
      <div className={`pointer-events-none absolute inset-x-0 top-6 h-40 rounded-[999px] bg-gradient-to-r ${meta.glow} blur-3xl`} />

      <motion.div
        className="relative overflow-hidden rounded-[28px] border border-slate-200/75 bg-white/82 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-5 lg:p-6"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.28 }}
        variants={headingVariants}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.075),transparent_38%,rgba(13,148,136,0.055))] dark:bg-[linear-gradient(135deg,rgba(96,165,250,0.13),transparent_38%,rgba(45,212,191,0.08))]" />
        <div className="pointer-events-none absolute -end-8 -top-10 h-32 w-32 rounded-full border border-primary/10 bg-primary/5 dark:border-white/10 dark:bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 start-10 h-28 w-28 rounded-full border border-secondary/10 bg-secondary/5 dark:border-white/10 dark:bg-white/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-3xl items-start gap-4">
            <motion.span
              className={`mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ${meta.iconClass}`}
              aria-hidden="true"
              variants={dividerVariants}
            >
              <SectionIcon className="h-5 w-5" />
            </motion.span>

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-3">
                <motion.span
                  className="h-px w-8 origin-left bg-gradient-to-r from-primary to-transparent sm:w-10"
                  variants={dividerVariants}
                  aria-hidden="true"
                />
                <span className="rounded-full border border-primary/10 bg-primary/7 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary dark:border-white/10 dark:bg-white/8 dark:text-blue-100 sm:text-xs">
                  {meta.eyebrow}
                </span>
              </div>
              <h2 className="text-[1.65rem] font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            </div>
          </div>

          <Button
            href={ctaHref}
            variant="ghost"
            size="sm"
            className="view-all-button group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-primary/12 bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,74,198,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary/92 hover:text-white hover:shadow-[0_18px_38px_rgba(0,74,198,0.24)] dark:border-white/12 dark:bg-white dark:text-slate-950 dark:shadow-[0_16px_34px_rgba(255,255,255,0.08)] dark:hover:bg-blue-50 dark:hover:text-slate-950 sm:w-auto"
          >
            <span>{ctaLabel}</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/16 text-white transition duration-300 group-hover:translate-x-0.5 group-hover:bg-white/24 dark:bg-slate-950/8 dark:text-slate-950 rtl:group-hover:-translate-x-0.5">
              <ArrowRight className="view-all-arrow h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </span>
          </Button>
        </div>
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
