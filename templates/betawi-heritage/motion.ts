import type { TemplateMotionVariants } from "@/templates/types";

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  coverExit: {
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};
