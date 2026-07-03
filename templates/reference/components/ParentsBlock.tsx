"use client";

import { SharedParentsBlock } from "@/templates/shared/ParentsBlock";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

export function ParentsBlock({ data }: ParentsBlockProps) {
  return <SharedParentsBlock data={data} />;
}
