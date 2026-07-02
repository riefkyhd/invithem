"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { motion as motionConfig } from "../motion";

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const formattedDate = format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", {
    locale: dateLocale,
  });

  function handleOpen() {
    setMusicStarted(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-[var(--tmpl-bg)] px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              The Wedding of
            </p>
            <h1 className="tmpl-display text-[clamp(2.5rem,12vw,5rem)] leading-[1.05] tracking-tight">
              {data.couple.groomName}
              <span className="mx-3 text-[var(--tmpl-accent)]">&</span>
              {data.couple.brideName}
            </h1>
            <p className="mt-8 text-sm uppercase tracking-widest text-[var(--tmpl-muted)]">
              {formattedDate}
            </p>
          </motion.div>
          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-3"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-12 w-px bg-[var(--tmpl-accent)]/50" />
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {t("tapToOpen")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
