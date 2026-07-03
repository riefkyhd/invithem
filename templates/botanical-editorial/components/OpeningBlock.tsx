"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-2xl italic leading-relaxed text-[var(--tmpl-fg)] md:text-3xl"
      greetingClassName="tmpl-body mt-6 text-base leading-relaxed text-[var(--tmpl-muted)] md:text-lg"
      ruleClassName="mx-auto my-8 h-px w-24 bg-[var(--tmpl-accent)]/50"
    />
  );
}
