"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { formatWeddingDate } from "@/lib/invitation/template-utils";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { motion as motionConfig } from "../motion";

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const formattedDate = formatWeddingDate(data.weddingDate, locale);

  function handleOpen() {
    setMusicStarted(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col justify-between bg-[var(--tmpl-bg)] px-8 py-16 md:px-16 md:py-24"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-10 text-[10px] uppercase tracking-[0.4em] text-[var(--tmpl-muted)]">
              The Wedding of
            </p>
            <h1 className="tmpl-display text-[clamp(3.5rem,14vw,8rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">
              <span className="block">{data.couple.groomName}</span>
              <span className="mt-2 block text-[var(--tmpl-muted)]">&</span>
              <span className="mt-2 block">{data.couple.brideName}</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-end justify-between"
          >
            <p className="max-w-xs text-xs uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {formattedDate}
            </p>
            <div className="text-right">
              <div className="mb-3 h-px w-16 bg-[var(--tmpl-fg)]" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {t("tapToOpen")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
