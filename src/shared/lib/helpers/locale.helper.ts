import { defaultLocale, defaultTheme } from "@/shared/lib/preferences";
import type { Locale, ThemeMode } from "@/shared/lib/types";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function resolveTheme(value: string | null | undefined): ThemeMode {
  return isThemeMode(value) ? value : defaultTheme;
}

export function getLocaleDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
