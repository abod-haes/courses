"use client";

import { Activity, BookOpen, CheckCircle2, ClipboardList, FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { HomeMessages } from "../home.types";

type HomeHeroVisualProps = Readonly<{
  copy: HomeMessages;
}>;

const resourceIcons = [BookOpen, ClipboardList, FileText] as const;

export function HomeHeroVisual({ copy }: HomeHeroVisualProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const resources = [copy.visual.resources.courses, copy.visual.resources.books, copy.visual.resources.articles];

  return (
    <div className="relative mx-auto max-w-[35rem] motion-safe:animate-[soft-scale_600ms_ease-out_both] lg:max-w-none">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-primary/12 via-white/70 to-teal-100/50 blur-2xl dark:from-primary/18 dark:via-slate-900/30 dark:to-teal-400/10" />
      <div className="absolute -right-4 top-10 hidden h-16 w-16 rounded-3xl border border-white/70 bg-white/70 shadow-[0_20px_50px_rgba(17,24,39,0.08)] backdrop-blur-md motion-safe:animate-[clinical-float_7s_ease-in-out_infinite] dark:border-white/10 dark:bg-white/8 sm:block" />
      <div className="absolute -left-3 bottom-16 hidden h-12 w-12 rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_42px_rgba(17,24,39,0.08)] backdrop-blur-md motion-safe:animate-[clinical-float_6s_ease-in-out_infinite_reverse] dark:border-white/10 dark:bg-white/8 sm:block" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/78 p-3 shadow-[0_24px_70px_rgba(17,24,39,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/72 dark:shadow-[0_28px_80px_rgba(0,0,0,0.36)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative overflow-hidden rounded-[1.6rem] border border-border/60 bg-gradient-to-br from-white via-slate-50 to-primary-soft/60 p-4 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-primary/16 sm:p-5">
          <div className="pointer-events-none absolute -top-20 right-4 h-56 w-56 rounded-full bg-primary/12 blur-3xl motion-safe:animate-[clinical-drift_12s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-teal-200/30 blur-3xl motion-safe:animate-[clinical-float_9s_ease-in-out_infinite_reverse] dark:bg-teal-400/10" />

          <motion.div
            className="relative rounded-3xl border border-white/80 bg-white/82 p-4 shadow-[0_18px_44px_rgba(17,24,39,0.1)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/64 sm:p-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-primary">{copy.visual.eyebrow}</p>
                  <p className="mt-1 text-base font-bold text-slate-950 dark:text-white">{copy.visual.title}</p>
                </div>
              </div>
              <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">{copy.visual.description}</p>

            <div className="relative mt-5 h-12 overflow-hidden rounded-2xl border border-border/60 bg-slate-50 dark:border-white/10 dark:bg-white/5">
              <svg className="absolute inset-0 h-full w-full text-primary/80" viewBox="0 0 320 48" fill="none" aria-hidden="true">
                <path
                  className="motion-safe:animate-[ecg-draw_2.8s_ease-in-out_infinite]"
                  d="M0 26H56L68 26L78 12L90 36L104 26H144L158 26L170 17L182 32L198 26H320"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="390"
                  strokeDashoffset="390"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent motion-safe:animate-[clinical-shimmer_2.7s_ease-in-out_infinite] dark:via-white/8" />
            </div>
          </motion.div>

          <motion.div
            className="relative mt-4 grid gap-3 sm:grid-cols-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay: 0.62 }}
          >
            {resources.map((resource, index) => {
              const Icon = resourceIcons[index] ?? BookOpen;

              return (
                <div key={resource} className="rounded-2xl border border-white/80 bg-white/78 p-3 shadow-[0_10px_30px_rgba(17,24,39,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/6">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 text-primary dark:bg-primary/18">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-100">{resource}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
