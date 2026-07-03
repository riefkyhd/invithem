"use client";

import { SharedOpeningBlock } from "@/templates/shared/OpeningBlock";
import type { OpeningBlockProps } from "@/lib/types/wedding-data";

export function OpeningBlock({ data }: OpeningBlockProps) {
  return (
    <SharedOpeningBlock
      data={data}
      quoteClassName="tmpl-display text-2xl italic md:text-3xl"
      greetingClassName="mt-6 text-base leading-relaxed text-[var(--tmpl-muted)] md:text-lg"
    />
  );
}
