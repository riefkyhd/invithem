"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="text-[10px] font-light uppercase tracking-[0.4em] text-[var(--tmpl-muted)]"
      nameClassName="tmpl-display text-lg font-light tracking-wide md:text-xl"
    />
  );
}
