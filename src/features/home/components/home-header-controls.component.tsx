"use client";

import { Globe2, MoonStar, SunMedium } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import type { HomeMessages } from "../home.types";

type HomeHeaderControlsProps = Readonly<{
  copy: HomeMessages["controls"];
}>;

export function HomeHeaderControls({ copy }: HomeHeaderControlsProps) {
  const { locale, theme, toggleLocale, toggleTheme } = usePreferences();
  const isDark = theme === "dark";
  const languageLabel = locale === "ar" ? "AR" : "EN";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? copy.toggleThemeLightAria : copy.toggleThemeDarkAria}
        title={isDark ? copy.toggleThemeLightAria : copy.toggleThemeDarkAria}
        className="group inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-primary/8 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/88 dark:hover:bg-white/16 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition duration-200 group-hover:bg-primary group-hover:text-white dark:bg-white/16 dark:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950" aria-hidden="true">
          {isDark ? <SunMedium className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
        </span>
      </button>

      <button
        type="button"
        onClick={toggleLocale}
        aria-label={copy.toggleLanguageAria}
        title={copy.toggleLanguageAria}
        className="group inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-primary/8 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/88 dark:hover:bg-white/16 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition duration-200 group-hover:rotate-12 group-hover:bg-primary group-hover:text-white dark:bg-white/16 dark:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950">
          <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="text-[0.68rem] tracking-[0.08em]" dir="ltr">
          {languageLabel}
        </span>
      </button>
    </div>
  );
}
