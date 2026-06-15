"use client";

import { Globe2, MoonStar, SunMedium } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import type { HomeMessages } from "../home.types";

type HomeHeaderControlsProps = Readonly<{
  copy: HomeMessages["controls"];
}>;

export function HomeHeaderControls({ copy }: HomeHeaderControlsProps) {
  const { theme, toggleLocale, toggleTheme } = usePreferences();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLocale}
        aria-label={copy.toggleLanguageAria}
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-white/82 text-primary shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white/8 dark:focus-visible:ring-offset-slate-950"
      >
        <Globe2 className="h-4 w-4 transition-transform duration-300 hover:rotate-12" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? copy.toggleThemeLightAria : copy.toggleThemeDarkAria}
        className="group inline-flex h-10 min-w-[4.75rem] items-center gap-2 rounded-2xl border border-border/60 bg-white/82 px-2.5 text-primary shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white/8 dark:focus-visible:ring-offset-slate-950"
      >
        <span dir="ltr" className="relative flex h-6 w-11 items-center rounded-full border border-border/60 bg-surface-soft p-0.5 transition duration-300 group-hover:bg-primary/10">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(17,24,39,0.12)] transition duration-300 ${
              isDark ? "translate-x-5" : "translate-x-0"
            }`}
          >
            {isDark ? <SunMedium className="h-3.5 w-3.5" aria-hidden="true" /> : <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />}
          </span>
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.14em]">{isDark ? copy.dark : copy.light}</span>
      </button>
    </div>
  );
}
