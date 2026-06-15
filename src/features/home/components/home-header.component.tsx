"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/shared/components/ui/button";
import type { HomeMessages } from "../home.types";
import { HomeHeaderControls } from "./home-header-controls.component";

type HomeHeaderProps = Readonly<{
  copy: HomeMessages;
}>;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -14, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

const panelVariants: Variants = {
  hidden: (x: string) => ({ x, opacity: 0.98 }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 420, damping: 36 },
  },
  exit: (x: string) => ({ x, opacity: 0.98, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } }),
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
};

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const panelSideClass = isArabic ? "left-0 border-r" : "right-0 border-l";
  const panelExitX = isArabic ? "-100%" : "100%";

  const navItems = [
    { label: copy.navigation.courses, href: "/courses" },
    { label: copy.navigation.textbooks, href: "/books" },
    { label: copy.navigation.articles, href: "/articles" },
    { label: copy.navigation.specialties, href: "/about-us" },
  ];

  const resolveNavState = (href: string) => {
    const [path, hash = ""] = href.split("#");

    if (!hash) {
      return pathname === path || pathname.startsWith(`${path}/`);
    }

    if (path === "/" || path === "") {
      return pathname === "/" && currentHash === `#${hash}`;
    }

    return pathname === path && currentHash === `#${hash}`;
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
    <motion.header
      className="relative z-50 shrink-0 bg-transparent px-3 pt-3 sm:px-4"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.55rem] border border-white/78 bg-white/84 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_18px_55px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(29,23,213,0.1),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(20,184,166,0.09),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative flex min-h-[4.45rem] items-center gap-3 px-3 py-2 sm:px-4 lg:px-5">
          <Link
            href="/"
            className="group flex shrink-0 items-center rounded-2xl px-2 py-1.5 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
          >
            <span className="relative block h-10 w-[9.2rem] sm:h-11 sm:w-[10.25rem]">
              <Image
                alt={`${copy.brand} logo`}
                src="/images/logo-blue.png"
                fill
                priority
                sizes="(max-width: 640px) 148px, 164px"
                className="object-contain object-left rtl:object-right"
              />
            </span>
            <span className="sr-only">{copy.brand}</span>
          </Link>

          <nav className="mx-auto hidden items-center rounded-full border border-border/60 bg-surface-soft/72 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl xl:flex">
            {navItems.map((item, index) => {
              const isActive = resolveNavState(item.href);

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${isActive
                      ? "bg-white text-primary shadow-[0_10px_24px_rgba(29,23,213,0.12)] dark:bg-white/10 dark:text-[#cdd3ff]"
                      : "text-foreground/66 hover:-translate-y-0.5 hover:bg-white/72 hover:text-primary dark:hover:bg-white/8"
                      }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition duration-300 rtl:rotate-180 ${isActive
                        ? "translate-x-0.5 opacity-100 rtl:-translate-x-0.5"
                        : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5"
                        }`}
                      aria-hidden="true"
                    />
                    <span className={`absolute inset-x-4 -bottom-1 h-0.5 origin-center rounded-full bg-primary transition duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="ms-auto hidden items-center gap-2 sm:gap-3 lg:flex">
            <Button href="/#courses" className="group rounded-2xl px-4 shadow-[0_12px_28px_rgba(29,23,213,0.16)] hover:-translate-y-0.5" variant="primary" size="sm">
              {copy.actions.getStarted}
              <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-[-90deg] rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </Button>
            <HomeHeaderControls copy={copy.controls} />
          </div>

          <div className="ms-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-white/88 text-primary shadow-[0_10px_26px_rgba(29,23,213,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-white/8 dark:focus-visible:ring-offset-slate-950"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={isArabic ? "فتح القائمة" : "Open menu"}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
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
              className={`fixed top-0 flex h-[100dvh] w-[min(88vw,22rem)] flex-col overflow-hidden border-border/60 bg-background shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.42)] ${panelSideClass}`}
              variants={panelVariants}
              custom={panelExitX}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative flex shrink-0 items-center justify-between overflow-hidden border-b border-border/60 px-4 py-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,23,213,0.1),transparent_42%)]" />
                <span className="relative block h-10 w-[9rem]">
                  <Image alt={`${copy.brand} logo`} src="/images/logo-blue.png" fill sizes="144px" className="object-contain object-left rtl:object-right" />
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-white text-foreground/70 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:text-primary dark:bg-white/8"
                  aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = resolveNavState(item.href);

                    return (
                      <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.06 + index * 0.035, ease: [0.22, 1, 0.36, 1] }}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${isActive
                            ? "border-primary/20 bg-primary/8 text-primary shadow-[0_12px_28px_rgba(29,23,213,0.1)]"
                            : "border-border/60 bg-surface/80 text-foreground/75 hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                            }`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className={`h-4 w-4 transition duration-300 rtl:rotate-180 ${isActive ? "translate-x-1 text-primary rtl:-translate-x-1" : "text-primary/45 group-hover:translate-x-1 group-hover:text-primary rtl:group-hover:-translate-x-1"}`} aria-hidden="true" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-6 grid gap-3">
                  <Button href="/#courses" variant="primary" size="sm" className="w-full rounded-2xl" onClick={() => setMenuOpen(false)}>
                    {copy.actions.getStarted}
                  </Button>
                  <div className="rounded-[1.25rem] border border-border/60 bg-surface/82 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                    <HomeHeaderControls copy={copy.controls} />
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
