"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import { getBookAccessFromApi, type BookAccessResponse } from "@/features/checkout/checkout.api";
import { ApiError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const defaultBackendOrigin = "https://medical-courses.mustafafares.com";
const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);
const invalidBookPagePaths = new Set(["/books", "/courses", "/articles", "/library", "/checkout", "/login", "/register"]);
const debugPrefix = "[book-download]";

type Status = "loading" | "redirecting" | "error";

type BookDownloadRedirectProps = Readonly<{
  bookId: string;
}>;

class InvalidBookAccessUrlError extends Error {
  constructor() {
    super("invalid_external_book_access_url");
    this.name = "InvalidBookAccessUrlError";
  }
}

function logDebug(message: string, details?: unknown): void {
  if (details === undefined) {
    console.log(debugPrefix, message);
    return;
  }

  console.log(debugPrefix, message, details);
}

function logWarn(message: string, details?: unknown): void {
  if (details === undefined) {
    console.warn(debugPrefix, message);
    return;
  }

  console.warn(debugPrefix, message, details);
}

function logError(message: string, error: unknown): void {
  console.error(debugPrefix, message, error);
}

function isLocalHost(hostname: string): boolean {
  return localHosts.has(hostname) || hostname.endsWith(".localhost");
}

function backendOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || defaultBackendOrigin;
  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = url.pathname.replace(/\/api\/?$/i, "").replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    const origin = url.toString().replace(/\/+$/, "");
    logDebug("resolved backend origin", { configured, origin });
    return origin;
  } catch (error) {
    logWarn("failed to resolve backend origin, using default", { configured, defaultBackendOrigin, error });
    return defaultBackendOrigin;
  }
}

function normalizeExternalAccessUrl(accessUrl: string): string {
  const value = accessUrl.trim();
  if (!value) {
    logWarn("external access URL is empty");
    return "";
  }

  try {
    const url = new URL(value, backendOrigin());
    const before = url.toString();

    if (isLocalHost(url.hostname)) {
      const productionOrigin = new URL(backendOrigin());
      url.protocol = productionOrigin.protocol;
      url.host = productionOrigin.host;
      logWarn("external access URL had localhost and was normalized", { before, after: url.toString() });
    }

    return url.toString();
  } catch (error) {
    logWarn("failed to normalize external access URL", { value, error });
    return value;
  }
}

function isInvalidExternalBookUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const result = url.port === "5173" || invalidBookPagePaths.has(pathname) || (pathname.startsWith("/books/") && !pathname.includes("/file"));

    logDebug("validated external access URL", {
      url: value,
      hostname: url.hostname,
      port: url.port || null,
      pathname,
      isInvalid: result,
    });

    return result;
  } catch (error) {
    logWarn("external access URL is malformed", { value, error });
    return true;
  }
}

function normalizeAccessUrl(access: BookAccessResponse): string {
  const accessUrl = access.accessUrl.trim();
  logDebug("normalizing access URL", {
    bookId: access.bookId,
    accessType: access.accessType,
    rawAccessUrl: access.accessUrl,
    expiresAt: access.expiresAt,
  });

  if (!accessUrl) return "";

  if (access.accessType === "external_url") {
    const url = normalizeExternalAccessUrl(accessUrl);
    if (!url || isInvalidExternalBookUrl(url)) {
      logWarn("rejected invalid external book URL", {
        bookId: access.bookId,
        rawAccessUrl: access.accessUrl,
        normalizedUrl: url,
      });
      throw new InvalidBookAccessUrlError();
    }

    return url;
  }

  if (accessUrl.startsWith("/")) {
    try {
      const url = new URL(accessUrl, backendOrigin()).toString();
      logDebug("normalized relative signed URL", { rawAccessUrl: accessUrl, normalizedUrl: url });
      return url;
    } catch (error) {
      logWarn("failed to normalize relative signed URL", { rawAccessUrl: accessUrl, error });
      return accessUrl;
    }
  }

  logDebug("using signed URL as returned by backend", { accessUrl });
  return accessUrl;
}

