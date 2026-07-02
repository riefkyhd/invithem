"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import type { FooterProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Footer({ data }: FooterProps) {
  const { locale, t } = useI18n();

  const shareMessage =
    locale === "id" ? data.share.messageId : data.share.messageEn;

  function handleShare() {
    const message = `${shareMessage}\n\n${data.share.invitationUrl}`;
    const url = buildWhatsAppShareUrl(data.whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <footer className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--tmpl-accent)]">
            <span className="tmpl-display text-2xl font-light tracking-[0.12em] text-[var(--tmpl-accent)]">
              {data.couple.monogram}
            </span>
          </div>

          <div className="dl-gold-rule mt-8 w-full max-w-xs" />

          <p className="tmpl-display mt-8 text-xl font-light tracking-wide">
            {data.couple.groomName}
            <span className="mx-3 text-[var(--tmpl-accent)]">&</span>
            {data.couple.brideName}
          </p>

          <div className="dl-gold-rule mt-8 w-full max-w-xs" />

          <button
            type="button"
            onClick={handleShare}
            className="mt-10 border border-[var(--tmpl-accent)]/40 px-8 py-3 text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-accent)] transition-colors hover:border-[var(--tmpl-accent)] hover:bg-[var(--tmpl-accent)]/5"
          >
            {t("share")}
          </button>
        </div>
      </TemplateSectionReveal>
    </footer>
  );
}
