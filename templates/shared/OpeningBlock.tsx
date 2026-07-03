"use client";

import { useI18n } from "@/lib/i18n/context";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

interface SharedOpeningBlockProps extends OpeningBlockProps {
  className?: string;
  quoteClassName?: string;
  greetingClassName?: string;
  ruleClassName?: string;
}

export function SharedOpeningBlock({
  data,
  className = "",
  quoteClassName = "tmpl-display text-2xl italic md:text-3xl",
  greetingClassName = "mt-6 text-base leading-relaxed text-[var(--tmpl-muted)] md:text-lg",
  ruleClassName = "mx-auto my-6 h-px w-16 bg-[var(--tmpl-accent)]/40",
}: SharedOpeningBlockProps) {
  const { locale } = useI18n();
  const greeting =
    locale === "id" ? data.opening.greetingId : data.opening.greetingEn;
  const quote = data.opening.quote?.trim();
  const hasContent = quote || greeting?.trim();

  if (!hasContent) return null;

  return (
    <section className={`px-6 py-16 md:px-12 lg:px-24 ${className}`}>
      <div className="mx-auto max-w-3xl text-center">
        {quote && <blockquote className={quoteClassName}>{quote}</blockquote>}
        {quote && greeting && <div className={ruleClassName} aria-hidden />}
        {greeting && <p className={greetingClassName}>{greeting}</p>}
      </div>
    </section>
  );
}
