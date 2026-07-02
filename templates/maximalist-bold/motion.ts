import type { TemplateMotionVariants } from "@/templates/types";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: spring,
  },
  coverExit: {
    transition: spring,
  },
};
