"use client";

import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";

export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-6 left-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card/80 backdrop-blur-sm transition-colors hover:border-accent"
      aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
