"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";

const slowFade = { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] as const };
const hairlineDraw = { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const };

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
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={slowFade}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--tmpl-accent)]">
              <span className="tmpl-display text-4xl font-light tracking-[0.15em] text-[var(--tmpl-accent)]">
                {data.couple.monogram}
              </span>
            </div>

            <div className="dl-gold-rule mt-10 w-32" />

            <p className="mt-10 text-[10px] font-light uppercase tracking-[0.4em] text-[var(--tmpl-muted)]">
              The Wedding of
            </p>

            <h1 className="tmpl-display mt-4 text-[clamp(2rem,10vw,4rem)] font-light leading-tight tracking-wide">
              {data.couple.groomName}
            </h1>
            <span className="tmpl-display my-2 text-lg text-[var(--tmpl-accent)]">&</span>
            <h1 className="tmpl-display text-[clamp(2rem,10vw,4rem)] font-light leading-tight tracking-wide">
              {data.couple.brideName}
            </h1>

            <motion.div
              className="mt-10 h-px bg-[var(--tmpl-accent)]"
              initial={{ width: "8rem", opacity: 1 }}
              exit={{ width: "min(100vw, 32rem)", opacity: 0 }}
              transition={hairlineDraw}
            />

            <p className="mt-8 text-xs font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {formattedDate}
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="dl-ornament">◆</span>
            <p className="text-[10px] font-light uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
              {t("tapToOpen")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
