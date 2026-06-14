"use client";

import { Globe2, MoonStar, Settings2, SunMedium } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/preferences-provider";

export function HomeHeaderControls() {
  const { locale, theme, toggleLocale, toggleTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isArabic = locale === "ar";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="group inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-border/60 bg-background text-primary transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Settings2 className="h-3.5 w-3.5 transition duration-200 group-hover:rotate-45" aria-hidden="true" />
        <span className="sr-only">{isArabic ? "الإعدادات" : "Settings"}</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={isArabic ? "الإعدادات" : "Settings"}
          className="theme-menu-panel absolute end-0 top-[calc(100%+0.55rem)] z-[60] w-56 overflow-hidden rounded-[10px] border border-border/60 bg-background/98 backdrop-blur-md motion-safe:animate-[fade-up_160ms_ease-out_both]"
        >
          <div className="border-b border-border/60 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/70">{isArabic ? "الواجهة" : "Interface"}</p>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                toggleLocale();
                setOpen(false);
              }}
              className="group flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2.5 text-left text-sm text-foreground/78 transition duration-200 hover:bg-primary/6 hover:text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/8 text-primary transition duration-200 group-hover:scale-105">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-5">{isArabic ? "اللغة" : "Language"}</span>
                <span className="block text-[11px] text-foreground/50">{locale === "en" ? "English" : "العربية"}</span>
              </span>
              <span className="rounded-[8px] bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {locale === "en" ? "EN" : "AR"}
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="group mt-1 flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2.5 text-left text-sm text-foreground/78 transition duration-200 hover:bg-primary/6 hover:text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/8 text-primary transition duration-200 group-hover:scale-105">
                {theme === "dark" ? <SunMedium className="h-3.5 w-3.5" aria-hidden="true" /> : <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-5">{isArabic ? "المظهر" : "Theme"}</span>
                <span className="block text-[11px] text-foreground/50">{theme === "dark" ? (isArabic ? "داكن" : "Dark") : isArabic ? "فاتح" : "Light"}</span>
              </span>
              <span className="rounded-[8px] bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {theme === "dark" ? "DARK" : "LIGHT"}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
