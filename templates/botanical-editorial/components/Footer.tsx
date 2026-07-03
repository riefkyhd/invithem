"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import type { FooterProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
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
    <>
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <TemplateSectionReveal motion={motion} className="text-center">
          <BotanicalDivider variant="sprig" drift className="mx-auto mb-8 opacity-50" />
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border-2 border-[var(--tmpl-accent)] bg-transparent px-8 py-3 text-sm text-[var(--tmpl-olive)] transition-colors hover:bg-[var(--tmpl-accent)]/10"
          >
            {t("share")}
          </button>
        </TemplateSectionReveal>
      </section>
      <footer className="border-t border-[var(--tmpl-card-border)]/30 px-6 py-12 text-center">
        <BotanicalDivider variant="leaves" className="mx-auto mb-6 h-14 w-16 opacity-40" />
        <p className="tmpl-display text-lg text-[var(--tmpl-muted)]">
          {data.couple.groomName} & {data.couple.brideName}
        </p>
        <p className="tmpl-body mt-2 text-xs uppercase tracking-[0.2em] text-[var(--tmpl-accent)]">
          {data.couple.monogram}
        </p>
        {sustainability?.trim() && (
          <p className="tmpl-body mx-auto mt-6 max-w-md text-xs uppercase tracking-wider text-[var(--tmpl-muted)]/70">
            {sustainability}
          </p>
        )}
        {data.footer.credit?.trim() && (
          <p className="tmpl-body mt-3 text-xs text-[var(--tmpl-muted)]/50">
            {data.footer.credit}
          </p>
        )}
      </footer>
    </>
  );
}
