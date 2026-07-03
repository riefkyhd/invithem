"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-[clamp(1.75rem,5vw,3rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]"
      greetingClassName="tmpl-body mt-8 text-base font-medium leading-relaxed text-[var(--tmpl-muted)] md:text-lg"
      ruleClassName="mx-auto my-8 h-1.5 w-24 bg-[var(--tmpl-coral)]"
    />
  );
}
