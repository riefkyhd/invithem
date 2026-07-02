import type { TemplateMotionVariants } from "@/templates/types";

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  coverExit: {
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};
