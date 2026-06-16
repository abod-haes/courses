"use client";

import Image from "next/image";
import { BookOpen, Shield, Sparkles, Stethoscope } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SiteContainer } from "@/shared/components/layout/site-container";
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
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

const trustIcons = [Shield, Stethoscope, Sparkles] as const;

export function HomeHero({ copy }: HomeHeroProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const trustItems = copy.trustStrip.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden bg-section-bg px-0 py-4 dark:bg-[#07111f] sm:py-5 lg:min-h-[calc(100dvh-4.25rem)] lg:py-4 xl:min-h-[calc(100dvh-4.75rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.58] saturate-[1.08] dark:opacity-[0.26]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.82)_0%,rgba(248,250,252,0.58)_42%,rgba(238,242,255,0.64)_100%)] dark:bg-[linear-gradient(118deg,rgba(7,17,31,0.9)_0%,rgba(8,17,29,0.78)_52%,rgba(15,23,42,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_top_right,rgba(29,23,213,0.1),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_32%)] dark:bg-[radial-gradient(circle_at_78%_42%,rgba(15,23,42,0.1),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_30%)]" />
        <div className="absolute -top-28 right-[-10rem] h-80 w-80 rounded-full bg-primary-soft/50 blur-3xl motion-safe:animate-[clinical-float_11s_ease-in-out_infinite] dark:bg-primary-soft/20 sm:right-[-7rem] sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-10rem] left-[-9rem] h-[22rem] w-[22rem] rounded-full bg-teal-100/42 blur-3xl motion-safe:animate-[clinical-float_13s_ease-in-out_infinite_reverse] dark:bg-teal-400/10 sm:left-[-6rem] sm:h-[26rem] sm:w-[26rem]" />
        <div className="absolute left-[42%] top-12 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-white/52 blur-3xl dark:bg-white/5 sm:block" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <SiteContainer className="relative z-10 grid min-h-[inherit] items-center gap-4 md:gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6 xl:gap-7">
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

          <motion.h1 variants={heroItemVariants} className="mx-auto mt-3.5 max-w-2xl text-[1.62rem] font-black leading-[1.12] tracking-[-0.04em] text-foreground sm:text-[1.95rem] lg:mx-0 lg:text-[2.1rem] xl:text-[2.28rem]">
            {copy.hero.title}
          </motion.h1>

          <motion.p variants={heroItemVariants} className="mx-auto mt-3.5 max-w-xl text-[0.86rem] leading-7 text-foreground/66 sm:text-[0.92rem] sm:leading-8 lg:mx-0">
            {copy.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-5 grid gap-2.5 max-sm:px-3 sm:mx-auto sm:max-w-md grid-cols-2 lg:mx-0 lg:max-w-none lg:flex lg:flex-wrap lg:gap-3 xl:gap-3.5">
            <Button href="#courses" variant="primary" className="group w-full rounded-2xl px-[1.125rem] shadow-[0_16px_36px_rgba(29,23,213,0.22)] hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(29,23,213,0.28)] sm:w-auto">
              <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.browseCourses}
            </Button>
            <Button href="#books" variant="secondary" className="group w-full rounded-2xl border-primary/18 bg-white/84 px-[1.125rem] shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-primary/28 hover:bg-white dark:bg-white/8 sm:w-auto">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.exploreBooks}
            </Button>
          </motion.div>

          {trustItems.length > 0 ? (
            <motion.div variants={heroItemVariants} className="mx-auto mt-5 grid max-w-xl gap-2.5 sm:grid-cols-3 max-sm:hidden lg:mx-0 xl:gap-3">
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index] ?? Shield;

                return (
                  <motion.div
                    key={item}
                    className="group flex items-center gap-2 rounded-2xl border border-white/76 bg-white/68 px-3 py-2.5 text-start text-[0.8125rem] font-medium text-foreground/72 shadow-[0_10px_26px_rgba(17,24,39,0.045)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/18 hover:bg-white/88 hover:shadow-[0_16px_34px_rgba(17,24,39,0.07)] dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
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
          className="mx-auto w-full flex-1 lg:ms-0 "
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22, scale: 0.97 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <HomeHeroVisual copy={copy} />
        </motion.div>
      </SiteContainer>
    </section>
  );
}
