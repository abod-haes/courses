"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import type { HomeMessages } from "../home.types";

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function createSideVariants(fromX: number, delay: number): Variants {
  return {
    hidden: { opacity: 0, x: fromX },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
    },
  };
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
};

type FounderSectionProps = Readonly<{
  copy: HomeMessages;
}>;

export function FounderSection({ copy }: FounderSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const founder = copy.founder;
  const imageVariants = createSideVariants(isRtl ? 16 : -16, 0.08);
  const textVariants = {
    ...createSideVariants(isRtl ? -16 : 16, 0.16),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.16,
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  } satisfies Variants;
  const arrowHoverClass = isRtl ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5";

  return (
    <section id="founder" className="overflow-hidden bg-[#F7F8FF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={titleVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary sm:text-[0.8125rem]">{founder.label}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">{founder.title}</h2>
          <p className="mt-4 text-base leading-7 text-foreground/68 sm:text-lg">{founder.subtitle}</p>
        </motion.div>

        <article className="group mt-10 overflow-hidden rounded-[24px] border border-[#E6E8F5] bg-white shadow-[0_18px_48px_rgba(17,24,39,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(17,24,39,0.08)] sm:mt-12">
          <div className="grid lg:min-h-[460px] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <motion.div
              className="relative min-h-[280px] overflow-hidden rounded-t-[24px] bg-[#EAF0FF] lg:min-h-0 lg:rounded-l-[24px] lg:rounded-tr-none"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              variants={imageVariants}
              viewport={{ once: true, amount: 0.28 }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLTwJn4aKK7om-xLrz5oHU1etm2aYmUVN4FATefb9KpuFO0kmIcaTs7yP-qPudbK4u45qNoIPvP9ZlwBlGYK_BAeA7nEyP8iKYfr08U_qZHSo8okduMTfwtBBk9RIIU1_BZg9jx1q3Tbvqr2dbe35MQSPBnuwR6XOgq08aRUeL9WQtLXDE92HP0JC9y3ByKbo6SmLVbQnqvvzINBg14lrUa4bQ5W8Hg9v7eSH9ukBF_pTPYGz0Lw_S1O-cxjsC0ZDXwo52Gq5uVIY"
                alt={founder.imageAlt}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.14)_100%),linear-gradient(135deg,rgba(29,23,213,0.08)_0%,rgba(29,23,213,0.02)_42%,transparent_72%)]" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/18 to-transparent" />
            </motion.div>

            <motion.div
              className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              variants={textVariants}
              viewport={{ once: true, amount: 0.28 }}
            >
              <motion.p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary sm:text-[0.8125rem]" variants={itemVariants}>
                {founder.label}
              </motion.p>
              <motion.h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2.25rem]" variants={itemVariants}>
                {founder.name}
              </motion.h3>
              <motion.p className="mt-5 max-w-2xl text-base leading-7 text-foreground/72 sm:text-[1.05rem] sm:leading-8" variants={itemVariants}>
                {founder.description}
              </motion.p>

              <motion.div className="mt-7" variants={itemVariants}>
                <Button
                  href="/courses"
                  variant="primary"
                  className="group shadow-[0_10px_24px_rgba(29,23,213,0.16)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(29,23,213,0.22)]"
                >
                  {founder.ctaLabel}
                  <ArrowRight className={`h-4 w-4 transition-transform duration-200 ${arrowHoverClass}`} aria-hidden="true" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </article>
      </div>
    </section>
  );
}
