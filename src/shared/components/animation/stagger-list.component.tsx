"use client";

import { Children } from "react";
import { motion, useReducedMotion } from "framer-motion";

type StaggerListProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function StaggerList({ children, className }: StaggerListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.18 }}>
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.24, ease: "easeOut", delay: index * 0.06 },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
