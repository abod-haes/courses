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
    <div className="flex items-center gap-1.5 rounded-full bg-white/70 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 backdrop-blur-xl dark:bg-white/10 dark:shadow-[0_12px_34px_rgba(0,0,0,0.2)] dark:ring-white/14">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? copy.toggleThemeLightAria : copy.toggleThemeDarkAria}
        className="group inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/88 dark:hover:bg-white/16 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
      >
        <span
          className="relative flex h-7 w-12 items-center justify-start rounded-full bg-slate-900/[0.06] p-0.5 transition duration-300 group-hover:bg-primary/12 dark:bg-white/16 dark:group-hover:bg-white/22"
          dir="ltr"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.16)] transition duration-300 ${
              isDark ? "translate-x-5 bg-white text-slate-950" : "translate-x-0 bg-primary text-white"
            }`}
          >
            {isDark ? <SunMedium className="h-3.5 w-3.5" aria-hidden="true" /> : <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />}
          </span>
        </span>
        <span className="hidden text-xs sm:inline">{isDark ? copy.dark : copy.light}</span>
      </button>

      <span className="h-6 w-px bg-slate-200/80 dark:bg-white/12" aria-hidden="true" />

      <button
        type="button"
        onClick={toggleLocale}
        aria-label={copy.toggleLanguageAria}
        className="group inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/88 dark:hover:bg-white/16 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition duration-300 group-hover:rotate-12 group-hover:bg-primary group-hover:text-white dark:bg-white/16 dark:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950">
          <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="text-xs tracking-[0.08em]" dir="ltr">
          {languageLabel}
        </span>
      </button>
    </div>
  );
}
