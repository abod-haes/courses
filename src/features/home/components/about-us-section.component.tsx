"use client";

import { ArrowRight, ClipboardList } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
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

  return (
    <section id="about-us" className="overflow-hidden bg-[#F7F8FF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[#E6E8F5] bg-white px-6 py-10 shadow-[0_18px_48px_rgba(17,24,39,0.05)] sm:px-8 sm:py-12 lg:px-12 lg:py-16"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={containerVariants}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,23,213,0.09),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(29,23,213,0.05),transparent_26%)]" />
          <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-primary/6 blur-3xl" />
          <div className="pointer-events-none absolute left-[-2rem] bottom-[-2rem] h-36 w-36 rounded-full bg-sky-100/70 blur-3xl" />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              {about.label}
            </motion.div>

            <motion.h2 variants={itemVariants} className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.8rem]">
              {about.title}
            </motion.h2>

            <motion.p variants={itemVariants} className="mt-5 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
              {about.subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex   items-center gap-3  flex-row">
              <Button href="#founder" variant="primary">
                {about.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#stats" variant="secondary">
                {about.secondaryCtaLabel}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
