"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="tmpl-body text-[10px] font-light uppercase tracking-[0.35em] text-[var(--tmpl-muted)]"
      nameClassName="tmpl-display text-lg font-medium italic tracking-wide text-[var(--tmpl-fg)] md:text-xl"
    />
  );
}
