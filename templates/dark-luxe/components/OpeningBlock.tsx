"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-2xl font-light italic tracking-wide md:text-3xl"
      greetingClassName="mt-8 text-sm font-light leading-relaxed text-[var(--tmpl-muted)] md:text-base"
      ruleClassName="dl-gold-rule mx-auto my-8 w-24"
    />
  );
}
