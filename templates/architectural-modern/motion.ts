import type { TemplateMotionVariants } from "@/templates/types";

export const motion: TemplateMotionVariants = {
  sectionReveal: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  coverExit: {
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
};
