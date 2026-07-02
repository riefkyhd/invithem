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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="rh-monogram-frame">
              <span className="tmpl-display text-5xl font-medium tracking-[0.2em] text-[var(--tmpl-accent)] md:text-6xl">
                {data.couple.monogram}
              </span>
            </div>

            <div className="rh-double-rule mt-12 w-40" />

            <p className="tmpl-body mt-10 text-xs font-light uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
              The Wedding of
            </p>

            <h1 className="tmpl-display mt-5 text-[clamp(1.75rem,8vw,3.25rem)] font-medium leading-tight tracking-wide text-[var(--tmpl-fg)]">
              {data.couple.groomName}
            </h1>
            <span className="tmpl-display my-2 text-xl text-[var(--tmpl-gold)]">&</span>
            <h1 className="tmpl-display text-[clamp(1.75rem,8vw,3.25rem)] font-medium leading-tight tracking-wide text-[var(--tmpl-fg)]">
              {data.couple.brideName}
            </h1>

            <div className="rh-embroidery-line mt-10 w-48" />
            <div className="rh-gold-rule mt-3 w-32" />

            <p className="tmpl-body mt-8 text-sm font-light tracking-wide text-[var(--tmpl-muted)]">
              {formattedDate}
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <span className="rh-ornament">✦</span>
            <p className="text-[10px] font-light uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
              {t("tapToOpen")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
