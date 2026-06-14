"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import type { Locale, ThemeMode } from "@/shared/lib/types";
import { defaultLocale, defaultTheme, localeCookieName, readCookieValue, themeCookieName } from "@/shared/lib/preferences";
import { getLocaleDirection, resolveLocale, resolveTheme } from "@/shared/lib/helpers/locale.helper";

type PreferencesContextValue = {
  locale: Locale;
  theme: ThemeMode;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [locale, theme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      locale,
      theme,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        persistPreference(localeCookieName, nextLocale);
        startTransition(() => router.refresh());
      },
      toggleLocale: () => {
        const nextLocale = locale === "en" ? "ar" : "en";
        setLocaleState(nextLocale);
        persistPreference(localeCookieName, nextLocale);
        startTransition(() => router.refresh());
      },
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        persistPreference(themeCookieName, nextTheme);
      },
      toggleTheme: () => {
        setThemeState((current) => {
          const nextTheme = current === "light" ? "dark" : "light";
          persistPreference(themeCookieName, nextTheme);
          return nextTheme;
        });
      },
    }),
    [locale, router, startTransition, theme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const storedLocale =
    readCookieValue(window.document.cookie, localeCookieName) ?? window.localStorage.getItem(localeCookieName);

  return resolveLocale(storedLocale);
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme =
    readCookieValue(window.document.cookie, themeCookieName) ?? window.localStorage.getItem(themeCookieName);

  return resolveTheme(storedTheme);
}

function persistPreference(name: string, value: string) {
  window.localStorage.setItem(name, value);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider.");
  }

  return context;
}
