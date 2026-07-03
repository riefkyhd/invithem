"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-[clamp(1.75rem,4vw,3rem)] font-medium uppercase leading-[1.1] tracking-[-0.03em]"
      greetingClassName="mt-8 text-sm uppercase leading-relaxed tracking-[0.2em] text-[var(--tmpl-muted)]"
      ruleClassName="mx-auto my-8 h-px w-16 bg-[var(--tmpl-fg)]"
    />
  );
}
