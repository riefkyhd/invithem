"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import type { FooterProps } from "@/lib/types/wedding-data";
import { BatikBorder } from "../assets/BatikBorder";
import { BwPrimaryButton } from "../ui";
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
    <footer className="bg-[var(--tmpl-inverse)] px-6 py-24 text-white md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
        <h2 className="tmpl-display break-words text-[clamp(1.75rem,7vw,2.5rem)] font-semibold leading-tight">
          {data.couple.groomName.split(" ")[0]}
          <span className="mx-2 text-[var(--tmpl-accent-secondary)]">&</span>
          {data.couple.brideName.split(" ")[0]}
        </h2>

        <BatikBorder className="mx-auto mt-10 max-w-xs text-white/30" />

        {sustainability?.trim() && (
          <p className="tmpl-body mt-8 text-[10px] uppercase tracking-[0.2em] text-white/50">
            {sustainability}
          </p>
        )}

        <BwPrimaryButton
          type="button"
          onClick={handleShare}
          variant="inverse"
          className="mt-10"
        >
          {t("share")}
        </BwPrimaryButton>

        {data.footer.credit?.trim() && (
          <p className="tmpl-body mt-8 text-[10px] uppercase tracking-[0.15em] text-white/40">
            {data.footer.credit}
          </p>
        )}
      </TemplateSectionReveal>
    </footer>
  );
}
