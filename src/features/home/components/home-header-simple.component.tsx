"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogIn, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/preferences-provider";
import { SiteContainer } from "@/shared/components/layout/site-container";
import { Button } from "@/shared/components/ui/button";
import { websiteSessionCookieName, websiteSessionKey } from "@/shared/api/website-session";
import { logoutUser } from "@/features/auth/api/auth.api";
import { readStoredCheckoutItems } from "@/features/checkout/checkout-storage";
import type { HomeMessages } from "../home.types";
import { HomeHeaderControls } from "./home-header-controls.component";

type HomeHeaderProps = Readonly<{ copy: HomeMessages }>;

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
  if (!firstItem) return "/checkout?empty=1";
  return `/checkout?itemType=${encodeURIComponent(firstItem.type)}&itemId=${encodeURIComponent(String(firstItem.id))}`;
}

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale } = usePreferences();
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartHref, setCartHref] = useState("/checkout?empty=1");

  const homeLabel = copy.navigation.home ?? (isArabic ? "الرئيسية" : "Home");
  const cartLabel = isArabic ? "السلة" : "Cart";
  const logoutLabel = isArabic ? "تسجيل الخروج" : "Logout";

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

  useEffect(() => {
    function syncSessionAndCart() {
      const session = window.localStorage.getItem(websiteSessionKey);
      const items = readStoredCheckoutItems();
      setIsAuthenticated(Boolean(session || hasSessionCookie()));
      setAuthReady(true);
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

  const resolveNavState = (href: string) => {
    const itemPath = normalizePath(href || "/");
    const activePath = normalizePath(pathname || "/");
    if (itemPath === "/") return activePath === "/" && currentHash === "";
    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setMenuOpen(false);
      setIsAuthenticated(false);
      setCartCount(0);
      setCartHref("/checkout?empty=1");
      setIsLoggingOut(false);
      if (window.location.pathname !== "/") window.location.assign("/");
    }
  }

  const authAction = authReady ? (
    isAuthenticated ? (
      <Button type="button" variant="secondary" size="sm" className="rounded-full px-3 text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10" onClick={handleLogout} disabled={isLoggingOut}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {isLoggingOut ? (isArabic ? "جاري الخروج..." : "Logging out...") : logoutLabel}
      </Button>
    ) : (
      <Button href="/login" variant="primary" size="sm" className="rounded-full px-3 shadow-[0_8px_22px_rgba(0,74,198,0.14)]">
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {copy.actions.signIn}
      </Button>
    )
  ) : null;

  return (
    <>
      <header className="relative z-50 shrink-0 overflow-visible bg-gradient-to-b from-background via-background/96 to-background/90 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl dark:from-slate-950 dark:via-slate-950/96 dark:to-slate-950/90 dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-80 dark:via-white/14" />
        <SiteContainer>
          <div className="flex min-h-[3.15rem] items-center gap-1 py-1.5 min-[1500px]:min-h-[3.35rem] min-[1500px]:gap-2 min-[1500px]:py-2">
            <Link href="/" className="flex shrink-0 items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span className="relative block h-[1.85rem] w-[6.75rem] sm:w-[7rem] min-[1500px]:h-8 min-[1500px]:w-[8rem]">
                <Image alt={`${copy.brand} logo`} src="/images/logo-blue.png" fill priority sizes="(max-width: 640px) 108px, (max-width: 1500px) 112px, 128px" className="object-contain object-left drop-shadow-[0_8px_18px_rgba(15,23,42,0.06)] dark:brightness-0 dark:invert" />
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
                    className={`group relative flex items-center rounded-md px-3 py-1.5 text-[0.66rem] font-semibold leading-none transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1280px]:text-[0.72rem] min-[1500px]:py-2 min-[1500px]:text-[0.84rem] ${isActive ? "bg-primary !text-white shadow-[0_10px_26px_rgba(0,74,198,0.18)]" : "text-foreground/68 hover:bg-white/72 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] dark:text-white/68 dark:hover:bg-white/12 dark:hover:text-white"}`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <ChevronRight className={`ms-1 h-3 w-3 transition duration-200 rtl:rotate-180 ${isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"}`} aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>

            <div className="ms-auto hidden shrink-0 items-center gap-1 min-[1120px]:flex min-[1500px]:gap-2.5">
              {isAuthenticated ? (
                <Button href={cartHref} variant="secondary" size="sm" className="relative rounded-full px-4">
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  <span>{cartLabel}</span>
                  {cartCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-black text-white rtl:-left-1 rtl:right-auto">{cartCount}</span> : null}
                </Button>
              ) : null}
              {authAction}
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
              <button type="button" onClick={() => setMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-primary" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={isArabic ? "فتح القائمة" : "Open menu"}>
                <Menu className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </SiteContainer>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[9999] min-[1120px]:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" className="absolute inset-0 bg-slate-950/46 backdrop-blur-[3px]" aria-label={isArabic ? "إغلاق القائمة" : "Close menu"} onClick={() => setMenuOpen(false)} />
          <aside id="mobile-navigation" className={`fixed inset-y-0 ${isArabic ? "right-0 rounded-l-[1.2rem] border-l" : "left-0 rounded-r-[1.2rem] border-r"} flex w-[min(86vw,21.5rem)] flex-col overflow-hidden border-white/65 bg-background/98 shadow-[0_26px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/98 dark:ring-white/12`}>
            <div className="flex items-center justify-between border-b border-border/60 bg-white/58 px-4 py-3.5 dark:border-white/10 dark:bg-white/6">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative block h-8 w-28 shrink-0">
                <Image alt={`${copy.brand} logo`} src="/images/logo-blue.png" fill sizes="112px" className="object-contain object-left dark:brightness-0 dark:invert" />
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/86 text-foreground/72 shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-border/60 transition hover:text-primary dark:bg-white/12 dark:text-white/82 dark:ring-white/12" aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <nav className="grid gap-2">
                {navItems.map((item) => {
                  const isActive = resolveNavState(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={isActive ? "page" : undefined} className={`flex items-center justify-between rounded-[0.95rem] px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-primary !text-white shadow-[0_12px_26px_rgba(0,74,198,0.18)]" : "bg-white/70 text-foreground/75 ring-1 ring-border/55 hover:bg-primary/8 hover:text-primary dark:bg-white/8 dark:text-white/74 dark:ring-white/10"}`}>
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-55 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-5 grid gap-3">
                {authReady ? (
                  isAuthenticated ? (
                    <Button type="button" variant="secondary" size="sm" className="w-full rounded-full text-red-600 dark:text-red-300" onClick={handleLogout} disabled={isLoggingOut}>
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {isLoggingOut ? (isArabic ? "جاري الخروج..." : "Logging out...") : logoutLabel}
                    </Button>
                  ) : (
                    <Button href="/login" variant="primary" size="sm" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      {copy.actions.signIn}
                    </Button>
                  )
                ) : null}
              </div>

              <div className="mt-5 rounded-[1.05rem] border border-border/60 bg-white/72 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6">
                <HomeHeaderControls copy={copy.controls} />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
