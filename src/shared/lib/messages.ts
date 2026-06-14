import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export const messagesByLocale = {
  en,
  ar,
} as const;

export type AppMessages = typeof en;
