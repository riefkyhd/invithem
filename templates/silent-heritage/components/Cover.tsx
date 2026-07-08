"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { CoverHeroImage } from "@/templates/shared/CoverHeroImage";
import { ShPrimaryButton } from "../ui";
import { motion as motionConfig } from "../motion";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80";

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const heroImage = data.gallery[0]?.url ?? DEFAULT_HERO;
  const guestName = data.guest?.name;
  const weddingDate = new Date(data.weddingDate);
  const day = format(weddingDate, "dd", { locale: dateLocale });
  const month = format(weddingDate, "MMM", { locale: dateLocale }).toUpperCase();
  const year = format(weddingDate, "yyyy", { locale: dateLocale });
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
          <div className="relative min-h-[58vh] w-full shrink-0">
            <CoverHeroImage
              src={heroImage}
              alt={`${data.couple.groomName} & ${data.couple.brideName}`}
            >
              <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 pt-24 text-white">
                <p className="tmpl-body text-[10px] font-medium uppercase tracking-[0.3em] text-white/80">
                  {t("weddingOf")}
                </p>
                <h1 className="tmpl-display mt-3 text-5xl font-light leading-none tracking-wide">
                  {data.couple.groomName.split(" ")[0]} &{" "}
                  {data.couple.brideName.split(" ")[0]}
                </h1>

                <div className="mt-8 flex items-start gap-6">
                  <div className="tmpl-display text-4xl font-light leading-none">
                    {day}
                  </div>
                  <div className="tmpl-body space-y-1 text-sm uppercase tracking-[0.2em] text-white/85">
                    <p>{month}</p>
                    <p>{year}</p>
                  </div>
                </div>
              </div>
            </CoverHeroImage>
          </div>

          <div className="flex flex-1 flex-col px-6 py-10">
            {guestName && (
              <div className="space-y-2">
                <p className="tmpl-body text-sm text-[var(--tmpl-muted)]">{t("dear")}</p>
                <p className="tmpl-display text-3xl text-[var(--tmpl-heading)]">{guestName}</p>
              </div>
            )}
            <p className="tmpl-body mt-6 max-w-sm text-base leading-relaxed text-[var(--tmpl-muted)]">
              {inviteLine}
            </p>
            <ShPrimaryButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="mt-8 w-fit"
            >
              {t("openInvitation")}
            </ShPrimaryButton>
          </div>

          <div className="flex justify-center pb-8" aria-hidden>
            <div className="h-16 w-px bg-[var(--tmpl-accent)]/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
