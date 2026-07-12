"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LibraryBig, LogIn, LogOut, Menu, ShoppingCart, X } from "lucide-react";
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
  return "/checkout";
}

export function HomeHeader({ copy }: HomeHeaderProps) {
  const { locale } = usePreferences();
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartHref, setCartHref] = useState("/checkout");

  const homeLabel = copy.navigation.home ?? (isArabic ? "الرئيسية" : "Home");
  const cartLabel = isArabic ? "السلة" : "Cart";
  const libraryLabel = isArabic ? "مكتبتي" : "My Library";
  const logoutLabel = isArabic ? "تسجيل الخروج" : "Logout";
  const loggingOutLabel = isArabic ? "جاري الخروج..." : "Logging out...";

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
    if (!menuOpen && !logoutDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, logoutDialogOpen]);

  const resolveNavState = (href: string) => {
    const itemPath = normalizePath(href || "/");
    const activePath = normalizePath(pathname || "/");
    if (itemPath === "/") return activePath === "/" && currentHash === "";
    return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
  };

  function requestLogout() {
    if (isLoggingOut) return;
    setMenuOpen(false);
    setLogoutDialogOpen(true);
  }

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setMenuOpen(false);
      setLogoutDialogOpen(false);
      setIsAuthenticated(false);
      setCartCount(0);
      setCartHref("/checkout");
      setIsLoggingOut(false);
      if (window.location.pathname !== "/") window.location.assign("/");
    }
  }

  const authAction = authReady ? (
    isAuthenticated ? (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/15 bg-red-500/5 text-red-600 transition duration-200 hover:-translate-y-0.5 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25 dark:text-red-300"
        onClick={requestLogout}
        disabled={isLoggingOut}
        aria-label={isLoggingOut ? loggingOutLabel : logoutLabel}
        title={isLoggingOut ? loggingOutLabel : logoutLabel}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    ) : (
      <Button href="/login" variant="primary" size="sm" className="rounded-full px-3 shadow-[0_8px_22px_rgba(0,74,198,0.14)]">
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {copy.actions.signIn}
      </Button>
    )
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-[100] shrink-0 overflow-visible bg-gradient-to-b from-background via-background/96 to-background/90 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl dark:from-slate-950 dark:via-slate-950/96 dark:to-slate-950/90 dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-80 dark:via-white/14" />
        <SiteContainer>
          <div className="flex min-h-[3.15rem] items-center gap-1 py-1.5 min-[1500px]:min-h-[3.35rem] min-[1500px]:gap-2 min-[1500px]:py-2">
            <Link href="/" className="flex shrink-0 items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span className="relative block h-[1.85rem] w-[6.75rem] sm:w-[7rem] min-[1500px]:h-8 min-[1500px]:w-[8rem]">
                <Image alt={`${copy.brand} logo`} src="/images/logo-blue.png" fill priority sizes="(max-width: 640px) 108px, (max-width: 1500px) 112px, 128px" className="object-contain object-left drop-shadow-[0_8px_18px_rgba(15,23,42,0.06)] dark:brightness-0 dark:invert" />
              </span>
              <span className="sr-only">{copy.brand}</span>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1240px]:flex min-[1500px]:gap-1">
              {navItems.map((item) => {
                const isActive = resolveNavState(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center rounded-md px-2.5 py-1.5 text-[0.66rem] font-semibold leading-none transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-[1500px]:px-3 min-[1500px]:py-2 min-[1500px]:text-[0.84rem] ${isActive ? "bg-primary !text-white shadow-[0_10px_26px_rgba(0,74,198,0.18)]" : "text-foreground/68 hover:bg-white/72 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] dark:text-white/68 dark:hover:bg-white/12 dark:hover:text-white"}`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <ChevronRight className={`ms-1 h-3 w-3 transition duration-200 rtl:rotate-180 ${isActive ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"}`} aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>

            <div className="ms-auto hidden shrink-0 items-center gap-1 min-[1120px]:flex min-[1500px]:gap-2">
              {isAuthenticated ? (
                <>
                  <Button href="/library" variant="secondary" size="sm" className="rounded-full px-3">
                    <LibraryBig className="h-4 w-4" aria-hidden="true" />
                    <span>{libraryLabel}</span>
                  </Button>
                  <Link href={cartHref} aria-label={cartLabel} title={cartLabel} className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white/86 text-primary shadow-[0_8px_22px_rgba(17,24,39,0.045)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary/8 dark:border-white/10 dark:bg-white/8 dark:text-[#dbe1ff]">
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {cartCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-black text-white rtl:-left-1 rtl:right-auto">{cartCount}</span> : null}
                  </Link>
                </>
              ) : null}
              {authAction}
              <HomeHeaderControls copy={copy.controls} />
            </div>

            <div className="ms-auto flex items-center gap-2 min-[1120px]:hidden">
              {isAuthenticated ? (
                <>
                  <Link href="/library" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-primary">
                    <LibraryBig className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{libraryLabel}</span>
                  </Link>
                  <Link href={cartHref} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-primary shadow-[0_10px_26px_rgba(15,23,42,0.08)] ring-1 ring-primary/14 transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white dark:bg-white/12 dark:text-white dark:ring-white/14 dark:hover:bg-primary">
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {cartCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-black text-white rtl:-left-1 rtl:right-auto">{cartCount}</span> : null}
                    <span className="sr-only">{cartLabel}</span>
                  </Link>
                </>
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
          <aside id="mobile-navigation" className={`fixed inset-y-0 ${isArabic ? "right-0 rounded-l-[1.2rem]" : "left-0 rounded-r-[1.2rem]"} flex w-[min(84vw,22rem)] flex-col border border-white/12 bg-white/95 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:bg-slate-950/95`}>
            <div className="flex items-center justify-between gap-3">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative block h-9 w-28">
                <Image alt={`${copy.brand} logo`} src="/images/logo-blue.png" fill sizes="112px" className="object-contain object-left rtl:object-right dark:brightness-0 dark:invert" />
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary transition hover:bg-primary hover:text-white" aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-8 grid gap-2">
              {navItems.map((item) => {
                const isActive = resolveNavState(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-primary text-white shadow-[0_12px_30px_rgba(0,74,198,0.16)]" : "bg-slate-100/80 text-foreground/76 hover:bg-primary/8 hover:text-primary dark:bg-white/8 dark:text-white/74"}`}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto grid gap-3 pt-8">
              {isAuthenticated ? (
                <>
                  <Button href="/library" variant="secondary" onClick={() => setMenuOpen(false)} className="w-full rounded-full">
                    <LibraryBig className="h-4 w-4" aria-hidden="true" />
                    {libraryLabel}
                  </Button>
                  <Button href={cartHref} variant="secondary" onClick={() => setMenuOpen(false)} className="w-full rounded-full">
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {cartLabel}{cartCount > 0 ? ` (${cartCount})` : ""}
                  </Button>
                </>
              ) : null}
              {authReady && !isAuthenticated ? (
                <Button href="/login" className="w-full rounded-full" onClick={() => setMenuOpen(false)}>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  {copy.actions.signIn}
                </Button>
              ) : null}
              {authReady && isAuthenticated ? (
                <button
                  type="button"
                  onClick={requestLogout}
                  disabled={isLoggingOut}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/15 bg-red-500/5 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-500/10 disabled:opacity-60 dark:text-red-300"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {isLoggingOut ? loggingOutLabel : logoutLabel}
                </button>
              ) : null}
              <div className="flex justify-center pt-1">
                <HomeHeaderControls copy={copy.controls} />
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {logoutDialogOpen ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <button type="button" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label={isArabic ? "إلغاء تسجيل الخروج" : "Cancel logout"} onClick={() => setLogoutDialogOpen(false)} />
          <div className="relative w-full max-w-sm rounded-[24px] border border-border bg-surface p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-300">
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="logout-title" className="mt-4 text-lg font-black text-foreground">
              {isArabic ? "تأكيد تسجيل الخروج" : "Confirm logout"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/64">
              {isArabic ? "هل تريد تسجيل الخروج من حسابك؟" : "Do you want to sign out of your account?"}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setLogoutDialogOpen(false)} disabled={isLoggingOut} className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground/70 transition hover:bg-foreground/5 disabled:opacity-60">
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60">
                {isLoggingOut ? loggingOutLabel : logoutLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
