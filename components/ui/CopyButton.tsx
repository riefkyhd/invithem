"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className = "" }: CopyButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-full border border-card-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
