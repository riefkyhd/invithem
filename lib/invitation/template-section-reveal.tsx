"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TemplateMotionVariants } from "@/templates/types";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  motion: TemplateMotionVariants;
}

export function TemplateSectionReveal({
  children,
  className = "",
  delay = 0,
  motion: m,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={m.sectionReveal.initial}
      whileInView={m.sectionReveal.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...m.sectionReveal.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
