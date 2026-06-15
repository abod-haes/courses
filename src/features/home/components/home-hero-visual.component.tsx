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
      <div className="relative overflow-visible rounded-[2.5rem] border border-white/80 bg-white/30 p-2 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
        <motion.div
          className="relative aspect-[0.96] min-h-[30rem] overflow-hidden rounded-[2.1rem] bg-transparent sm:min-h-[34rem] lg:min-h-[36rem]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            alt={copy.visual.title}
            src="/hero.jpg"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 42vw"
            className="relative z-10 object-contain object-bottom drop-shadow-[0_24px_34px_rgba(15,23,42,0.22)] transition duration-700 ease-out hover:scale-[1.01] motion-reduce:transition-none"
          />
        </motion.div>

        <motion.div
          className="absolute left-4 top-4 z-30 rounded-2xl border border-white/70 bg-white/94 px-4 py-3 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 sm:left-5 sm:top-5"
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
          className="absolute right-4 top-[27%] z-30 hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/92 text-primary shadow-[0_18px_44px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/78 sm:flex"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 18, scale: 0.9 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
        >
          <Sparkles className="h-5 w-5 motion-safe:animate-[clinical-float_4.8s_ease-in-out_infinite]" aria-hidden="true" />
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-4 right-4 z-30 rounded-[1.35rem] border border-white/70 bg-white/94 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 sm:bottom-5 sm:left-5 sm:right-5"
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
                <div key={resource} className="rounded-2xl border border-slate-200/80 bg-white/76 p-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6">
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
  );
}
