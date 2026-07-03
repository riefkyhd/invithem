"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return (
    <SharedParentsBlock
      data={data}
      labelClassName="text-xs uppercase tracking-[0.2em] text-[var(--tmpl-accent)]"
      nameClassName="tmpl-display text-lg text-[var(--tmpl-fg)] md:text-xl"
    />
  );
}
