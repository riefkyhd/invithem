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
  const sustainability =
    locale === "id"
      ? data.footer.sustainabilityId
      : data.footer.sustainabilityEn;

  function handleShare() {
    const message = `${shareMessage}\n\n${data.share.invitationUrl}`;
    const url = buildWhatsAppShareUrl(data.whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <footer className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-md">
        <div className="h-px w-full bg-black" />

        <TemplateSectionReveal motion={motion} className="mt-12 text-center">
          <p className="tmpl-display text-4xl leading-none text-[var(--tmpl-fg)]">
            {data.couple.groomName}
            <span className="mx-3 text-black/20">&</span>
            {data.couple.brideName}
          </p>

          <button
            type="button"
            onClick={handleShare}
            className="tmpl-body mt-10 text-[10px] uppercase tracking-[0.4em] text-[var(--tmpl-fg)] transition-opacity hover:opacity-60"
          >
            {t("share")}
          </button>

          {sustainability?.trim() && (
            <p className="tmpl-body mt-10 text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {sustainability}
            </p>
          )}
          {data.footer.credit?.trim() && (
            <p className="tmpl-body mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]/60">
              {data.footer.credit}
            </p>
          )}
        </TemplateSectionReveal>
      </div>
    </footer>
  );
}
