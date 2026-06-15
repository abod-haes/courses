"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/shared/components/ui/button";
import type { HomeMessages } from "../home.types";
import { HomeHeaderControls } from "./home-header-controls.component";

type HomeHeaderProps = Readonly<{
  copy: HomeMessages;
}>;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.98, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    filter: "blur(8px)",
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
};

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isArabic = locale === "ar";

  const navItems = [
    { label: copy.navigation.courses, href: "/courses" },
    { label: copy.navigation.textbooks, href: "/books" },
    { label: copy.navigation.articles, href: "/articles" },
    { label: copy.navigation.specialties, href: "/about-us" },
  ];

  const resolveNavState = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      className="sticky top-0 z-50 shrink-0 border-b border-border/70 bg-background/92 shadow-[0_8px_26px_rgba(15,23,42,0.04)] backdrop-blur-2xl dark:bg-slate-950/88 dark:shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center rounded-2xl px-1 py-1 transition duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={isArabic ? "العودة للصفحة الرئيسية" : "Go to homepage"}
        >
          <span className="relative block h-10 w-[8.6rem] sm:h-11 sm:w-[9.8rem]">
            <Image
              alt={`${copy.brand} logo`}
              src="/images/logo-blue.png"
              fill
              priority
              sizes="(max-width: 640px) 138px, 156px"
              className="object-contain object-left rtl:object-right"
            />
          </span>
          <span className="sr-only">{copy.brand}</span>
        </Link>

        <nav className="hidden justify-center lg:flex" aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}>
          <div className="flex items-center rounded-full border border-border/70 bg-surface-soft/72 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl dark:bg-white/5">
            {navItems.map((item, index) => {
              const isActive = resolveNavState(item.href);

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.1 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative inline-flex items-center rounded-full px-5 py-2 text-sm font-bold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "bg-white text-primary shadow-[0_10px_24px_rgba(29,23,213,0.1)] dark:bg-white/12 dark:text-[#d8ddff]"
                        : "text-foreground/70 hover:-translate-y-0.5 hover:bg-white/78 hover:text-primary hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)] dark:hover:bg-white/10"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute inset-x-5 -bottom-0.5 h-0.5 origin-center rounded-full bg-primary transition duration-300 ${
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <Button
            href="/#courses"
            className="group h-10 rounded-full px-5 shadow-[0_12px_28px_rgba(29,23,213,0.15)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(29,23,213,0.2)]"
            variant="primary"
            size="sm"
          >
            {copy.actions.getStarted}
            <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg] rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </Button>
          <HomeHeaderControls copy={copy.controls} />
        </div>

        <div className="flex items-center justify-end lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white/90 text-primary shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-white/8"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? (isArabic ? "إغلاق القائمة" : "Close menu") : isArabic ? "فتح القائمة" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full border-b border-border/70 bg-background/96 px-4 py-4 shadow-[0_22px_55px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:hidden dark:bg-slate-950/96 dark:shadow-[0_22px_55px_rgba(0,0,0,0.3)]"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="mx-auto grid max-w-7xl gap-2" aria-label={isArabic ? "قائمة الجوال" : "Mobile navigation"}>
              {navItems.map((item, index) => {
                const isActive = resolveNavState(item.href);

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${
                        isActive
                          ? "border-primary/20 bg-primary/8 text-primary shadow-[0_12px_28px_rgba(29,23,213,0.08)]"
                          : "border-border/60 bg-surface/80 text-foreground/75 hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-3 grid gap-3 rounded-[1.25rem] border border-border/60 bg-surface/78 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <Button href="/#courses" variant="primary" size="sm" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                  {copy.actions.getStarted}
                </Button>
                <HomeHeaderControls copy={copy.controls} />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
