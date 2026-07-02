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
      className="px-6 py-16 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-3xl border-l-2 border-[var(--tmpl-accent)] pl-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
          {t("dear")}
        </p>
        <h2 className="tmpl-display mt-2 text-3xl md:text-4xl">{guestName}</h2>
      </div>
    </TemplateSectionReveal>
  );
}
