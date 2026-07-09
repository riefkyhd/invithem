"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { locale } = useI18n();
  const guestName = data.guest?.name;
  if (!guestName) return null;

  const prefix =
    locale === "id"
      ? `${data.opening.formalAddressId || "Bapak/Ibu"}`
      : "The Honorable";
  const note =
    locale === "id"
      ? "Dengan penuh hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan kami."
      : "With deepest respect, we invite you to join us and bless our union with your presence.";

  return (
    <section className="bg-[var(--tmpl-surface)] px-6 py-20 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
        <p className="tmpl-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--tmpl-accent)]">
          {locale === "id" ? "Salam Hormat" : "With Honor"}
        </p>
        <div className="mx-auto mt-6 h-px w-12 bg-[var(--tmpl-accent-secondary)]" />

        <div className="mt-8 space-y-1">
          <p className="tmpl-display text-xl italic text-[var(--tmpl-muted)]">{prefix}</p>
          <p className="tmpl-display break-words text-3xl font-semibold text-[var(--tmpl-heading)]">
            {guestName}
          </p>
        </div>

        <p className="tmpl-body mt-8 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {note}
        </p>
      </TemplateSectionReveal>
    </section>
  );
}
