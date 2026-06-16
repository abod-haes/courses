"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Globe2, Menu, MoonStar, SunMedium } from "lucide-react";
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
  const panelSideClass = isArabic ? "left-0 border-r" : "right-0 border-l";
  const panelExitX = isArabic ? "-100%" : "100%";

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
    <header className="relative z-50 shrink-0 border-b border-border/60 bg-background/96">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-70" />

      <div className="motion-safe:animate-[fade-up_420ms_ease-out_both]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center gap-3 py-2">
            <Link
              href="/"
              className="flex shrink-0 items-center transition duration-200 ease-out hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative block h-9 w-[8.75rem] sm:h-10 sm:w-[9.75rem]">
                <Image
                  alt={`${copy.brand} logo`}
                  src="/images/logo-blue.png"
                  fill
                  priority
                  sizes="(max-width: 640px) 152px, 168px"
                  className="object-contain object-left"
                />
              </span>
              <span className="sr-only">{copy.brand}</span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-8 xl:flex">
              {navItems.map((item) => {
                const isActive = resolveNavState(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition duration-200 ease-out hover:-translate-y-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "bg-primary/8 text-primary shadow-[0_6px_18px_rgba(29,23,213,0.08)]"
                        : "text-foreground/68"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`h-3 w-3 transition duration-200 rtl:rotate-180 ${
                        isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-primary transition duration-200 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="ms-auto hidden items-center gap-2 sm:gap-3 lg:flex">
              <Button href="/#courses" className="rounded-[8px] px-4" variant="primary" size="sm">
                {copy.actions.getStarted}
              </Button>

              <HomeHeaderControls copy={copy.controls} />
            </div>

            <div className="ms-auto flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-primary/15 bg-white text-primary transition duration-200 hover:-translate-y-0.5 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              className="absolute inset-0 bg-slate-950/28 backdrop-blur-[2px]"
              aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
              onClick={() => setMenuOpen(false)}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.aside
              id="mobile-navigation"
              className={`fixed top-0 flex h-[100dvh] w-[min(88vw,21rem)] flex-col overflow-hidden border-border/60 bg-background shadow-[0_18px_40px_rgba(29,23,213,0.08)] ${panelSideClass}`}
              variants={panelVariants}
              custom={panelExitX}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-4">
                <span className="relative block h-9 w-[8.25rem]">
                  <Image
                    alt={`${copy.brand} logo`}
                    src="/images/logo-blue.png"
                    fill
                    sizes="144px"
                    className="object-contain object-left"
                  />
                </span>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-border/60 bg-white text-foreground/70 transition duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:text-primary"
                  aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
                >
                  <span aria-hidden="true">×</span>
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
                        className={`group flex items-center justify-between rounded-[10px] border px-4 py-3 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${
                          isActive
                            ? "border-primary/20 bg-primary/8 text-primary shadow-[0_8px_20px_rgba(29,23,213,0.08)]"
                            : "border-border/60 bg-surface/80 text-foreground/75 hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition duration-200 rtl:rotate-180 ${
                            isActive ? "translate-x-1 text-primary" : "text-primary/45 group-hover:translate-x-1 group-hover:text-primary"
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
                    className="w-full rounded-[8px]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {copy.actions.getStarted}
                  </Button>
                </div>

                <div className="mt-6 rounded-[12px] border border-border/60 bg-surface/80 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">
                    {copy.controls.language} {copy.controls.theme}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      toggleLocale();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-sm text-foreground/78 transition duration-200 hover:bg-primary/6 hover:text-foreground"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/8 text-primary">
                        <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-medium leading-5">{copy.controls.language}</span>
                        <span className="block text-[11px] text-foreground/50">
                          {locale === "en" ? copy.controls.english : copy.controls.arabic}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative h-6 w-11 rounded-full border border-border/60 transition duration-200 ${
                        locale === "en" ? "bg-primary/12" : "bg-surface-soft"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(17,24,39,0.12)] transition duration-200 ${
                          locale === "en" ? "start-5" : "start-0.5"
                        }`}
                      />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-sm text-foreground/78 transition duration-200 hover:bg-primary/6 hover:text-foreground"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/8 text-primary">
                        {theme === "dark" ? (
                          <SunMedium className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </span>
                      <span>
                        <span className="block font-medium leading-5">{copy.controls.theme}</span>
                        <span className="block text-[11px] text-foreground/50">
                          {theme === "dark" ? copy.controls.dark : copy.controls.light}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative h-6 w-11 rounded-full border border-border/60 transition duration-200 ${
                        theme === "dark" ? "bg-primary/12" : "bg-surface-soft"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_4px_10px_rgba(17,24,39,0.12)] transition duration-200 ${
                          theme === "dark" ? "start-5" : "start-0.5"
                        }`}
                      />
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
