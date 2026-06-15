"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, BookOpen, FileText, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { HomeCatalogItem, HomeMessages, HomeSectionKey } from "../home.types";

type HomeCardProps = Readonly<{
  item: HomeCatalogItem;
  section: HomeSectionKey;
  copy: HomeMessages;
}>;

const sectionAccents: Record<HomeSectionKey, string> = {
  courses: "from-primary/10 via-transparent to-transparent",
  books: "from-sky-100/80 via-transparent to-transparent dark:from-primary/18",
  articles: "from-teal-100/70 via-transparent to-transparent dark:from-teal-400/10",
};

const sectionIconMap = {
  courses: GraduationCap,
  books: BookOpen,
  articles: FileText,
} as const;

export function HomeCard({ item, section, copy }: HomeCardProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const actionLabel =
    section === "articles" ? copy.actions.readArticle : section === "books" ? copy.actions.viewDetails : copy.actions.startCourse;
  const Icon = sectionIconMap[section];

  return (
    <motion.div
      className="h-full"
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-border/70 bg-white/94 shadow-[0_14px_34px_rgba(17,24,39,0.05)] backdrop-blur-sm transition duration-300 ease-out hover:border-primary/16 hover:shadow-[0_22px_54px_rgba(17,24,39,0.09)] dark:border-white/10 dark:bg-slate-900/78 dark:shadow-[0_18px_44px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/7 blur-3xl transition duration-500 group-hover:scale-110 group-hover:bg-primary/10 dark:bg-primary/12" />

        <div className="p-4 pb-0">
          <div className="relative overflow-hidden rounded-[14px] border border-border/60 bg-surface-soft dark:border-white/10">
            <div className={`absolute inset-0 bg-gradient-to-br ${sectionAccents[section]}`} />
            <img
              alt={item.alt}
              src={item.image}
              className="relative h-[180px] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none sm:h-[200px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition duration-700 group-hover:left-full group-hover:opacity-100 motion-reduce:hidden" />

            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-white/82 text-primary shadow-[0_10px_24px_rgba(17,24,39,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-950/62">
              <Icon className="h-4 w-4 transition duration-300 group-hover:scale-110" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <div className="min-w-0">
            <h3 className="text-[1.02rem] font-semibold leading-7 tracking-tight text-foreground transition duration-200 group-hover:text-primary sm:text-[1.05rem]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/70">{item.description ?? item.author}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[8px] border border-border/60 bg-surface-soft px-3 py-1 text-[11px] font-medium text-foreground/68 dark:border-white/10 dark:bg-white/5">
              {item.author}
            </span>
            {item.modules > 0 ? (
              <span className="inline-flex items-center rounded-[8px] border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary dark:bg-primary/12">
                {item.modules} {copy.cards.modulesLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-5">
            <Button href={item.href} variant="primary" size="sm" className="group/button w-full">
              {actionLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 rtl:rotate-[-90deg]" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
