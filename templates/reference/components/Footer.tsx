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
    <>
      <section className="px-6 py-16 md:px-12 lg:px-24">
        <TemplateSectionReveal motion={motion} className="text-center">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-6 py-3 text-sm transition-colors hover:border-[var(--tmpl-accent)]"
          >
            {t("share")}
          </button>
        </TemplateSectionReveal>
      </section>
      <footer className="border-t border-[var(--tmpl-card-border)] px-6 py-12 text-center">
        <p className="tmpl-display text-lg text-[var(--tmpl-muted)]">
          {data.couple.groomName} & {data.couple.brideName}
        </p>
        {sustainability?.trim() && (
          <p className="mx-auto mt-6 max-w-md text-xs uppercase tracking-wider text-[var(--tmpl-muted)]/70">
            {sustainability}
          </p>
        )}
        {data.footer.credit?.trim() && (
          <p className="mt-3 text-xs text-[var(--tmpl-muted)]/50">
            {data.footer.credit}
          </p>
        )}
      </footer>
    </>
  );
}
