import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "@/shared/lib/preferences";
import { messagesByLocale } from "@/shared/lib/messages";
import type { Locale } from "@/shared/lib/types";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale === "ar" || locale === "en" ? (locale as Locale) : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messagesByLocale[resolvedLocale],
  };
});
