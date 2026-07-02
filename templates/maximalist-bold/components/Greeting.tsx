"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { t } = useI18n();
  const guestName = data.guest?.name;

  if (!guestName) return null;

  return (
    <TemplateSectionReveal
      motion={motion}
      className="relative overflow-hidden px-6 py-20 md:px-12 md:py-28"
    >
      <div
        className="absolute -left-[10%] top-[20%] h-48 w-[70%] -rotate-3 bg-[var(--tmpl-chartreuse)]"
        aria-hidden
      />
      <div className="relative z-10 ml-[6vw] max-w-2xl">
        <p className="tmpl-body mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--tmpl-purple)]">
          {t("dear")}
        </p>
        <h2 className="tmpl-display text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]">
          {guestName}
        </h2>
        <div className="mt-8 flex gap-2">
          <span className="h-1.5 w-16 bg-[var(--tmpl-coral)]" />
          <span className="h-1.5 w-10 bg-[var(--tmpl-purple)]" />
        </div>
      </div>
    </TemplateSectionReveal>
  );
}
