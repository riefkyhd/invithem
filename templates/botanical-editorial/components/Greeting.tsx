"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { t } = useI18n();
  const guestName = data.guest?.name;

  if (!guestName) return null;

  return (
    <section className="botanical-section px-6 py-16 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-2xl text-center">
        <BotanicalDivider variant="leaves" drift className="mx-auto mb-8 opacity-70" />
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--tmpl-accent)]">
          {t("dear")}
        </p>
        <h2 className="tmpl-display mt-3 text-3xl text-[var(--tmpl-fg)] md:text-4xl">
          {guestName}
        </h2>
        <BotanicalDivider variant="sprig" className="mx-auto mt-10 opacity-50" />
      </TemplateSectionReveal>
    </section>
  );
}
