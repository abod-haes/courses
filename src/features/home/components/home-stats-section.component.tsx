"use client";

import { Award, BookOpen, Star, Users } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLocale } from "next-intl";
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

function StatCard({
  item,
  index,
  isRtl,
  shouldReduceMotion,
  variants,
}: Readonly<{
  item: HomeStatItem;
  index: number;
  isRtl: boolean;
  shouldReduceMotion: boolean;
  variants: Variants;
}>) {
  const Icon = iconMap[item.icon];
  const accentClass = index === 0 ? "from-primary/12" : index === 1 ? "from-sky-100" : index === 2 ? "from-indigo-100" : "from-violet-100";
  return (
    <motion.article
      className="group relative overflow-hidden rounded-[22px] border border-[#E6E8F5] bg-white px-5 py-8 shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,24,39,0.06)] sm:px-6 sm:py-9"
      custom={index}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      variants={variants}
      viewport={{ once: true, amount: 0.28 }}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accentClass} to-transparent opacity-90`} />
      <div className="relative flex h-full flex-col items-center justify-between gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E6E8F5] bg-[#F7F8FF] text-primary shadow-[0_6px_14px_rgba(29,23,213,0.06)] transition duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className={cn("space-y-2 text-center", isRtl && "sm:text-right")}>
          <motion.div
            className="text-[2.6rem] leading-none font-semibold tracking-tight text-primary sm:text-[2.9rem]"
            initial={false}
            animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            {item.value}
          </motion.div>
          <h3 className="text-[1.02rem] font-semibold tracking-tight text-foreground sm:text-[1.08rem]">{item.label}</h3>
          <p className="mx-auto max-w-[16rem] text-sm leading-6 text-foreground/65">{item.description}</p>
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
    <section id="stats" className="overflow-hidden  py-12 sm:py-14 lg:py-16">
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
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/68 sm:text-lg">{stats.subtitle}</p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
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
              shouldReduceMotion={shouldReduceMotion}
              variants={cardVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
