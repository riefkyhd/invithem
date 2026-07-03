"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-2xl font-medium italic tracking-wide text-[var(--tmpl-fg)] md:text-3xl"
      greetingClassName="tmpl-body mt-8 text-base font-light leading-relaxed text-[var(--tmpl-muted)] md:text-lg"
      ruleClassName="rh-double-rule mx-auto my-8 w-28"
    />
  );
}
