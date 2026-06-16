"use client";

import Image from "next/image";
import { BookOpenCheck, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { AuthVisualCopy } from "../auth.types";

type AuthVisualProps = Readonly<{
  copy: AuthVisualCopy;
}>;

const floatingCards = [
  { icon: ShieldCheck, className: "left-5 bottom-10", delay: 0 },
  { icon: BookOpenCheck, className: "right-6 bottom-14", delay: 0.14 },
  { icon: Sparkles, className: "left-10 top-1", delay: 0.28 },
];

export function AuthVisual({ copy }: AuthVisualProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden min-h-[29rem] overflow-hidden rounded-[1.6rem] border border-primary/10 bg-gradient-to-br from-primary via-primary-strong to-[#080b4f] p-5 text-white shadow-[0_20px_58px_rgba(29,23,213,0.2)] xl:flex xl:flex-col xl:justify-between"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/16 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-300/18 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_26%)]" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          {copy.brandLine}
        </span>

        <h2 className="mt-5 max-w-lg text-[1.95rem] font-black leading-[1.08] tracking-[-0.04em]">
          {copy.title}
        </h2>
        <p className="mt-3 max-w-md text-[0.82rem] leading-6 text-white/72">
          {copy.description}
        </p>
      </div>

      <div className="relative z-10 my-5 flex min-h-[12.5rem] items-center justify-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-40 w-40 items-center justify-center rounded-[1.4rem] border border-white/18 bg-white/12 shadow-[0_20px_55px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        >
          <div className="absolute inset-3 rounded-[1.1rem] border border-white/14" />
          <span className="relative block h-12 w-28">
            <Image
              src="/images/logo-blue.png"
              alt="IASS logo"
              fill
              sizes="112px"
              className="object-contain brightness-0 invert"
              priority
            />
          </span>
        </motion.div>

        {floatingCards.map((item, index) => {
          const Icon = item.icon;
          const label = copy.cards[index];

          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: item.delay + 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute flex items-center gap-2.5 rounded-2xl border border-white/16 bg-white/14 px-3 py-2.5 text-[0.7rem] font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] backdrop-blur-xl ${item.className}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="max-w-[8rem] leading-4">{label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2.5">
        {copy.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1rem] border border-white/14 bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-lg font-black text-white">{metric.value}</p>
            <p className="mt-1 text-[0.64rem] font-semibold leading-4 text-white/64">{metric.label}</p>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
