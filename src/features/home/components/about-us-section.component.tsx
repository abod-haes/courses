"use client";

import { BookOpen, ClipboardList, ShieldCheck, Users2 } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { HomeMessages } from "../home.types";

type AboutUsSectionProps = Readonly<{
  copy: HomeMessages;
}>;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutUsSection({ copy }: AboutUsSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const about = copy.aboutUs;
  const highlightIcons = [ShieldCheck, Users2, BookOpen];

  return (
    <section id="about-us" className="overflow-hidden bg-section-bg py-14 sm:py-18 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-[32px] border border-border/70 bg-surface p-5 shadow-[0_16px_44px_rgba(17,24,39,0.05)] dark:border-white/10 dark:bg-slate-900/72 dark:shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:p-6 lg:p-8"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={containerVariants}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-primary/30" />
          <div className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full bg-primary/8 blur-3xl dark:bg-primary/16" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-primary/6 blur-3xl dark:bg-slate-50/5" />

          <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary dark:text-[#a9b0ff]">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              {about.label}
            </motion.div>

            <motion.h2 variants={itemVariants} className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.8rem] dark:text-slate-50">
              {about.title}
            </motion.h2>

            <motion.p variants={itemVariants} className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              {about.subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 grid w-full gap-3 sm:grid-cols-3">
              {about.highlights.map((item, index) => {
                const Icon = highlightIcons[index] ?? BookOpen;

                return (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-border/70 bg-white p-4 text-start shadow-[0_8px_22px_rgba(17,24,39,0.04)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/15">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