function errorMessage(error: unknown, isArabic: boolean): string {
  if (error instanceof InvalidBookAccessUrlError) {
    return isArabic
      ? "رابط ملف الكتاب المخزن في الباك إند غير صحيح. الرابط الحالي يفتح صفحة من الموقع وليس ملف كتاب. عدّل رابط ملف الكتاب من الداشبورد أو ارفع ملف الكتاب نفسه."
      : "The stored book file URL is invalid. It points to a website page, not a book file. Update the book file URL in the dashboard or upload the book file.";
  }

  if (error instanceof ApiError) {
    if (error.status === 401) return isArabic ? "انتهت الجلسة. سجل الدخول مرة أخرى لتحميل الكتاب." : "Your session expired. Sign in again to download the book.";
    if (error.status === 403) return isArabic ? "لا يوجد وصول لهذا الكتاب من هذا الحساب." : "This account does not have access to this book.";
    if (error.status === 404) return isArabic ? "ملف الكتاب غير متاح أو غير مرفوع على الباك إند." : "The book file is not available on the backend.";
  }

  return isArabic ? "تعذر تجهيز رابط تحميل الكتاب. جرّب مرة أخرى أو راجع إعدادات الملف." : "Could not prepare the book download link. Try again or check the file setup.";
}

export function BookDownloadRedirect({ bookId }: BookDownloadRedirectProps) {
  const { locale } = usePreferences();
  const isArabic = locale === "ar";
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState(isArabic ? "يتم تجهيز رابط تحميل الكتاب..." : "Preparing the book download link...");
  const [downloadUrl, setDownloadUrl] = useState("");

  const copy = useMemo(
    () => ({
      title: isArabic ? "تحميل الكتاب" : "Download Book",
      loading: isArabic ? "يتم تجهيز رابط تحميل الكتاب..." : "Preparing the book download link...",
      redirecting: isArabic ? "تم تجهيز الرابط، سيتم بدء التحميل الآن..." : "The link is ready. Your download will start now...",
      retry: isArabic ? "إعادة المحاولة" : "Retry",
      manualDownload: isArabic ? "فتح رابط التحميل" : "Open download link",
      backToLibrary: isArabic ? "العودة إلى المكتبة" : "Back to Library",
    }),
    [isArabic],
  );

  useEffect(() => {
    let cancelled = false;

    async function startDownload() {
      setStatus("loading");
      setMessage(copy.loading);
      setDownloadUrl("");

      logDebug("start", {
        bookId,
        locale,
        pageUrl: window.location.href,
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? null,
      });

      try {
        logDebug("requesting access from backend", { bookId, locale });
        const access = await getBookAccessFromApi(bookId, locale);
        logDebug("backend access response", access);

        const url = normalizeAccessUrl(access);
        logDebug("final download URL", { url });

        if (!url) {
          logWarn("final download URL is empty", { access });
          throw new Error("Book access URL is empty.");
        }

        if (cancelled) {
          logWarn("download flow cancelled before redirect", { url });
          return;
        }

        setDownloadUrl(url);
        setStatus("redirecting");
        setMessage(copy.redirecting);
        logDebug("redirecting browser", { url });
        window.location.replace(url);
      } catch (error) {
        if (cancelled) return;
        logError("failed", error);
        if (error instanceof ApiError) {
          logError("api error details", {
            status: error.status,
            message: error.message,
            details: error.details,
          });
        }
        setStatus("error");
        setMessage(errorMessage(error, isArabic));
      }
    }

    startDownload();

    return () => {
      cancelled = true;
      logDebug("cleanup", { bookId });
    };
  }, [bookId, copy.loading, copy.redirecting, isArabic, locale]);

  return (
    <div className="min-h-full bg-section-bg px-4 py-14 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-lg rounded-[24px] border border-border/70 bg-surface p-6 text-center shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
          {status === "loading" || status === "redirecting" ? <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" /> : <Download className="h-7 w-7" aria-hidden="true" />}
        </span>

        <h1 className="mt-5 text-2xl font-black text-foreground">{copy.title}</h1>
        <p className="mt-3 text-sm leading-7 text-foreground/64">{message}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {status === "error" ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-strong"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              {copy.retry}
            </button>
          ) : null}

          {downloadUrl ? (
            <a href={downloadUrl} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-white/86 px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/8 dark:border-white/10 dark:bg-white/8 dark:text-[#dbe1ff]">
              <Download className="h-4 w-4" aria-hidden="true" />
              {copy.manualDownload}
            </a>
          ) : null}

          <Button href="/library?tab=books" variant="secondary" className="rounded-full sm:col-span-2">
            {copy.backToLibrary}
          </Button>
        </div>
      </Card>
    </div>
  );
}
