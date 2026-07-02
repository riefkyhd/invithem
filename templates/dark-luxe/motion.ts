import type { TemplateMotionVariants } from "@/templates/types";

const ease = [0.25, 0.1, 0.25, 1] as const;

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease },
  },
  coverExit: {
    transition: { duration: 0.8, ease },
  },
};
