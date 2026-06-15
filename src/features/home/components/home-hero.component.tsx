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
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.66, ease: [0.22, 1, 0.36, 1] },
  },
};

const trustIcons = [Shield, Stethoscope, Sparkles] as const;

export function HomeHero({ copy }: HomeHeroProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const trustItems = copy.trustStrip.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden bg-section-bg py-12 dark:bg-[#07111f] sm:py-14 lg:min-h-[calc(100dvh-5.5rem)] lg:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.9)_42%,rgba(238,242,255,0.92)_100%)] dark:bg-[linear-gradient(118deg,rgba(7,17,31,0.98)_0%,rgba(8,17,29,0.9)_52%,rgba(15,23,42,0.94)_100%)]" />
        <div className="absolute -top-28 right-[-7rem] h-96 w-96 rounded-full bg-primary-soft/70 blur-3xl motion-safe:animate-[clinical-float_11s_ease-in-out_infinite] dark:bg-primary-soft/24" />
        <div className="absolute bottom-[-9rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full bg-teal-100/55 blur-3xl motion-safe:animate-[clinical-float_13s_ease-in-out_infinite_reverse] dark:bg-teal-400/10" />
        <div className="absolute left-[42%] top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-white/78 blur-3xl dark:bg-white/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.13),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[inherit] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-8 xl:gap-16">
        <motion.div
          className="mx-auto w-full max-w-2xl lg:mx-0"
          variants={heroContainerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/88 px-3.5 py-2 text-xs font-semibold text-primary shadow-[0_10px_28px_rgba(17,24,39,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:text-[#cdd3ff]">
            <Shield className="h-4 w-4" aria-hidden="true" />
            {copy.hero.badge}
          </motion.div>

          <motion.h1 variants={heroItemVariants} className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08] xl:text-[3.8rem]">
            {copy.hero.title}
          </motion.h1>

          <motion.p variants={heroItemVariants} className="mt-5 max-w-xl text-base leading-8 text-foreground/66 sm:text-lg">
            {copy.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Button href="#courses" variant="primary" className="group rounded-2xl px-6 shadow-[0_16px_36px_rgba(29,23,213,0.22)] hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,23,213,0.28)]">
              <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.browseCourses}
            </Button>
            <Button href="#books" variant="secondary" className="group rounded-2xl border-primary/18 bg-white/84 px-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-primary/28 hover:bg-white dark:bg-white/8">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.exploreBooks}
            </Button>
          </motion.div>

          {trustItems.length > 0 ? (
            <motion.div variants={heroItemVariants} className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index] ?? Shield;

                return (
                  <motion.div
                    key={item}
                    className="group flex items-center gap-2 rounded-2xl border border-white/76 bg-white/68 px-3 py-2.5 text-sm font-medium text-foreground/72 shadow-[0_10px_26px_rgba(17,24,39,0.045)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/18 hover:bg-white/88 hover:shadow-[0_16px_34px_rgba(17,24,39,0.07)] dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
                    whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary transition duration-300 group-hover:scale-110 dark:bg-primary/18 dark:text-[#cdd3ff]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="line-clamp-2">{item}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-[36rem] lg:mx-0 lg:max-w-none"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 26, scale: 0.97, filter: "blur(10px)" }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <HomeHeroVisual copy={copy} />
        </motion.div>
      </div>
    </section>
  );
}
