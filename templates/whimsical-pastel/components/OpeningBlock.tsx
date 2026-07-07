"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";
import { LeafIcon } from "../assets/LeafIcon";
import { motion } from "../motion";

export function OpeningBlock({ data }: OpeningBlockProps) {
  const { locale } = useI18n();
  const greeting =
    locale === "id" ? data.opening.greetingId : data.opening.greetingEn;

  return (
    <section className="px-5 pb-8 pt-12 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <LeafIcon />
        <h2 className="tmpl-display text-5xl italic leading-tight tracking-tight text-[var(--tmpl-heading)]">
          {locale === "id" ? (
            <>
              Undangan
              <br />
              Pernikahan
            </>
          ) : (
            <>
              Wedding
              <br />
              Invitation
            </>
          )}
        </h2>
        {greeting?.trim() && (
          <p className="tmpl-body max-w-md text-lg leading-relaxed text-[var(--tmpl-muted)]">
            {greeting}
          </p>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
