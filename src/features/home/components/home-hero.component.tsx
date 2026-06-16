"use client";

import Image from "next/image";
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
    <section className="relative isolate overflow-hidden bg-section-bg px-0 py-8 dark:bg-[#07111f] sm:py-12 lg:min-h-[70vh] lg:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.9)_42%,rgba(238,242,255,0.92)_100%)] dark:bg-[linear-gradient(118deg,rgba(7,17,31,0.98)_0%,rgba(8,17,29,0.9)_52%,rgba(15,23,42,0.94)_100%)]" />

        <motion.div
          className="absolute inset-x-0 bottom-[-4rem] top-24 opacity-[0.09] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen sm:bottom-[-6rem] sm:top-16 lg:inset-y-[-2rem] lg:left-auto lg:right-[-5vw] lg:w-[62vw] lg:max-w-[58rem] lg:opacity-[0.16] xl:right-[-2vw]"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.06, x: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <Image
            alt=""
            src="/images/hero-blue.png"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 62vw"
            className="object-contain object-bottom lg:object-right-bottom"
            aria-hidden="true"
          />
        </motion.div>

        <div className="absolute -top-28 right-[-10rem] h-80 w-80 rounded-full bg-primary-soft/70 blur-3xl motion-safe:animate-[clinical-float_11s_ease-in-out_infinite] dark:bg-primary-soft/24 sm:right-[-7rem] sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-10rem] left-[-9rem] h-[22rem] w-[22rem] rounded-full bg-teal-100/55 blur-3xl motion-safe:animate-[clinical-float_13s_ease-in-out_infinite_reverse] dark:bg-teal-400/10 sm:left-[-6rem] sm:h-[26rem] sm:w-[26rem]" />
        <div className="absolute left-[42%] top-12 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-white/78 blur-3xl dark:bg-white/5 sm:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.13),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[inherit] max-w-7xl items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:gap-16">
        <motion.div
          className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-start"
          variants={heroContainerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          <motion.div variants={heroItemVariants} className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/12 bg-white/88 px-3.5 py-2 text-xs font-semibold text-primary shadow-[0_10px_28px_rgba(17,24,39,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:text-[#cdd3ff]">
            <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{copy.hero.badge}</span>
          </motion.div>

          <motion.h1 variants={heroItemVariants} className="mx-auto mt-5 max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.045em] text-foreground sm:text-5xl lg:mx-0 lg:text-[3rem] xl:text-[3.2rem]">
            {copy.hero.title}
          </motion.h1>

          <motion.p variants={heroItemVariants} className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-7 text-foreground/66 sm:text-lg sm:leading-8 lg:mx-0">
            {copy.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-7 grid gap-3 max-sm:px-3 sm:mx-auto sm:max-w-md grid-cols-2 lg:mx-0 lg:max-w-none lg:flex lg:flex-wrap lg:gap-4">
            <Button href="#courses" variant="primary" className="group w-full rounded-2xl px-5 shadow-[0_16px_36px_rgba(29,23,213,0.22)] hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,23,213,0.28)] sm:w-auto">
              <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.browseCourses}
            </Button>
            <Button href="#books" variant="secondary" className="group w-full rounded-2xl border-primary/18 bg-white/84 px-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-primary/28 hover:bg-white dark:bg-white/8 sm:w-auto">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.exploreBooks}
            </Button>
          </motion.div>

          {trustItems.length > 0 ? (
            <motion.div variants={heroItemVariants} className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-3 max-sm:hidden lg:mx-0">
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index] ?? Shield;

                return (
                  <motion.div
                    key={item}
                    className="group flex items-center gap-2 rounded-2xl border border-white/76 bg-white/68 px-3 py-2.5 text-start text-sm font-medium text-foreground/72 shadow-[0_10px_26px_rgba(17,24,39,0.045)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/18 hover:bg-white/88 hover:shadow-[0_16px_34px_rgba(17,24,39,0.07)] dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
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
          className="mx-auto w-full max-w-[32rem] lg:mx-0 lg:max-w-none"
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
