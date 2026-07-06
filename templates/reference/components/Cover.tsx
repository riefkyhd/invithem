"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { CoverProps } from "@/lib/types/wedding-data";
import { motion as motionConfig } from "../motion";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80";

function coupleHashtag(groom: string, bride: string) {
  const g = groom.trim().split(/\s+/)[0] ?? "";
  const b = bride.trim().split(/\s+/)[0] ?? "";
  return `#${g}${b}Journey`;
}

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const formattedDate = format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", {
    locale: dateLocale,
  });
  const heroImage = data.gallery[0]?.url ?? DEFAULT_HERO;
  const guestName = data.guest?.name;
  const inviteLines =
    locale === "id"
      ? [
          "DENGAN PENUH SUKACITA KAMI MENGUNDANG ANDA",
          "UNTUK BERBAGI KEBAHAGIAAN DAN MERAYAKAN",
          "AWAL PERJALANAN HIDUP KAMI BERSAMA.",
        ]
      : [
          "WE INVITE YOU TO SHARE IN OUR",
          "JOY AND CELEBRATE THE",
          "BEGINNING OF OUR NEW LIFE",
          "TOGETHER.",
        ];

  function handleOpen() {
    setMusicStarted(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex min-h-screen flex-col bg-[var(--tmpl-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionConfig.coverExit.transition}
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={t("tapToOpen")}
        >
          <div className="relative h-[min(58vh,28rem)] w-full shrink-0 overflow-hidden">
            <Image
              src={heroImage}
              alt={`${data.couple.groomName} & ${data.couple.brideName}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--tmpl-bg)]/40 to-[var(--tmpl-bg)]" />
            <div className="absolute inset-x-0 top-12 px-6 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#634235]/80">
                {t("weddingOf")}
              </p>
              <h1 className="tmpl-display mt-2 text-4xl uppercase tracking-[0.2em] text-[#634235]">
                {data.couple.groomName.split(" ")[0]} &{" "}
                {data.couple.brideName.split(" ")[0]}
              </h1>
            </div>
          </div>

          <div className="-mt-16 relative z-10 flex flex-1 flex-col rounded-t-[3rem] bg-[var(--tmpl-bg)] px-8 pb-8 pt-12 shadow-[0_-20px_25px_rgba(0,0,0,0.05)]">
            <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-8">
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--tmpl-gold)]">
                  {t("saveTheDate")}
                </p>
                <p className="tmpl-display text-2xl text-[#634235]">{formattedDate}</p>
              </div>

              <div className="h-px w-12 bg-[var(--tmpl-gold)]/40" />

              {guestName && (
                <div className="space-y-2 text-center">
                  <p className="tmpl-display text-lg italic text-[var(--tmpl-muted)]">
                    {t("dear")}
                  </p>
                  <p className="tmpl-display text-3xl text-[#634235]">{guestName}</p>
                </div>
              )}

              <div className="space-y-0 text-center text-[10px] uppercase tracking-[0.12em] text-[#634235]/70">
                {inviteLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#634235] px-10 py-4 text-xs uppercase tracking-[0.12em] text-[var(--tmpl-bg)] shadow-lg transition-opacity hover:opacity-90"
              >
                {t("openInvitation")}
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M2 3h12v10H2z" />
                  <path d="M2 5l6 4 6-4" />
                </svg>
              </button>
            </div>

            <div className="mt-auto pt-8 text-center">
              <div className="mx-auto mb-4 h-px w-8 bg-[var(--tmpl-gold)]/30" />
              <p className="tmpl-display text-xs italic text-[#9ca3af]">
                {coupleHashtag(data.couple.groomName, data.couple.brideName)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
