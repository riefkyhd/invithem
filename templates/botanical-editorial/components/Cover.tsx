"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { getGalleryImages } from "@/lib/invitation/template-utils";
import type { CoverProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion as motionConfig } from "../motion";

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const formattedDate = format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", {
    locale: dateLocale,
  });
  const coverImage = getGalleryImages(data)[0]?.url;

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
          exit={{ opacity: 0, scale: 1.01 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-8 h-52 w-52 overflow-hidden rounded-[3rem] shadow-lg shadow-[var(--tmpl-accent)]/15 md:h-64 md:w-64">
              <Image
                src={coverImage}
                alt={`${data.couple.groomName} & ${data.couple.brideName}`}
                fill
                sizes="256px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--tmpl-accent-secondary)]/20 to-transparent" />
            </div>

            <BotanicalDivider variant="branch" drift className="mb-6 opacity-80" />

            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              The Wedding of
            </p>
            <h1 className="tmpl-display text-[clamp(2rem,10vw,3.5rem)] leading-[1.15] text-[var(--tmpl-fg)]">
              {data.couple.groomName}
              <span className="mx-2 text-[var(--tmpl-accent-secondary)]">&</span>
              {data.couple.brideName}
            </h1>
            <p className="mt-6 text-sm tracking-wide text-[var(--tmpl-muted)]">
              {formattedDate}
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-14 flex flex-col items-center gap-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BotanicalDivider variant="sprig" className="opacity-60" />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
              {t("tapToOpen")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
