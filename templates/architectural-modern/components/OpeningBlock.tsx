"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em]"
      greetingClassName="mt-6 text-sm leading-relaxed text-[var(--tmpl-muted)] md:text-base"
      ruleClassName="mx-auto my-8 h-px w-full max-w-xs bg-[var(--tmpl-grid)]"
    />
  );
}
