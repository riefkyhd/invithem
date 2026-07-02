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
      className="px-6 py-20 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-lg text-center">
        <span className="dl-ornament">◆</span>
        <p className="mt-6 text-[10px] font-light uppercase tracking-[0.4em] text-[var(--tmpl-muted)]">
          {t("dear")}
        </p>
        <h2 className="tmpl-display mt-4 text-4xl font-light tracking-wide md:text-5xl">
          {guestName}
        </h2>
        <div className="dl-gold-rule mx-auto mt-8 w-24" />
      </div>
    </TemplateSectionReveal>
  );
}
