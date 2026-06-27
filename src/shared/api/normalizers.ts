import type { Locale } from "@/shared/lib/types";

export type RawRecord = Record<string, unknown>;

export function rawObject(value: unknown): RawRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : null;
}

export function localizedText(value: unknown, fallback = "", locale: Locale = "en"): string {
  if (typeof value === "string" && value.trim()) return value.trim();

  const record = rawObject(value);
  if (record) {
    const preferred = localizedText(record[locale], "", locale);
    if (preferred) return preferred;

    const english = localizedText(record.en, "", "en");
    if (english) return english;

    const arabic = localizedText(record.ar, "", "ar");
    if (arabic) return arabic;
  }

  return fallback;
}

export function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

export function currencyCode(value: unknown, fallback = "USD"): string {
  const normalized = localizedText(value, fallback, "en").toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : fallback;
}

export function formatMoney(value: unknown, currency: unknown, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const amount = numberValue(value, 0);

  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: currencyCode(currency),
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    ...options,
  }).format(amount);
}

export function absoluteMediaUrl(value: unknown, fallback: string, backendOrigin = "https://medical-courses.mustafafares.com"): string {
  const url = localizedText(value);

  if (!url) return fallback;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
}
