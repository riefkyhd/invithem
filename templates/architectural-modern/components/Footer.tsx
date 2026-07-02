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
    <footer className="px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="h-px w-full bg-[var(--tmpl-grid)]" />

        <TemplateSectionReveal motion={motion} className="mt-10">
          <div className="grid grid-cols-1 gap-px bg-[var(--tmpl-grid)] md:grid-cols-12">
            <div className="bg-[var(--tmpl-bg)] p-6 md:col-span-8 md:p-8">
              <p className="tmpl-display text-sm font-semibold tracking-[-0.02em] text-[var(--tmpl-fg)]">
                <span className="text-[var(--tmpl-accent)]">
                  {data.couple.groomName}
                </span>
                <span className="mx-2 font-normal text-[var(--tmpl-muted)]">
                  &
                </span>
                <span className="text-[var(--tmpl-accent)]">
                  {data.couple.brideName}
                </span>
              </p>
            </div>
            <div className="flex items-center bg-[var(--tmpl-bg)] p-6 md:col-span-4 md:justify-end md:p-8">
              <button
                type="button"
                onClick={handleShare}
                className="border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-85"
              >
                {t("share")}
              </button>
            </div>
          </div>
        </TemplateSectionReveal>
      </div>
    </footer>
  );
}
