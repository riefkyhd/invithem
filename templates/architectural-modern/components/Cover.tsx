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
          className="fixed inset-0 z-50 flex cursor-pointer flex-col bg-[var(--tmpl-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <div className="tmpl-grid-bg absolute inset-0 opacity-40" aria-hidden />

          <div className="relative z-10 flex flex-1 flex-col border border-[var(--tmpl-grid)]">
            <div className="grid flex-1 grid-cols-12 grid-rows-6 border-b border-[var(--tmpl-grid)]">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-12 row-span-4 flex flex-col justify-center border-b border-[var(--tmpl-grid)] px-8 py-12 md:col-span-8 md:row-span-5 md:border-r md:px-16"
              >
                <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
                  The Wedding of
                </p>
                <h1 className="tmpl-display text-[clamp(2.5rem,10vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--tmpl-accent)]">
                  <span className="block">{data.couple.groomName}</span>
                  <span className="my-2 block text-[0.35em] font-normal tracking-[0.2em] text-[var(--tmpl-fg)]">
                    &
                  </span>
                  <span className="block">{data.couple.brideName}</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-12 row-span-2 flex items-center border-[var(--tmpl-grid)] px-8 py-8 md:col-span-4 md:row-span-3 md:border-l-0 md:px-10"
              >
                <div className="border border-[var(--tmpl-grid)] bg-[var(--tmpl-bg)] px-6 py-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                    Date
                  </p>
                  <p className="tmpl-display mt-2 text-sm font-semibold tracking-[-0.02em] text-[var(--tmpl-accent)] md:text-base">
                    {formattedDate}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-12 row-span-1 flex items-center justify-between border-t border-[var(--tmpl-grid)] px-8 py-6 md:col-span-8 md:px-16"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
                  {data.couple.monogram}
                </span>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[var(--tmpl-grid)]" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent)]">
                    {t("tapToOpen")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
