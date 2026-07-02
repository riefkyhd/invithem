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
          className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          {/* Diagonal color-block split */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, var(--tmpl-coral) 0%, var(--tmpl-coral) 48%, var(--tmpl-chartreuse) 48%, var(--tmpl-chartreuse) 72%, var(--tmpl-purple) 72%, var(--tmpl-purple) 100%)`,
            }}
          />
          <div
            className="absolute -right-[20%] top-[15%] h-[70%] w-[55%] rotate-12 bg-[var(--tmpl-purple)] opacity-40"
            aria-hidden
          />

          <div className="relative flex h-full flex-col justify-between px-6 py-12 md:px-12 md:py-16">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={motionConfig.sectionReveal.transition}
              className="tmpl-body text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--tmpl-fg)]"
            >
              The Wedding of
            </motion.p>

            <div className="relative flex-1 py-8 md:py-12">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionConfig.sectionReveal.transition, delay: 0.1 }}
                className="tmpl-display relative z-10 text-[clamp(3.5rem,16vw,9rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] text-[var(--tmpl-fg)]"
              >
                <span className="relative z-20 block translate-x-[2vw] md:translate-x-[4vw]">
                  {data.couple.groomName}
                </span>
                <span
                  className="relative z-30 -mt-2 block translate-x-[18vw] text-[var(--tmpl-purple)] md:-mt-4 md:translate-x-[22vw]"
                  aria-hidden
                >
                  &
                </span>
                <span className="relative z-10 -mt-4 block -translate-x-[1vw] text-[var(--tmpl-accent-fg)] mix-blend-difference md:-mt-6 md:-translate-x-[3vw]">
                  {data.couple.brideName}
                </span>
              </motion.h1>

              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...motionConfig.sectionReveal.transition, delay: 0.25 }}
                className="tmpl-display absolute right-0 top-1/2 z-0 -translate-y-1/2 text-[clamp(5rem,22vw,14rem)] font-black uppercase leading-none tracking-[-0.06em] text-[var(--tmpl-fg)] opacity-[0.07]"
                aria-hidden
              >
                {data.couple.monogram}
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionConfig.sectionReveal.transition, delay: 0.35 }}
              className="flex items-end justify-between gap-6"
            >
              <div className="mb-color-purple inline-block px-4 py-2">
                <p className="tmpl-body text-xs font-medium uppercase tracking-[0.2em]">
                  {formattedDate}
                </p>
              </div>
              <div className="text-right">
                <p className="tmpl-body text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--tmpl-fg)]">
                  {t("tapToOpen")}
                </p>
                <div className="mt-2 flex justify-end gap-1">
                  <span className="h-2 w-8 bg-[var(--tmpl-coral)]" />
                  <span className="h-2 w-8 bg-[var(--tmpl-chartreuse)]" />
                  <span className="h-2 w-8 bg-[var(--tmpl-purple)]" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
