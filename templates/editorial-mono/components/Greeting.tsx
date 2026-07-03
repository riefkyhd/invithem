"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { locale, t } = useI18n();
  const guestName = data.guest?.name;

  if (!guestName) return null;

  const prefix =
    locale === "id"
      ? `${t("dear")} ${data.opening.formalAddressId}`
      : t("dear");

  return (
    <TemplateSectionReveal
      motion={motion}
      className="px-8 py-24 md:px-16 md:py-32 lg:px-24"
    >
      <div className="ml-[8vw] max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
          {prefix}
        </p>
        <h2 className="tmpl-display mt-4 text-[clamp(2rem,6vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-[-0.03em]">
          {guestName}
        </h2>
        <div className="mt-8 h-px w-24 bg-[var(--tmpl-fg)]" />
      </div>
    </TemplateSectionReveal>
  );
}
