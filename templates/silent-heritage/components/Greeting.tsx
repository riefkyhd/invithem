"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { SculpturalCurve } from "../ui";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { locale } = useI18n();
  const guestName = data.guest?.name;
  if (!guestName) return null;

  const prefix =
    locale === "id"
      ? `${data.opening.formalAddressId || "Bapak/Ibu"}`
      : "The Honorable";
  const dateLocale = locale === "id" ? idLocale : enUS;
  const formattedDate = format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", {
    locale: dateLocale,
  });
  const note =
    locale === "id"
      ? "Kehadiran Anda selalu menjadi bagian penting perjalanan kami. Kami menantikan hari istimewa ini bersama Anda."
      : "Your presence has always been a cornerstone of our journey. We look forward to creating new memories with you on this auspicious day.";

  return (
    <section className="relative bg-[var(--tmpl-surface)] pb-20 pt-0">
      <SculpturalCurve className="-mt-px text-[var(--tmpl-bg)]" />
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg px-6 pt-12 md:px-8">
        <p className="tmpl-body text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
          {locale === "id" ? "Salam Pribadi" : "Personal Greeting"}
        </p>
        <div className="mt-4 h-px w-full bg-[var(--tmpl-card-border)]" />

        <div className="mt-8 space-y-2">
          <p className="tmpl-display text-2xl italic text-[var(--tmpl-muted)]">{prefix}</p>
          <p className="tmpl-display text-2xl text-[var(--tmpl-heading)]">{guestName}</p>
        </div>

        <p className="tmpl-body mt-8 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {note}
        </p>

        <div className="mt-10 flex items-start gap-4 border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-5">
          <span className="text-[var(--tmpl-accent)]" aria-hidden>
            ✦
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {locale === "id" ? "Tanggal Acara" : "Ceremony Date"}
            </p>
            <p className="tmpl-body mt-1 text-sm text-[var(--tmpl-fg)]">{formattedDate}</p>
          </div>
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
