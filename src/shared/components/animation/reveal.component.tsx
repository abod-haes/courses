"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MotionPresetName } from "@/shared/lib/animations/animation.type";
import { animationVariants } from "@/shared/lib/animations/animation-variants";

type RevealProps = Readonly<{
  children: React.ReactNode;
  preset?: MotionPresetName;
  className?: string;
  delay?: number;
}>;

export function Reveal({ children, preset = "fadeUp", className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={animationVariants[preset]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.18 }}
      transition={delay > 0 ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}
