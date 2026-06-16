"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Globe2, Menu, MoonStar, SunMedium, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/shared/components/ui/button";
import type { HomeMessages } from "../home.types";
import { HomeHeaderControls } from "./home-header-controls.component";

type HomeHeaderProps = Readonly<{
  copy: HomeMessages;
}>;

const panelVariants: Variants = {
  hidden: (x: string) => ({ x, opacity: 0.98 }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 36,
    },
  },
  exit: (x: string) => ({
    x,
    opacity: 0.98,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  }),
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
};

function normalizePath(value: string) {
  const pathWithoutQuery = value.split("?")[0]?.replace(/\/+$/, "") ?? "";
  return pathWithoutQuery === "" ? "/" : pathWithoutQuery;
}

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale, theme, toggleLocale, toggleTheme } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const isDark = theme === "dark";
  const panelSideClass = isArabic ? "left-0 border-r" : "right-0 border-l";
  const panelExitX = isArabic ? "-100%" : "100%";
  const languageLabel = locale === "ar" ? "AR" : "EN";

  const navItems = [
    { label: copy.navigation.home, href: "/" },
    { label: copy.navigation.courses, href: "/courses" },
    { label: copy.navigation.textbooks, href: "/books" },
    { label: copy.navigation.articles, href: "/articles" },
    { label: copy.navigation.specialties, href: "/about-us" },
  ];

  const resolveNavState = (href: string) => {
    const [rawPath = "/", hash] = href.split("#");
    const itemPath = normalizePath(rawPath || "/");
    const activePath = normalizePath(pathname || "/");

    if (hash) {
      return activePath === itemPath && currentHash === `#${hash}`;
    }

    if (itemPath === "/") {
      return activePath === "/" && currentHash === "";
    }

    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function syncHash() {
      setCurrentHash(window.location.hash);
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="relative z-50 shrink-0 bg-gradient-to-b from-background via-background/96 to-background/90 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl dark:from-slate-950 dark:via-slate-950/96 dark:to-slate-950/90 dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-80 dark:via-white/14" />

      <div className="motion-safe:animate-[fade-up_420ms_ease-out_both]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center gap-3 py-2">
            <Link
              href="/"
              className="flex shrink-0 items-center transition duration-200 ease-out hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative block h-10 w-[9.5rem] sm:h-11 sm:w-[10.5rem]">
                <Image
                  alt={`${copy.brand} logo`}
                  src="/images/logo-blue.png"
                  fill
                  priority
                  sizes="(max-width: 640px) 152px, 168px"
                  className="object-contain object-left drop-shadow-[0_8px_18px_rgba(15,23,42,0.06)] dark:brightness-0 dark:invert"
                />
              </span>
              <span className="sr-only">{copy.brand}</span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full bg-white/58 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/60 backdrop-blur-xl dark:bg-white/8 dark:ring-white/12 xl:flex">
              {navItems.map((item) => {
                const isActive = resolveNavState(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "bg-primary text-white shadow-[0_10px_26px_rgba(29,23,213,0.18)] dark:bg-white dark:text-slate-950 dark:shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                        : "text-foreground/68 hover:bg-white/72 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] dark:text-white/68 dark:hover:bg-white/12 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`h-3 w-3 transition duration-200 rtl:rotate-180 ${
                        isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="ms-auto hidden items-center gap-2 sm:gap-3 lg:flex">
              <Button href="/#courses" className="rounded-full px-4 shadow-[0_10px_24px_rgba(29,23,213,0.16)]" variant="primary" size="sm">
                {copy.actions.getStarted}
              </Button>

              <HomeHeaderControls copy={copy.controls} />
            </div>

            <div className="ms-auto flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-white dark:hover:text-slate-950"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={isArabic ? "فتح القائمة" : "Open menu"}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {menuOpen ? (
          <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <motion.button
              type="button"
              className="absolute inset-0 bg-slate-950/34 backdrop-blur-[3px]"
              aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
              onClick={() => setMenuOpen(false)}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.aside
              id="mobile-navigation"
              className={`fixed top-0 flex h-[100dvh] w-[min(88vw,21rem)] flex-col overflow-hidden border-border/60 bg-background shadow-[0_18px_50px_rgba(15,23,42,0.18)] dark:border-white/12 dark:bg-slate-950 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)] ${panelSideClass}`}
              variants={panelVariants}
              custom={panelExitX}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-4 dark:border-white/10">
                <span className="relative block h-10 w-[9rem]">
                  <Image
                    alt={`${copy.brand} logo`}
                    src="/images/logo-blue.png"
                    fill
                    sizes="144px"
                    className="object-contain object-left dark:brightness-0 dark:invert"
                  />
                </span>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/86 text-foreground/72 shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-border/60 transition duration-200 hover:-translate-y-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 dark:bg-white/12 dark:text-white/82 dark:ring-white/12 dark:hover:bg-white dark:hover:text-slate-950"
                  aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <nav className="mt-5 space-y-2">
                  {navItems.map((item) => {
                    const isActive = resolveNavState(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isActive
                            ? "bg-primary text-white shadow-[0_12px_26px_rgba(29,23,213,0.18)] dark:bg-white dark:text-slate-950"
                            : "bg-white/70 text-foreground/75 shadow-[0_8px_18px_rgba(15,23,42,0.04)] ring-1 ring-border/55 hover:bg-primary/8 hover:text-primary dark:bg-white/8 dark:text-white/74 dark:ring-white/10 dark:hover:bg-white/14 dark:hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition duration-200 rtl:rotate-180 ${
                            isActive ? "translate-x-1" : "opacity-55 group-hover:translate-x-1 group-hover:opacity-100"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-6 grid gap-3">
                  <Button
                    href="/#courses"
                    variant="primary"
                    size="sm"
                    className="w-full rounded-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    {copy.actions.getStarted}
                  </Button>
                </div>

                <div className="mt-6 rounded-3xl bg-white/70 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 backdrop-blur-xl dark:bg-white/8 dark:ring-white/12">
                  <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/52 dark:text-white/50">
                    {copy.controls.language} / {copy.controls.theme}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      toggleLocale();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-foreground/80 transition duration-200 hover:bg-primary/8 hover:text-primary dark:text-white/82 dark:hover:bg-white/12 dark:hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_8px_18px_rgba(29,23,213,0.08)] dark:bg-white/14 dark:text-white">
                        <Globe2 className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-semibold leading-5">{copy.controls.language}</span>
                        <span className="block text-[11px] text-foreground/50 dark:text-white/48">
                          {locale === "en" ? copy.controls.english : copy.controls.arabic}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative flex h-8 w-14 items-center rounded-full bg-slate-900/[0.06] p-1 dark:bg-white/16"
                      dir="ltr"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow-[0_5px_14px_rgba(15,23,42,0.14)] transition duration-200 dark:text-slate-950 ${
                          locale === "en" ? "translate-x-6" : "translate-x-0"
                        }`}
                      >
                        {languageLabel}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-foreground/80 transition duration-200 hover:bg-primary/8 hover:text-primary dark:text-white/82 dark:hover:bg-white/12 dark:hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_8px_18px_rgba(29,23,213,0.08)] dark:bg-white/14 dark:text-white">
                        {isDark ? <SunMedium className="h-4 w-4" aria-hidden="true" /> : <MoonStar className="h-4 w-4" aria-hidden="true" />}
                      </span>
                      <span>
                        <span className="block font-semibold leading-5">{copy.controls.theme}</span>
                        <span className="block text-[11px] text-foreground/50 dark:text-white/48">
                          {isDark ? copy.controls.dark : copy.controls.light}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative flex h-8 w-14 items-center rounded-full bg-slate-900/[0.06] p-1 dark:bg-white/16"
                      dir="ltr"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.14)] transition duration-200 ${
                          isDark ? "translate-x-6 bg-white text-slate-950" : "translate-x-0 bg-primary text-white"
                        }`}
                      >
                        {isDark ? <SunMedium className="h-3.5 w-3.5" aria-hidden="true" /> : <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
