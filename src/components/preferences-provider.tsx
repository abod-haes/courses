"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import type { Locale, ThemeMode } from "@/shared/lib/types";
import { localeCookieName, themeCookieName } from "@/shared/lib/preferences";
import { getLocaleDirection } from "@/shared/lib/helpers/locale.helper";

type PreferencesContextValue = {
  locale: Locale;
  theme: ThemeMode;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

type PreferencesProviderProps = Readonly<{
  children: React.ReactNode;
  initialLocale: Locale;
  initialTheme: ThemeMode;
}>;

export function PreferencesProvider({ children, initialLocale, initialTheme }: PreferencesProviderProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);

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
