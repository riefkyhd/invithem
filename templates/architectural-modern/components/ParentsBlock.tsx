"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--tmpl-muted)]"
      nameClassName="tmpl-display text-lg font-semibold tracking-[-0.03em] md:text-xl"
    />
  );
}
