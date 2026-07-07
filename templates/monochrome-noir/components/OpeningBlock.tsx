"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function OpeningBlock({ data }: OpeningBlockProps) {
  const { locale } = useI18n();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const formatted = format(new Date(data.weddingDate), "dd . MM . yy", {
    locale: dateLocale,
  });
  const quote = data.opening.quote?.trim();
  const groomFirst = data.couple.groomName.split(" ")[0];
  const brideFirst = data.couple.brideName.split(" ")[0];

  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-8">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none tmpl-display text-[clamp(6rem,28vw,16rem)] font-normal uppercase leading-none text-[var(--tmpl-fg)] opacity-[0.03]"
        aria-hidden
      >
        UNION
      </div>

      <TemplateSectionReveal motion={motion} className="relative mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
        <p className="tmpl-body text-base tracking-[0.6em] text-black/60">
          {locale === "id" ? "PERPADUAN DUA JIWA" : "THE UNION OF SOULS"}
        </p>

        <div>
          <p className="tmpl-display text-6xl italic leading-none text-[var(--tmpl-fg)]">
            {groomFirst}
          </p>
          <p className="tmpl-display my-4 text-3xl text-black/20">&</p>
          <p className="tmpl-display text-6xl font-bold leading-none text-[var(--tmpl-fg)]">
            {brideFirst}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="h-px w-16 bg-black" />
          <p className="tmpl-body text-base tracking-[0.4em] text-[var(--tmpl-fg)]">
            {formatted}
          </p>
          <div className="h-px w-16 bg-black" />
        </div>

        {quote && (
          <>
            <blockquote className="tmpl-display max-w-lg text-2xl italic leading-relaxed text-[var(--tmpl-fg)]">
              &ldquo;{quote}&rdquo;
            </blockquote>
            {data.footer.credit?.trim() && (
              <p className="tmpl-body text-base tracking-[0.4em] text-[var(--tmpl-fg)] opacity-40">
                — {data.footer.credit}
              </p>
            )}
          </>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
