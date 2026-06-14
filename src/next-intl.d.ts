import type en from "@/messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: "en" | "ar";
    Messages: typeof en;
  }
}
