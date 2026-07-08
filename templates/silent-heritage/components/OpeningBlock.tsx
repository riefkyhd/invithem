"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function OpeningBlock({ data }: OpeningBlockProps) {
  const { locale } = useI18n();
  const greeting =
    locale === "id" ? data.opening.greetingId : data.opening.greetingEn;
  const quote = data.opening.quote?.trim();

  return (
    <section className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
        {quote && (
          <blockquote className="tmpl-display text-3xl font-light italic leading-snug text-[var(--tmpl-heading)] md:text-4xl">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
        {quote && greeting?.trim() && <div className="sh-gold-rule mx-auto my-10 w-24" />}
        {greeting?.trim() && (
          <p className="tmpl-body text-base leading-relaxed text-[var(--tmpl-muted)] md:text-lg">
            {greeting}
          </p>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
