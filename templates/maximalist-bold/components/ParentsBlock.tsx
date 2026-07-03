"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]"
      nameClassName="tmpl-display text-lg font-extrabold uppercase tracking-[-0.02em] md:text-xl"
    />
  );
}
