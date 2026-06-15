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
  hidden: { opacity: 0, y: -16, filter: "blur(8px)" },
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
    { label: copy.navigation.home, href: "/" },
    { label: copy.navigation.courses, href: "/courses" },
    { label: copy.navigation.textbooks, href: "/books" },
    { label: copy.navigation.articles, href: "/articles" },
    { label: copy.navigation.specialties, href: "/about-us" },
  ];

  const resolveNavState = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <motion.header
      className="sticky top-0 z-50 shrink-0 overflow-hidden border-b border-primary/10 bg-[linear-gradient(100deg,rgba(238,242,255,0.94)_0%,rgba(255,255,255,0.78)_42%,rgba(236,253,245,0.88)_100%)] shadow-[0_12px_40px_rgba(15,23,42,0.055)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(100deg,rgba(15,23,42,0.94)_0%,rgba(2,6,23,0.86)_50%,rgba(12,47,44,0.72)_100%)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.22)]"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/18" />
        <div className="absolute -left-20 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-400/12" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/22 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center rounded-[1.35rem] border border-white/60 bg-white/62 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/82 hover:shadow-[0_16px_38px_rgba(29,23,213,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/12"
          aria-label={isArabic ? "العودة للصفحة الرئيسية" : "Go to homepage"}
        >
          <span className="relative block h-9 w-[8.25rem] sm:h-10 sm:w-[9.6rem]">
            <Image
              alt={`${copy.brand} logo`}
              src="/images/logo-blue.png"
              fill
              priority
              sizes="(max-width: 640px) 132px, 154px"
              className="object-contain object-left rtl:object-right"
            />
          </span>
          <span className="sr-only">{copy.brand}</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center lg:flex" aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}>
          <div className="inline-flex items-center gap-1 rounded-[1.4rem] border border-white/62 bg-white/52 p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.055),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
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
                    className={`group relative inline-flex min-w-[5.4rem] items-center justify-center rounded-[1.05rem] px-3.5 py-2 text-sm font-extrabold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "bg-primary text-white shadow-[0_12px_28px_rgba(29,23,213,0.2)]"
                        : "text-foreground/72 hover:-translate-y-0.5 hover:bg-white/74 hover:text-primary hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)] dark:hover:bg-white/10"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition duration-300 ${
                        isActive ? "scale-100 bg-white opacity-90" : "scale-0 bg-primary opacity-0 group-hover:scale-100 group-hover:opacity-80"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex">
          <Button
            href="/#courses"
            className="group h-10 rounded-[1.05rem] px-5 shadow-[0_14px_30px_rgba(29,23,213,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(29,23,213,0.24)]"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-white/62 bg-white/70 text-primary shadow-[0_12px_26px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/86 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/8"
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
            className="absolute inset-x-0 top-full border-b border-primary/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,242,255,0.94),rgba(236,253,245,0.92))] px-4 py-4 shadow-[0_22px_55px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] dark:shadow-[0_22px_55px_rgba(0,0,0,0.3)]"
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
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-extrabold transition duration-300 hover:-translate-y-0.5 ${
                        isActive
                          ? "border-primary/22 bg-primary text-white shadow-[0_12px_28px_rgba(29,23,213,0.14)]"
                          : "border-white/70 bg-white/68 text-foreground/76 shadow-[0_8px_22px_rgba(15,23,42,0.04)] hover:border-primary/18 hover:bg-white/88 hover:text-primary dark:border-white/10 dark:bg-white/8"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-primary/70"}`} />
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-3 grid gap-3 rounded-[1.25rem] border border-white/70 bg-white/58 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
                <Button href="/#courses" variant="primary" size="sm" className="w-full rounded-[1.05rem]" onClick={() => setMenuOpen(false)}>
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
