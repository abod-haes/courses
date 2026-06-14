import { messagesByLocale } from "@/shared/lib/messages";
import type { Locale } from "@/shared/lib/types";
import type { HomeMessages } from "./home.types";

export function getHomeMessages(locale: Locale): HomeMessages {
  return messagesByLocale[locale].Home as HomeMessages;
}

