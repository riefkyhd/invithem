import type { TemplateMotionVariants } from "@/templates/types";

const ease = [0.25, 0.1, 0.25, 1] as const;

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease },
  },
  coverExit: {
    transition: { duration: 0.85, ease },
  },
};
