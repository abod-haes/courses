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

function defaultFractionDigits(currency: string): number {
  if (["BIF", "CLP", "DJF", "GNF", "IQD", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"].includes(currency)) {
    return 0;
  }

  if (["BHD", "JOD", "KWD", "LYD", "OMR", "TND"].includes(currency)) {
    return 3;
  }

  return 2;
}

export function formatMoney(value: unknown, currency: unknown, locale: Locale, options?: Intl.NumberFormatOptions): string {
  const amount = numberValue(value, 0);
  const code = currencyCode(currency);
  const fallbackDigits = defaultFractionDigits(code);
  const numberOptions: Intl.NumberFormatOptions = { ...(options ?? {}) };
  delete numberOptions.style;
  delete numberOptions.currency;
  delete numberOptions.currencyDisplay;

  const minimumFractionDigits = options?.minimumFractionDigits ?? fallbackDigits;
  const maximumFractionDigits = options?.maximumFractionDigits ?? minimumFractionDigits;
  const formatterLocale = locale === "ar" ? "en-US-u-nu-latn" : "en-US";
  const formattedAmount = new Intl.NumberFormat(formatterLocale, {
    ...numberOptions,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  return code === "USD" ? `$${formattedAmount}` : `${code} ${formattedAmount}`;
}

export function absoluteMediaUrl(value: unknown, fallback: string, backendOrigin = "https://medical-courses.mustafafares.com"): string {
  const url = localizedText(value);

  if (!url) return fallback;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/") || /^https?:\/\//i.test(url)) return url;

  return `${backendOrigin}/${url.replace(/^\/+/, "")}`;
}

function mediaCandidate(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(mediaCandidate).find((candidate) => Boolean(localizedText(candidate)) || Boolean(rawObject(candidate))) ?? null;
  }

  const media = rawObject(value);
  if (!media) return value;

  return (
    media.url ??
    media.originalUrl ??
    media.original_url ??
    media.previewUrl ??
    media.preview_url ??
    media.sourceUrl ??
    media.source_url ??
    media.path ??
    media.fileUrl ??
    media.file_url ??
    value
  );
}

export function mediaUrl(value: unknown, fallback: string, backendOrigin?: string): string {
  return absoluteMediaUrl(mediaCandidate(value), fallback, backendOrigin);
}

export function mediaAlt(value: unknown, fallback: string, locale: Locale = "en"): string {
  const media = rawObject(Array.isArray(value) ? value.map(rawObject).find(Boolean) : value);
  return localizedText(media?.alt ?? media?.altText ?? media?.alt_text ?? media?.name, fallback, locale);
}
