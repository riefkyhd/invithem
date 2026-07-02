"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/dictionary";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  function toggle() {
    setLocale(locale === "id" ? "en" : "id");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 left-6 z-40 rounded-full border border-card-border bg-card/80 px-4 py-2 text-xs uppercase tracking-wider backdrop-blur-sm transition-colors hover:border-accent"
      aria-label="Toggle language"
    >
      {(locale === "id" ? "en" : "id") as Locale}
    </button>
  );
}
