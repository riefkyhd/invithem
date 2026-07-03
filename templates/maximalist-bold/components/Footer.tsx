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
    <footer className="px-6 py-16 md:px-12 md:py-20">
      <div className="flex h-3 w-full overflow-hidden" aria-hidden>
        <span className="flex-1 bg-[var(--tmpl-coral)]" />
        <span className="flex-1 bg-[var(--tmpl-chartreuse)]" />
        <span className="flex-1 bg-[var(--tmpl-purple)]" />
        <span className="flex-1 bg-[var(--tmpl-coral)]" />
        <span className="flex-1 bg-[var(--tmpl-chartreuse)]" />
      </div>

      <TemplateSectionReveal motion={motion} className="mt-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="tmpl-display text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold uppercase leading-tight tracking-[-0.03em]">
              {data.couple.groomName}
              <span className="mx-2 text-[var(--tmpl-coral)]">&</span>
              {data.couple.brideName}
            </p>
            <p className="tmpl-body mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {data.couple.monogram}
            </p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="mb-color-purple tmpl-body self-start px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity hover:opacity-80 md:self-auto"
          >
            {t("share")}
          </button>
        </div>
        {sustainability?.trim() && (
          <p className="tmpl-body mt-10 max-w-md text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tmpl-muted)]/70">
            {sustainability}
          </p>
        )}
        {data.footer.credit?.trim() && (
          <p className="tmpl-body mt-3 text-xs tracking-[0.15em] text-[var(--tmpl-muted)]/50">
            {data.footer.credit}
          </p>
        )}
      </TemplateSectionReveal>
    </footer>
  );
}
