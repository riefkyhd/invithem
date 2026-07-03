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
      className="px-6 py-20 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-lg text-center">
        <span className="rh-ornament">✦</span>
        <p className="tmpl-body mt-6 text-xs font-light uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
          {prefix}
        </p>
        <h2 className="tmpl-display mt-4 text-4xl font-medium tracking-wide text-[var(--tmpl-fg)] md:text-5xl">
          {guestName}
        </h2>
        <div className="rh-double-rule mx-auto mt-8 w-28" />
      </div>
    </TemplateSectionReveal>
  );
}
