"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";
import { BatikBorder } from "../assets/BatikBorder";
import { motion } from "../motion";

const DEFAULT_QUOTE_ID =
  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.";

export function OpeningBlock({ data }: OpeningBlockProps) {
  const { locale } = useI18n();
  const greeting =
    locale === "id" ? data.opening.greetingId : data.opening.greetingEn;
  const quote = data.opening.quote?.trim() || (locale === "id" ? DEFAULT_QUOTE_ID : "");

  if (!quote && !greeting?.trim()) return null;

  return (
    <section className="px-6 py-20 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <BatikBorder />
        <div className="bw-card px-6 py-12 text-center md:px-10">
          {quote && (
            <>
              <blockquote className="tmpl-display text-xl font-medium italic leading-relaxed text-[var(--tmpl-heading)] md:text-2xl">
                &ldquo;{quote}&rdquo;
              </blockquote>
              {locale === "id" && (
                <p className="tmpl-body mt-4 text-xs uppercase tracking-[0.25em] text-[var(--tmpl-accent)]">
                  QS. Ar-Rum: 21
                </p>
              )}
            </>
          )}
          {quote && greeting?.trim() && (
            <div className="mx-auto my-8 h-px w-16 bg-[var(--tmpl-accent)]/40" />
          )}
          {greeting?.trim() && (
            <p className="tmpl-body text-base leading-relaxed text-[var(--tmpl-muted)] md:text-lg">
              {greeting}
            </p>
          )}
        </div>
        <BatikBorder />
      </TemplateSectionReveal>
    </section>
  );
}
