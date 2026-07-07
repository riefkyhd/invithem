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

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#7b5455]" fill="currentColor" aria-hidden>
      <path d="M12 21s-8-5.2-8-11.2C4 6.9 6.5 5 9 5c1.7 0 3.3.9 4 2.3C13.7 5.9 15.3 5 17 5c2.5 0 5 1.9 5 4.8C22 15.8 12 21 12 21z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 18 21" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M1 4h16v13H1z" />
      <path d="M1 6l8 5 8-5" />
    </svg>
  );
}

export function Cover({ data, opened, onOpen }: CoverProps) {
  const { locale, t } = useI18n();
  const { setMusicStarted } = useTheme();
  const dateLocale = locale === "id" ? idLocale : enUS;
  const heroImage = data.gallery[0]?.url ?? DEFAULT_HERO;
  const guestName = data.guest?.name;
  const groomFirst = data.couple.groomName.split(" ")[0];
  const brideFirst = data.couple.brideName.split(" ")[0];
  const formattedDate = format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", {
    locale: dateLocale,
  });
  const inviteMessage =
    locale === "id"
      ? data.opening.greetingId ||
        `Save the Date: ${formattedDate}. Kami mengundang Anda untuk berbagi kebahagiaan memulai bab baru hidup kami.`
      : data.opening.greetingEn ||
        `Save the Date: ${formattedDate}. We invite you to share in our joy as we begin our new chapter together.`;

  function handleOpen() {
    setMusicStarted(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex min-h-screen cursor-pointer flex-col overflow-y-auto bg-[var(--tmpl-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionConfig.coverExit.transition}
          onClick={handleOpen}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          role="button"
          tabIndex={0}
          aria-label={t("tapToOpen")}
        >
          <div className="pointer-events-none absolute left-1.5 top-[4.5rem] w-32 opacity-60" aria-hidden>
            <svg viewBox="0 0 128 70" className="w-full text-[var(--tmpl-sage)]" fill="currentColor">
              <ellipse cx="30" cy="50" rx="22" ry="14" opacity="0.35" />
              <ellipse cx="55" cy="35" rx="18" ry="28" opacity="0.5" />
              <ellipse cx="78" cy="48" rx="20" ry="12" opacity="0.35" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-24 right-9 w-32 rotate-180 opacity-60" aria-hidden>
            <svg viewBox="0 0 128 70" className="w-full text-[var(--tmpl-sage)]" fill="currentColor">
              <ellipse cx="30" cy="50" rx="22" ry="14" opacity="0.35" />
              <ellipse cx="55" cy="35" rx="18" ry="28" opacity="0.5" />
              <ellipse cx="78" cy="48" rx="20" ry="12" opacity="0.35" />
            </svg>
          </div>

          <div className="relative mx-auto flex w-full max-w-md flex-col gap-12 px-5 pb-16 pt-24">
            <div className="relative rounded-[2rem] bg-white p-3 shadow-[0_30px_60px_-12px_rgba(123,84,85,0.08),0_18px_36px_-18px_rgba(79,100,78,0.12)]">
              <div className="relative aspect-[326/407] w-full overflow-hidden rounded-md">
                <Image
                  src={heroImage}
                  alt={`${data.couple.groomName} & ${data.couple.brideName}`}
                  fill
                  priority
                  sizes="(max-width: 448px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-[var(--tmpl-blush)] shadow-lg backdrop-blur-sm"
                aria-hidden
              >
                <HeartIcon />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <span className="rounded-full border border-[rgba(79,100,78,0.1)] bg-[rgba(141,163,138,0.2)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--tmpl-heading)]">
                {locale === "id" ? "Undangan Pernikahan" : "Wedding Invitation"}
              </span>

              <h1 className="tmpl-display text-4xl text-[var(--tmpl-fg)]">
                {groomFirst}{" "}
                <span className="italic text-[var(--tmpl-accent-secondary)]">&</span> {brideFirst}
              </h1>

              {guestName && (
                <p className="tmpl-body text-lg text-[var(--tmpl-muted)]">
                  {t("dear")}{" "}
                  <span className="font-semibold text-[var(--tmpl-fg)]">{guestName}</span>
                </p>
              )}

              <blockquote className="w-full rounded-[2rem] border-l-4 border-[rgba(79,100,78,0.3)] bg-[var(--tmpl-card)] px-7 py-6 text-center text-base italic leading-relaxed text-[var(--tmpl-muted)]">
                &ldquo;{inviteMessage}&rdquo;
              </blockquote>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="mt-2 inline-flex items-center gap-3 rounded-full bg-[var(--tmpl-accent)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.05em] text-white shadow-[0_10px_15px_-3px_rgba(79,100,78,0.2)] transition-opacity hover:opacity-90"
              >
                {t("openInvitation")}
                <EnvelopeIcon />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
