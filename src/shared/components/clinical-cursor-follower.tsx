"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const interactiveSelector = "a, button, input, textarea, select, [role='button'], [data-cursor='interactive']";

export function ClinicalCursorFollower() {
  const reduceMotion = Boolean(useReducedMotion());
  const rawX = useMotionValue(-80);
  const rawY = useMotionValue(-80);
  const x = useSpring(rawX, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 520, damping: 38, mass: 0.45 });
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [canUseCursor, setCanUseCursor] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const syncPointerSupport = () => setCanUseCursor(mediaQuery.matches);

    syncPointerSupport();
    mediaQuery.addEventListener("change", syncPointerSupport);

    return () => mediaQuery.removeEventListener("change", syncPointerSupport);
  }, [reduceMotion]);

  useEffect(() => {
    if (!canUseCursor || reduceMotion) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }

      rawX.set(event.clientX - 18);
      rawY.set(event.clientY - 18);
      setIsVisible(true);
      setIsInteractive(Boolean((event.target as Element | null)?.closest(interactiveSelector)));
    }

    function handlePointerLeave() {
      setIsVisible(false);
      setIsInteractive(false);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [canUseCursor, rawX, rawY, reduceMotion]);

  if (!canUseCursor || reduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden h-9 w-9 rounded-full transition-opacity duration-200 lg:block ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ x, y }}
    >
      <span
        className={`absolute inset-0 rounded-full border border-primary/30 bg-primary/[0.055] shadow-[0_0_22px_rgba(29,23,213,0.16)] backdrop-blur-[1px] transition-transform duration-200 dark:border-white/32 dark:bg-white/[0.08] dark:shadow-[0_0_24px_rgba(255,255,255,0.12)] ${
          isInteractive ? "scale-125" : "scale-100"
        }`}
      />
      <span
        className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_16px_rgba(29,23,213,0.3)] transition-transform duration-200 dark:bg-white dark:shadow-[0_0_16px_rgba(255,255,255,0.22)] ${
          isInteractive ? "scale-75" : "scale-100"
        }`}
      />
    </motion.div>
  );
}
