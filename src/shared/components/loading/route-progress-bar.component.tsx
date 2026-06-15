"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingMotionStyles } from "./loading-motion-styles.component";

function getInternalAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLAnchorElement>("a[href]");
}

export function RouteProgressBar() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = getInternalAnchor(event.target);

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);

      if (nextUrl.origin !== window.location.origin || nextUrl.pathname === window.location.pathname) {
        return;
      }

      setIsActive(true);
    }

    window.addEventListener("click", handleClick, true);

    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    const timeout = window.setTimeout(() => setIsActive(false), 420);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timeout = window.setTimeout(() => setIsActive(false), 2400);

    return () => window.clearTimeout(timeout);
  }, [isActive]);

  return (
    <>
      <LoadingMotionStyles />
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        role="status"
        aria-live="polite"
        aria-hidden={!isActive}
      >
        <div className="h-1 overflow-hidden bg-primary-soft">
          <div className="route-progress-fill h-full rounded-r-full bg-primary shadow-[0_0_18px_rgba(29,23,213,0.45)]" />
        </div>
        <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border border-border/70 bg-surface/90 px-3 py-1 text-xs font-medium text-on-surface-variant shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/45" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Loading page...
        </div>
      </div>
    </>
  );
}
