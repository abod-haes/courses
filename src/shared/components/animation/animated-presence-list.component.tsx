"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { animationVariants } from "@/shared/lib/animations/animation-variants";

type AnimatedPresenceListProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function AnimatedPresenceList({ children, className }: AnimatedPresenceListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className={className}
        variants={animationVariants.fadeIn}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

