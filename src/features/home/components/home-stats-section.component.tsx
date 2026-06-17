"use client";

import { Award, BookOpen, Star, Users } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { HomeMessages, HomeStatItem } from "../home.types";

type HomeStatsSectionProps = Readonly<{
  copy: HomeMessages;
}>;

const iconMap = {
  users: Users,
  award: Award,
  star: Star,
  book: BookOpen,
} as const;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function parseStatValue(value: string) {
  const match = value.match(/^([\d.,]+)(.*)$/);

  if (!match) {
    return { number: null as number | null, suffix: value };
  }

  const number = Number.parseFloat(match[1].replace(/,/g, ""));

  if (Number.isNaN(number)) {
    return { number: null as number | null, suffix: value };
  }

  return { number, suffix: match[2] };
}

function formatStatValue(value: number, locale: string, originalValue: string) {
  const hasDecimals = originalValue.includes(".");

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: hasDecimals ? 1 : 0,
    minimumFractionDigits: hasDecimals ? 1 : 0,
  }).format(value);
}

function StatCard({
  item,
  index,
  isRtl,
  locale,
  shouldReduceMotion,
  variants,
}: Readonly<{
  item: HomeStatItem;
  index: number;
  isRtl: boolean;
  locale: string;
  shouldReduceMotion: boolean;
  variants: Variants;
}>) {
  const Icon = iconMap[item.icon];
  const accentClass =
    index === 0
      ? "from-primary/12 dark:from-primary/22"
      : index === 1
        ? "from-sky-100 dark:from-primary/16"
        : index === 2
          ? "from-indigo-100 dark:from-primary/18"
          : "from-violet-100 dark:from-primary/16";
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [displayValue, setDisplayValue] = useState(item.value);
  const { number, suffix } = useMemo(() => parseStatValue(item.value), [item.value]);

  useEffect(() => {
    if (!hasEnteredView || shouldReduceMotion || number === null) {
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    let animationFrame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = number * eased;

      setDisplayValue(`${formatStatValue(currentValue, locale, item.value)}${suffix}`);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [hasEnteredView, item.value, locale, number, shouldReduceMotion, suffix]);

  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border border-border/70 bg-white px-5 py-8 shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,24,39,0.06)] dark:border-white/10 dark:bg-slate-900/82 dark:shadow-[0_16px_40px_rgba(0,0,0,0.28)] dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.34)] sm:px-6 sm:py-9"
      custom={index}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      variants={variants}
      viewport={{ once: true, amount: 0.28 }}
      onViewportEnter={() => setHasEnteredView(true)}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accentClass} to-transparent opacity-90 dark:opacity-28`} />
      <div className="relative flex h-full flex-col items-center justify-between gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-[#F7F8FF] text-primary shadow-[0_6px_14px_rgba(29,23,213,0.06)] transition duration-300 group-hover:scale-105 dark:border-white/10 dark:bg-primary/10 dark:shadow-none">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className={cn("space-y-2 text-center")}>
          <motion.div
            className="text-[2rem]  leading-none font-semibold tracking-tight text-primary sm:text-[2.2rem]"
            initial={false}
            animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            {displayValue}
          </motion.div>
          <h3 className="text-[0.9rem] font-semibold tracking-tight text-foreground sm:text-[1rem]">{item.label}</h3>
          <p className="mx-auto max-w-[16rem] text-sm leading-6 text-foreground/65 dark:text-foreground/72">{item.description}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function HomeStatsSection({ copy }: HomeStatsSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const locale = useLocale();
  const isRtl = locale === "ar";
  const stats = copy.stats;
  const cardVariants: Variants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: 16,
      x: index % 2 === 0 ? (isRtl ? 14 : -14) : (isRtl ? -14 : 14),
    }),
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.46,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.07,
      },
    }),
  };

  return (
    <section id="stats" className="overflow-hidden  py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={headingVariants}
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">{stats.label}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.7rem]">{stats.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/68 dark:text-foreground/76 sm:text-lg">{stats.subtitle}</p>
        </motion.div>

        <div className="mt-8 sm:p-5 lg:p-6">
          <motion.div
            className="grid gap-5 max-sm:grid-cols-1  grid-cols-4 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {stats.items.map((item, index) => (
              <StatCard
                key={item.label}
                item={item}
                index={index}
                isRtl={isRtl}
                locale={locale}
                shouldReduceMotion={shouldReduceMotion}
                variants={cardVariants}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
