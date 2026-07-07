"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { CoverHeroImage } from "@/templates/shared/CoverHeroImage";
import { motion as motionConfig } from "../motion";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80&sat=-100";

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const heroImage = data.gallery[0]?.url ?? DEFAULT_HERO;
  const guestName = data.guest?.name;
  const groomFirst = data.couple.groomName.split(" ")[0].toUpperCase();
  const brideFirst = data.couple.brideName.split(" ")[0].toUpperCase();
  const inviteLine =
    locale === "id"
      ? data.opening.greetingId ||
        "Kami mengundang Anda untuk menyaksikan awal bab baru hidup kami bersama."
      : data.opening.greetingEn ||
        "We invite you to witness the beginning of our new chapter together.";

  function handleOpen() {
    setMusicStarted(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex min-h-screen cursor-pointer flex-col bg-[var(--tmpl-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          role="button"
          tabIndex={0}
          aria-label={t("tapToOpen")}
        >
          <div className="relative h-[min(58vh,33rem)] w-full shrink-0">
            <CoverHeroImage src={heroImage} alt={`${data.couple.groomName} & ${data.couple.brideName}`}>
              <div className="absolute bottom-6 left-6 z-10 text-white">
                <p className="tmpl-body text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  {t("weddingOf")}
                </p>
                <h1 className="tmpl-display mt-2 text-5xl leading-none tracking-tight">
                  {groomFirst} &<br />
                  {brideFirst}
                </h1>
              </div>
            </CoverHeroImage>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 py-10">
            {guestName ? (
              <div className="space-y-2">
                <p className="tmpl-body text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tmpl-muted)]">
                  {locale === "id" ? "Kepada" : "Dear"}
                </p>
                <p className="tmpl-display text-[2rem] leading-tight tracking-wide text-black">
                  {guestName}
                </p>
              </div>
            ) : null}
            <p className="tmpl-body mt-6 max-w-sm text-lg leading-relaxed text-[var(--tmpl-muted)]">
              {inviteLine}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="relative mt-8 inline-flex w-fit overflow-hidden border border-black bg-black px-10 py-5"
            >
              <span className="absolute inset-x-0 bottom-0 top-[57px] bg-white" aria-hidden />
              <span className="relative tmpl-body text-xs font-semibold uppercase tracking-[0.12em] text-white">
                {t("openInvitation")}
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
