"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { CoverHeroImage } from "@/templates/shared/CoverHeroImage";
import { BatikBorder } from "../assets/BatikBorder";
import { BwPrimaryButton } from "../ui";
import { motion as motionConfig } from "../motion";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80";

function ArchwayOverlay() {
  return (
    <svg
      viewBox="0 0 390 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 w-full text-[var(--tmpl-bg)]"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 120V60C0 60 48 8 195 8s195 52 195 52v60H0z"
      />
      <path
        fill="none"
        stroke="var(--tmpl-accent)"
        strokeWidth="1"
        strokeOpacity="0.35"
        d="M24 118 C72 72 120 48 195 48s123 24 171 70"
      />
    </svg>
  );
}

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
          className="fixed inset-0 z-50 flex min-h-screen cursor-pointer flex-col overflow-y-auto overscroll-y-contain bg-[var(--tmpl-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          role="button"
          tabIndex={0}
          aria-label={t("tapToOpen")}
        >
          <div className="relative h-[min(62vh,30rem)] w-full shrink-0 overflow-hidden">
            <CoverHeroImage
              src={heroImage}
              alt={`${data.couple.groomName} & ${data.couple.brideName}`}
              blendToTemplate={false}
              imageClassName="object-[center_25%]"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
              <div className="absolute inset-x-0 top-0 z-10 px-6 pt-10 text-center">
                <p className="tmpl-body text-[10px] font-semibold uppercase tracking-[0.35em] text-white/90">
                  {t("weddingOf")}
                </p>
                <h1 className="tmpl-display mx-auto mt-4 max-w-xs text-[clamp(1.75rem,8vw,2.75rem)] font-semibold leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]">
                  {data.couple.groomName.split(" ")[0]}
                  <span className="mx-2 font-normal text-[var(--tmpl-accent-secondary)]">&</span>
                  {data.couple.brideName.split(" ")[0]}
                </h1>
                <div className="mt-5 flex items-center justify-center gap-4">
                  <span className="tmpl-display text-3xl font-light text-white">{day}</span>
                  <div className="tmpl-body text-left text-xs uppercase tracking-[0.2em] text-white/90">
                    <p>{month}</p>
                    <p>{year}</p>
                  </div>
                </div>
              </div>
              <ArchwayOverlay />
            </CoverHeroImage>
          </div>

          <BatikBorder className="shrink-0 opacity-80" />

          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-10">
            {guestName && (
              <div className="bw-card space-y-2 p-6 text-center">
                <p className="tmpl-body text-sm text-[var(--tmpl-muted)]">{t("dear")}</p>
                <p className="tmpl-display break-words text-2xl text-[var(--tmpl-heading)]">
                  {guestName}
                </p>
              </div>
            )}
            <p className="tmpl-body mt-6 text-center text-base leading-relaxed text-[var(--tmpl-muted)]">
              {inviteLine}
            </p>
            <BwPrimaryButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="mt-8 w-full sm:mx-auto sm:w-fit"
            >
              {t("openInvitation")} →
            </BwPrimaryButton>
          </div>

          <BatikBorder className="shrink-0 opacity-60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
