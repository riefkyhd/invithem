"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import type { FooterProps } from "@/lib/types/wedding-data";
import { WpPrimaryButton } from "../ui";
import { motion } from "../motion";

export function Footer({ data }: FooterProps) {
  const { locale, t } = useI18n();

  const shareMessage =
    locale === "id" ? data.share.messageId : data.share.messageEn;
  const sustainability =
    locale === "id"
      ? data.footer.sustainabilityId
      : data.footer.sustainabilityEn;
  const closingQuote = data.opening.quote?.trim();

  function handleShare() {
    const message = `${shareMessage}\n\n${data.share.invitationUrl}`;
    const url = buildWhatsAppShareUrl(data.whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {closingQuote && (
        <section className="px-5 py-20 md:px-8">
          <TemplateSectionReveal motion={motion} className="mx-auto max-w-md text-center">
            <blockquote className="tmpl-display text-3xl italic leading-snug text-[var(--tmpl-heading)] md:text-4xl">
              &ldquo;{closingQuote}&rdquo;
            </blockquote>
            {data.footer.credit?.trim() && (
              <p className="tmpl-body mt-8 text-sm uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
                {data.footer.credit}
              </p>
            )}
          </TemplateSectionReveal>
        </section>
      )}

      <section className="px-5 pb-8 md:px-8">
        <TemplateSectionReveal motion={motion} className="text-center">
          <WpPrimaryButton type="button" onClick={handleShare} variant="rose">
            {t("share")}
          </WpPrimaryButton>
        </TemplateSectionReveal>
      </section>

      <footer className="border-t border-[var(--tmpl-card-border)] px-5 py-10 text-center">
        <p className="tmpl-display text-lg text-[var(--tmpl-heading)]">
          {data.couple.groomName} & {data.couple.brideName}
        </p>
        <p className="tmpl-body mt-2 text-xs uppercase tracking-[0.2em] text-[var(--tmpl-sage)]">
          {data.couple.monogram}
        </p>
        {sustainability?.trim() && (
          <p className="tmpl-body mx-auto mt-6 max-w-md text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
            {sustainability}
          </p>
        )}
      </footer>
    </>
  );
}
