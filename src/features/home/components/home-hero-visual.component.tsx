"use client";

import Image from "next/image";
import { Activity, BookOpen, CheckCircle2, ClipboardList, FileText, HeartPulse, Sparkles } from "lucide-react";
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
    <div className="relative mx-auto max-w-[34rem] motion-safe:animate-[soft-scale_600ms_ease-out_both] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_25%_20%,rgba(29,23,213,0.18),transparent_34%),radial-gradient(circle_at_80%_78%,rgba(20,184,166,0.18),transparent_34%)] blur-2xl dark:opacity-70" />
      <div className="pointer-events-none absolute -right-5 top-16 hidden h-20 w-20 rounded-[1.6rem] border border-white/70 bg-white/68 shadow-[0_20px_55px_rgba(17,24,39,0.1)] backdrop-blur-xl motion-safe:animate-[clinical-float_7s_ease-in-out_infinite] dark:border-white/10 dark:bg-white/8 sm:block" />
      <div className="pointer-events-none absolute -left-4 bottom-24 hidden h-14 w-14 rounded-2xl border border-white/70 bg-white/74 shadow-[0_18px_42px_rgba(17,24,39,0.08)] backdrop-blur-xl motion-safe:animate-[clinical-float_6s_ease-in-out_infinite_reverse] dark:border-white/10 dark:bg-white/8 sm:block" />

      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/76 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/72 dark:shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

        <div className="relative overflow-hidden rounded-[1.8rem] border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-strong dark:border-white/10">
          <div className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl motion-safe:animate-[clinical-drift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-60 w-60 rounded-full bg-teal-300/24 blur-3xl motion-safe:animate-[clinical-float_9s_ease-in-out_infinite_reverse]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_38%,rgba(255,255,255,0.06))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

          <motion.div
            className="relative aspect-[0.96] min-h-[30rem] overflow-hidden sm:min-h-[34rem] lg:min-h-[36rem]"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              alt={copy.visual.title}
              src="/hero.jpg"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-contain object-bottom drop-shadow-[0_26px_38px_rgba(0,0,0,0.38)] transition duration-700 ease-out hover:scale-[1.015] motion-reduce:transition-none"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-950/54 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-primary-strong/20 to-transparent" />
          </motion.div>

          <motion.div
            className="absolute left-4 top-4 rounded-2xl border border-white/20 bg-white/92 px-4 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:bg-slate-950/76 sm:left-5 sm:top-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/18">
                <HeartPulse className="h-5 w-5 motion-safe:animate-[clinical-float_4s_ease-in-out_infinite]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-950 dark:text-white">{copy.visual.eyebrow}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-300">{copy.visual.title}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-4 top-[27%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/22 bg-white/88 text-primary shadow-[0_18px_44px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:bg-slate-950/70 sm:flex"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 18, scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          >
            <Sparkles className="h-5 w-5 motion-safe:animate-[clinical-float_4.8s_ease-in-out_infinite]" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/22 bg-white/92 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl dark:bg-slate-950/74 sm:bottom-5 sm:left-5 sm:right-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/18">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{copy.visual.title}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-300">{copy.visual.description}</p>
                </div>
              </div>
              <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            </div>

            <div className="relative h-11 overflow-hidden rounded-2xl border border-border/60 bg-slate-50 dark:border-white/10 dark:bg-white/5">
              <svg className="absolute inset-0 h-full w-full text-primary/85" viewBox="0 0 320 48" fill="none" aria-hidden="true">
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/58 to-transparent motion-safe:animate-[clinical-shimmer_2.7s_ease-in-out_infinite] dark:via-white/8" />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {resources.map((resource, index) => {
                const Icon = resourceIcons[index] ?? BookOpen;

                return (
                  <div key={resource} className="rounded-2xl border border-slate-200/80 bg-white/74 p-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6">
                    <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8 text-primary dark:bg-primary/18">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-slate-700 dark:text-slate-100">{resource}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
