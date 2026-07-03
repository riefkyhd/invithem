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
    <footer className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="rh-monogram-frame">
            <span className="tmpl-display text-3xl font-medium tracking-[0.15em] text-[var(--tmpl-accent)]">
              {data.couple.monogram}
            </span>
          </div>

          <div className="rh-double-rule mt-10 w-full max-w-xs" />

          <p className="tmpl-display mt-8 text-xl font-medium tracking-wide text-[var(--tmpl-fg)]">
            {data.couple.groomName}
            <span className="mx-3 text-[var(--tmpl-gold)]">&</span>
            {data.couple.brideName}
          </p>

          <div className="rh-embroidery-line mt-8 w-32" />
          <div className="rh-gold-rule mt-3 w-24" />

          <button
            type="button"
            onClick={handleShare}
            className="mt-10 border border-[var(--tmpl-gold)] px-8 py-3 text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-fg)] transition-colors hover:bg-[var(--tmpl-surface)]"
          >
            {t("share")}
          </button>

          {sustainability?.trim() && (
            <p className="tmpl-body mt-10 max-w-xs text-[10px] font-light uppercase tracking-[0.25em] text-[var(--tmpl-muted)]/70">
              {sustainability}
            </p>
          )}
          {data.footer.credit?.trim() && (
            <p className="tmpl-body mt-3 text-[10px] font-light tracking-[0.2em] text-[var(--tmpl-muted)]/50">
              {data.footer.credit}
            </p>
          )}
        </div>
      </TemplateSectionReveal>
    </footer>
  );
}
