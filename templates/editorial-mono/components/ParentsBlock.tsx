"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="text-[10px] uppercase tracking-[0.35em] text-[var(--tmpl-muted)]"
      nameClassName="tmpl-display text-lg font-medium uppercase tracking-[-0.02em] md:text-xl"
    />
  );
}
