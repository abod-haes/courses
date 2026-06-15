"use client";

/* eslint-disable @next/next/no-img-element */
import { Activity, BookOpen, GraduationCap, Shield, Sparkles, Stethoscope } from "lucide-react";
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
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.45 + index * 0.12 },
  }),
};

export function HomeHero({ copy }: HomeHeroProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  const ambientIcons = [
    { Icon: Activity, className: "left-[8%] top-[20%]", delay: "0s" },
    { Icon: Stethoscope, className: "right-[12%] top-[14%]", delay: "0.8s" },
    { Icon: GraduationCap, className: "bottom-[18%] left-[14%]", delay: "1.4s" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-section-bg py-12 dark:bg-[#07111f] sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.13] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-normal"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOiocdoc9hqyEo9Sw8iIvDYmOVuQRcnvqe2eFkBEohZqAxId4Y0UdGtDEmiX5WagyVgYyrO-zA5sddVlof2LlVX-HB_rDvNH3J7vZvIbwl3L2uUyxbzv9NLfhDLBHnYzoMQHe265Xv7H_oAPVsf62L7D0A4oss2x08Aqvu6eR1qK5tiHjPtivjqWSlFbkLATvg21qwH39TiBuF0mknu2Y3PrOp0lsk0LWvdRKw9Cvwg2-dTJBUmjERReqHAQ5oQ4y_2b0OWf1ShIU"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.82)_0%,rgba(248,250,252,0.6)_46%,rgba(238,242,255,0.64)_100%)] dark:bg-[linear-gradient(115deg,rgba(7,17,31,0.9)_0%,rgba(8,17,29,0.74)_52%,rgba(15,23,42,0.84)_100%)]" />
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-primary-soft/80 blur-3xl motion-safe:animate-[clinical-float_9s_ease-in-out_infinite] dark:bg-primary-soft/28" />
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-white blur-3xl motion-safe:animate-[clinical-float_11s_ease-in-out_infinite_reverse] dark:bg-primary/10" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl motion-safe:animate-[clinical-drift_14s_ease-in-out_infinite] dark:bg-sky-400/8" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.06),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {!shouldReduceMotion ? (
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {ambientIcons.map(({ Icon, className, delay }, index) => (
            <motion.div
              key={className}
              custom={index}
              className={`absolute ${className} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/78 text-primary shadow-[0_18px_44px_rgba(17,24,39,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:shadow-[0_18px_44px_rgba(0,0,0,0.24)]`}
              variants={floatingIconVariants}
              initial="hidden"
              animate="visible"
              style={{ animationDelay: delay }}
            >
              <Icon className="h-5 w-5 motion-safe:animate-[clinical-float_5.6s_ease-in-out_infinite]" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          className="space-y-5"
          variants={heroContainerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center rounded-[10px] border border-border/60 bg-surface px-3 py-2 text-xs font-medium text-primary shadow-[0_10px_28px_rgba(17,24,39,0.05)] backdrop-blur">
            <Shield className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {copy.hero.badge}
          </motion.div>

          <motion.h1 variants={heroItemVariants} className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {copy.hero.title}
          </motion.h1>

          <motion.p variants={heroItemVariants} className="max-w-lg text-base leading-7 text-foreground/70 sm:text-lg">
            {copy.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="flex flex-wrap gap-4 pt-2">
            <Button href="#courses" variant="primary" className="group shadow-[0_14px_32px_rgba(29,23,213,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(29,23,213,0.22)]">
              <BookOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.browseCourses}
            </Button>
            <Button href="#books" variant="secondary" className="group hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
              {copy.actions.exploreBooks}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <HomeHeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
