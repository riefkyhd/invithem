"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import type { FooterProps } from "@/lib/types/wedding-data";
import { ShPrimaryButton } from "../ui";
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
    <footer className="bg-[var(--tmpl-inverse)] px-6 py-24 text-[var(--tmpl-accent-fg)] md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
        <p className="tmpl-display text-5xl font-light text-[var(--tmpl-accent)]">
          {data.couple.monogram}
        </p>

        <h2 className="tmpl-display mt-8 text-4xl font-light leading-tight">
          {data.couple.groomName.split(" ")[0]}
          <span className="mx-3 italic text-[var(--tmpl-accent)]">&</span>
          {data.couple.brideName.split(" ")[0]}
        </h2>

        {sustainability?.trim() && (
          <p className="tmpl-body mt-8 text-[10px] uppercase tracking-[0.25em] text-white/50">
            {sustainability}
          </p>
        )}

        <div className="sh-gold-rule mx-auto my-10 w-32 opacity-60" />

        <ShPrimaryButton
          type="button"
          onClick={handleShare}
          variant="outline"
          className="border-white/30 text-white hover:opacity-90"
        >
          {t("share")}
        </ShPrimaryButton>

        {data.footer.credit?.trim() && (
          <p className="tmpl-body mt-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
            {data.footer.credit}
          </p>
        )}
      </TemplateSectionReveal>
    </footer>
  );
}
