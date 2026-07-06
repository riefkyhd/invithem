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
    <footer className="border-t border-[var(--tmpl-card-border)] px-6 py-16 text-center">
      <TemplateSectionReveal motion={motion}>
        <button
          type="button"
          onClick={handleShare}
          className="mb-10 rounded-full border border-[var(--tmpl-card-border)] bg-white px-6 py-3 text-sm text-[var(--tmpl-heading)] transition-colors hover:border-[var(--tmpl-gold)]"
        >
          {t("share")}
        </button>

        <p className="tmpl-display text-2xl text-[var(--tmpl-heading)]">
          {data.couple.groomName.split(" ")[0]} & {data.couple.brideName.split(" ")[0]}
        </p>

        {sustainability?.trim() && (
          <p className="mx-auto mt-6 max-w-md text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
            {sustainability}
          </p>
        )}

        {data.footer.credit?.trim() && (
          <p className="mt-4 text-xs text-[var(--tmpl-muted)]">{data.footer.credit}</p>
        )}
      </TemplateSectionReveal>
    </footer>
  );
}
