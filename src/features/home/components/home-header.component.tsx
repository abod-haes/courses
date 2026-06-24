"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Globe2, LogIn, Menu, MoonStar, ShoppingCart, SunMedium, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePreferences } from "@/components/preferences-provider";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionCookieName, websiteSessionKey } from "@/shared/api/website-session";
import { readStoredCheckoutItems } from "@/features/checkout/checkout-storage";
import type { HomeMessages } from "../home.types";
import { HomeHeaderControls } from "./home-header-controls.component";

type HomeHeaderProps = Readonly<{
  copy: HomeMessages;
}>;

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
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

function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${websiteSessionCookieName}=`));
}

function getCartHref(): string {
  const items = readStoredCheckoutItems();
  const firstItem = items[0];

  if (!firstItem) {
    return "/checkout?empty=1";
  }

  return `/checkout?itemType=${encodeURIComponent(firstItem.type)}&itemId=${encodeURIComponent(String(firstItem.id))}`;
}

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale, theme, toggleLocale, toggleTheme } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartHref, setCartHref] = useState("/checkout?empty=1");
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const isDark = theme === "dark";
  const languageLabel = locale === "ar" ? "AR" : "EN";
  const sidebarInitialX = isArabic ? "105%" : "-105%";
  const homeLabel = copy.navigation.home ?? (isArabic ? "الرئيسية" : "Home");
  const cartLabel = isArabic ? "السلة" : "Cart";
  const libraryLabel = isArabic ? "مكتبتي" : "My library";

  const navItems = useMemo(
    () => [
      { label: homeLabel, href: "/" },
      { label: copy.navigation.courses, href: "/courses" },
      { label: copy.navigation.textbooks, href: "/books" },
      { label: copy.navigation.articles, href: "/articles" },
      { label: copy.navigation.specialties, href: "/about-us" },
    ],
    [copy.navigation.articles, copy.navigation.courses, copy.navigation.specialties, copy.navigation.textbooks, homeLabel],
  );

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
    setPortalReady(true);
  }, []);

  useEffect(() => {
    function syncSessionAndCart() {
      const session = window.localStorage.getItem(websiteSessionKey);
      const items = readStoredCheckoutItems();

      setIsAuthenticated(Boolean(session || hasSessionCookie()));
      setCartCount(items.length);
      setCartHref(getCartHref());
    }

    syncSessionAndCart();
    window.addEventListener("storage", syncSessionAndCart);
    window.addEventListener("focus", syncSessionAndCart);
    window.addEventListener("iass:website-session-changed", syncSessionAndCart);
    window.addEventListener("iass:checkout-cart-changed", syncSessionAndCart);

    return () => {
      window.removeEventListener("storage", syncSessionAndCart);
      window.removeEventListener("focus", syncSessionAndCart);
      window.removeEventListener("iass:website-session-changed", syncSessionAndCart);
      window.removeEventListener("iass:checkout-cart-changed", syncSessionAndCart);
    };
  }, []);

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
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const cartButton = (
    <Button href={cartHref} variant="secondary" size="sm" className="relative rounded-full px-3" onClick={() => setMenuOpen(false)}>
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      <span>{cartLabel}</span>
      {cartCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-black text-white rtl:-left-1 rtl:right-auto">
          {cartCount}
        </span>
      ) : null}
    </Button>
  );

  const desktopActions = isAuthenticated ? (
    <>
      {cartButton}
      <Button href="/library" variant="ghost" size="sm" className="rounded-full px-3">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        {libraryLabel}
      </Button>
    </>
  ) : (
    <>
      <Button href="/login" variant="secondary" size="sm" className="rounded-full px-3">
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {copy.actions.signIn}
      </Button>
      <Button href="/register" variant="primary" size="sm" className="rounded-full px-3 shadow-[0_8px_22px_rgba(29,23,213,0.14)]">
        {copy.actions.getStarted}
      </Button>
    </>
  );

  const mobileMenu = (
    <AnimatePresence initial={false} mode="wait">
      {menuOpen ? (
        <div className="fixed inset-0 z-[9999] min-[1120px]:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <motion.button
            type="button"
            className="absolute inset-0 z-0 bg-slate-950/46 backdrop-blur-[3px]"
            aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
            onClick={() => setMenuOpen(false)}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.aside
            id="mobile-navigation"
            className={`fixed inset-y-0 ${isArabic ? "right-0" : "left-0"} z-[10000] flex w-[min(86vw,21.5rem)] flex-col overflow-hidden border-white/65 bg-background/98 shadow-[0_26px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/98 dark:ring-white/12 dark:shadow-[0_26px_90px_rgba(0,0,0,0.56)] ${isArabic ? "rounded-l-[1.2rem] border-l" : "rounded-r-[1.2rem] border-r"}`}
            initial={{ x: sidebarInitialX, opacity: 0.86 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: sidebarInitialX, opacity: 0.86 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-white/58 px-4 py-3.5 dark:border-white/10 dark:bg-white/6">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative block h-8 w-28 shrink-0">
                <Image
                  alt={`${copy.brand} logo`}
                  src="/images/logo-blue.png"
                  fill
                  sizes="112px"
                  className="object-contain object-left dark:brightness-0 dark:invert"
                />
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/86 text-foreground/72 shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-border/60 transition duration-200 hover:-translate-y-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 dark:bg-white/12 dark:text-white/82 dark:ring-white/12 dark:hover:bg-primary dark:hover:text-white"
                aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <nav className="grid gap-2">
                {navItems.map((item, index) => {
                  const isActive = resolveNavState(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: isArabic ? 18 : -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: 0.08 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-[0.95rem] px-4 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${isActive
                          ? "bg-primary !text-white shadow-[0_12px_26px_rgba(29,23,213,0.18)] hover:!text-white dark:bg-primary dark:!text-white"
                          : "bg-white/70 text-foreground/75 shadow-[0_8px_18px_rgba(15,23,42,0.04)] ring-1 ring-border/55 hover:bg-primary/8 hover:text-primary dark:bg-white/8 dark:text-white/74 dark:ring-white/10 dark:hover:bg-white/14 dark:hover:text-white"
                          }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition duration-200 rtl:rotate-180 ${isActive ? "translate-x-1" : "opacity-55 group-hover:translate-x-1 group-hover:opacity-100"}`}
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-5 grid gap-3">
                {isAuthenticated ? (
                  <>
                    {cartButton}
                    <Button href="/library" variant="primary" size="sm" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      {libraryLabel}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button href="/login" variant="secondary" size="sm" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      {copy.actions.signIn}
                    </Button>
                    <Button href="/register" variant="primary" size="sm" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                      {copy.actions.getStarted}
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-5 rounded-[1.05rem] border border-border/60 bg-white/72 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6">
                <p className="px-3 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45 dark:text-white/42">
                  {copy.controls.language} / {copy.controls.theme}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    toggleLocale();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-[0.9rem] px-3 py-3 text-start text-sm text-foreground/80 transition duration-200 hover:bg-primary/8 hover:text-primary dark:text-white/82 dark:hover:bg-white/12 dark:hover:text-white"
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
                  <span className="text-xs font-black tracking-[0.14em] text-primary dark:text-white" dir="ltr">
                    {languageLabel}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className="mt-1 flex w-full items-center justify-between rounded-[0.9rem] px-3 py-3 text-start text-sm text-foreground/80 transition duration-200 hover:bg-primary/8 hover:text-primary dark:text-white/82 dark:hover:bg-white/12 dark:hover:text-white"
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
                  <span aria-hidden="true" className="relative h-8 w-14 rounded-full bg-slate-900/[0.06] p-1 dark:bg-white/16" style={{ direction: "ltr" }}>
                    <span
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.14)] transition-transform duration-200 ${isDark ? "translate-x-6 bg-white text-slate-950" : "translate-x-0 bg-primary text-white"}`}
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
  );

  return (
    <>
      <header className="relative z-50 shrink-0 overflow-visible bg-gradient-to-b from-background via-background/96 to-background/90 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl dark:from-slate-950 dark:via-slate-950/96 dark:to-slate-950/90 dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-80 dark:via-white/14" />

        <div className="motion-safe:animate-[fade-up_420ms_ease-out_both]">
          <SiteContainer>
            <div className="flex min-h-[3.15rem] items-center gap-0.5 py-1.5 min-[1500px]:min-h-[3.35rem] min-[1500px]:gap-2 min-[1500px]:py-2">
              <Link
                href="/"
                className="flex shrink-0 items-center transition duration-200 ease-out hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="relative block h-[1.85rem] w-[6.75rem] sm:w-[7rem] min-[1500px]:h-8 min-[1500px]:w-[8rem]">
                  <Image
                    alt={`${copy.brand} logo`}
                    src="/images/logo-blue.png"
                    fill
                    priority
                    sizes="(max-width: 640px) 108px, (max-width: 1500px) 112px, 128px"
                    className="object-contain object-left drop-shadow-[0_8px_18px_rgba(15,23,42,0.06)] dark:brightness-0 dark:invert"
                  />
                </span>
                <span className="sr-only">{copy.brand}</span>
              </Link>

              <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1120px]:flex min-[1500px]:gap-1">
                {navItems.map((item) => {
                  const isActive = resolveNavState(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative flex items-center rounded-md py-1.5 text-[0.66rem] font-semibold leading-none transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1280px]:text-[0.72rem] gap-1.5 px-3 min-[1500px]:py-2 min-[1500px]:text-[0.84rem] ${isActive
                        ? "bg-primary !text-white shadow-[0_10px_26px_rgba(29,23,213,0.18)] hover:!text-white dark:bg-primary dark:!text-white dark:shadow-[0_10px_30px_rgba(0,74,198,0.22)]"
                        : "text-foreground/68 hover:bg-white/72 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] dark:text-white/68 dark:hover:bg-white/12 dark:hover:text-white"
                        }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <ChevronRight
                        className={`h-3 w-3 transition duration-200 rtl:rotate-180 ${isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"}`}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="ms-auto hidden shrink-0 items-center gap-1 min-[1120px]:flex min-[1500px]:gap-2.5">
                {desktopActions}
                <HomeHeaderControls copy={copy.controls} />
              </div>

              <div className="ms-auto flex items-center gap-2 min-[1120px]:hidden">
                {isAuthenticated ? (
                  <Link href={cartHref} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-primary">
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {cartCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-black text-white rtl:-left-1 rtl:right-auto">{cartCount}</span> : null}
                    <span className="sr-only">{cartLabel}</span>
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-primary dark:hover:text-white"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={isArabic ? "فتح القائمة" : "Open menu"}
                >
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </SiteContainer>
        </div>
      </header>

      {portalReady ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
