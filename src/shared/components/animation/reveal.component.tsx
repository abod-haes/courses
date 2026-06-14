"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MotionPresetName } from "@/shared/lib/animations/animation.type";
import { animationVariants } from "@/shared/lib/animations/animation-variants";

type RevealProps = Readonly<{
  children: React.ReactNode;
  preset?: MotionPresetName;
  className?: string;
}>;

export function Reveal({ children, preset = "fadeUp", className }: RevealProps) {
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
    >
      {children}
    </motion.div>
  );
}
