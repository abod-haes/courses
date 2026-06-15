"use client";

import { BookOpen, Shield, Sparkles, Stethoscope } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import type { HomeMessages } from "../home.types";
import { HomeHeroVisual } from "./home-hero-visual.component";

type HomeHeroProps = Readonly<{
  copy: HomeMessages;
}>;

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const trustIcons = [Shield, Stethoscope, Sparkles] as const;

export function HomeHero({ copy }: HomeHeroProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const trustItems = copy.trustStrip.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden bg-section-bg py-14 dark:bg-[#07111f] sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.94)_0%,rgba(248,250,252,0.82)_46%,rgba(238,242,255,0.86)_100%)] dark:bg-[linear-gradient(115deg,rgba(7,17,31,0.94)_0%,rgba(8,17,29,0.82)_52%,rgba(15,23,42,0.9)_100%)]" />
        <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-primary-soft/65 blur-3xl motion-safe:animate-[clinical-float_10s_ease-in-out_infinite] dark:bg-primary-soft/22" />
        <div className="absolute bottom-[-8rem] left-[-5rem] h-80 w-80 rounded-full bg-teal-100/45 blur-3xl motion-safe:animate-[clinical-float_12s_ease-in-out_infinite_reverse] dark:bg-teal-400/8" />
        <div className="absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-white/70 blur-3xl dark:bg-white/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.1),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.07),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 lg:px-8 xl:gap-16">
        <motion.div
          className="mx-auto w-full max-w-2xl lg:mx-0"
          variants={heroContainerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/86 px-3.5 py-2 text-xs font-semibold text-primary shadow-[0_10px_28px_rgba(17,24,39,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:text-[#cdd3ff]">
            <Shield className="h-4 w-4" aria-hidden="true" />
            {copy.hero.badge}
          </motion.div>

          <motion.h1 variants={heroItemVariants} className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.08rem] lg:leading-[1.12] xl:text-[3.35rem]">
            {copy.hero.title}
          </motion.h1>

          <motion.p variants={heroItemVariants} className="mt-5 max-w-xl text-base leading-8 text-foreground/68 sm:text-lg">
            {copy.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <Button href="#courses" variant="primary" className="group shadow-[0_14px_32px_rgba(29,23,213,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(29,23,213,0.22)]">
              <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.browseCourses}
            </Button>
            <Button href="#books" variant="secondary" className="group bg-white/82 hover:-translate-y-0.5 dark:bg-white/8">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.exploreBooks}
            </Button>
          </motion.div>

          {trustItems.length > 0 ? (
            <motion.div variants={heroItemVariants} className="mt-7 grid gap-3 sm:grid-cols-3">
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index] ?? Shield;

                return (
                  <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/66 px-3 py-2.5 text-sm font-medium text-foreground/72 shadow-[0_10px_26px_rgba(17,24,39,0.04)] backdrop-blur dark:border-white/10 dark:bg-white/6 dark:text-slate-200">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary dark:bg-primary/18 dark:text-[#cdd3ff]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="line-clamp-2">{item}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-[35rem] lg:mx-0 lg:max-w-none"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <HomeHeroVisual copy={copy} />
        </motion.div>
      </div>
    </section>
  );
}
