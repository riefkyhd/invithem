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
    <footer className="px-8 py-20 md:px-16 md:py-24 lg:px-24">
      <div className="h-px w-full bg-[var(--tmpl-fg)]" />

      <TemplateSectionReveal motion={motion} className="mt-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="tmpl-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
            {data.couple.groomName}
            <span className="mx-2 text-[var(--tmpl-fg)]">&</span>
            {data.couple.brideName}
          </p>
          <button
            type="button"
            onClick={handleShare}
            className="self-start border-b border-[var(--tmpl-fg)] pb-1 text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-60 md:self-auto"
          >
            {t("share")}
          </button>
        </div>
      </TemplateSectionReveal>
    </footer>
  );
}
