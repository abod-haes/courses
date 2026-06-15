"use client";

/* eslint-disable @next/next/no-img-element */
import { Activity, BookOpen, CheckCircle2, ClipboardList } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";

export function HomeHeroVisual() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <div className="relative motion-safe:animate-[soft-scale_600ms_ease-out_both]">
      <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-primary/10 via-white/60 to-sky-100/70 blur-2xl dark:from-primary/18 dark:via-slate-900/30 dark:to-sky-400/10" />

      <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/78 p-3 shadow-[0_24px_70px_rgba(17,24,39,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/72 dark:shadow-[0_28px_80px_rgba(0,0,0,0.36)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-border/60 bg-surface-soft dark:border-white/10 dark:bg-slate-900">
          <img
            alt={isArabic ? "أطباء يحللون بيانات طبية" : "Medical professionals analyzing data"}
            className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-700 ease-out hover:scale-[1.015] dark:opacity-85 motion-reduce:transition-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLTwJn4aKK7om-xLrz5oHU1etm2aYmUVN4FATefb9KpuFO0kmIcaTs7yP-qPudbK4u45qNoIPvP9ZlwBlGYK_BAeA7nEyP8iKYfr08U_qZHSo8okduMTfwtBBk9RIIU1_BZg9jx1q3Tbvqr2dbe35MQSPBnuwR6XOgq08aRUeL9WQtLXDE92HP0JC9y3ByKbo6SmLVbQnqvvzINBg14lrUa4bQ5W8Hg9v7eSH9ukBF_pTPYGz0Lw_S1O-cxjsC0ZDXwo52Gq5uVIY"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-950/7 to-transparent dark:from-slate-950/58 dark:via-slate-950/22" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/16 to-transparent" />

          <motion.div
            className="absolute left-4 top-4 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-[0_14px_36px_rgba(17,24,39,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/18">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </span>
              {isArabic ? "تعلم طبي منظّم" : "Structured medical learning"}
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 right-4 w-[min(78%,21rem)] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_18px_44px_rgba(17,24,39,0.14)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/72"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/18">
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-950 dark:text-slate-50">{isArabic ? "محتوى موثوق" : "Trusted resources"}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300">{isArabic ? "كورسات • كتب • مقالات" : "Courses • Books • Articles"}</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            <div className="relative h-10 overflow-hidden rounded-xl border border-border/60 bg-slate-50 dark:border-white/10 dark:bg-white/5">
              <svg className="absolute inset-0 h-full w-full text-primary/80" viewBox="0 0 280 40" fill="none" aria-hidden="true">
                <path
                  className="motion-safe:animate-[ecg-draw_2.8s_ease-in-out_infinite]"
                  d="M0 22H48L58 22L66 10L76 30L88 22H124L136 22L146 14L156 27L170 22H280"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="360"
                  strokeDashoffset="360"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent motion-safe:animate-[clinical-shimmer_2.7s_ease-in-out_infinite] dark:via-white/8" />
            </div>
          </motion.div>

          <motion.div
            className="absolute right-6 top-[38%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/65 bg-white/82 text-primary shadow-[0_16px_38px_rgba(17,24,39,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-slate-950/68 sm:flex"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 16, scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          >
            <BookOpen className="h-5 w-5 motion-safe:animate-[clinical-float_4.8s_ease-in-out_infinite]" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
