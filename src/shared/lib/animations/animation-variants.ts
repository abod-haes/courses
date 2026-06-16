import type { Variants } from "framer-motion";
import type { MotionPresetName } from "./animation.type";

export const animationVariants: Record<MotionPresetName, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  },
  slideUp: {
    hidden: { y: 18 },
    visible: { y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  slideDown: {
    hidden: { y: -18 },
    visible: { y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  slideLeft: {
    hidden: { x: 20 },
    visible: { x: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  slideRight: {
    hidden: { x: -20 },
    visible: { x: 0, transition: { duration: 0.28, ease: "easeOut" } },
  },
  cardStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  },
  softScale: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: "easeOut" } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } },
  },
  fadeScale: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: "easeOut" } },
  },
  successPulse: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.24, ease: "easeOut" } },
  },
  drawerSlide: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.24, ease: "easeOut" } },
  },
};
