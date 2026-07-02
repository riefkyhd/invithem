"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getLivestreamEmbedUrl } from "@/lib/invitation/template-utils";
import type { LivestreamProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function Livestream({ data }: LivestreamProps) {
  const { t } = useI18n();
  const url = data.livestreamUrl;

  if (!url) return null;

  const embedUrl = getLivestreamEmbedUrl(url);

  return (
    <section id="livestream" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <BotanicalDivider variant="sprig" drift className="mb-6 opacity-60" />
        <h2 className="tmpl-display mb-4 text-4xl text-[var(--tmpl-fg)] md:text-5xl">
          {t("livestream")}
        </h2>
        <p className="tmpl-body mb-8 max-w-xl leading-relaxed text-[var(--tmpl-muted)]">
          {t("livestreamDesc")}
        </p>
        <div className="aspect-video max-w-4xl overflow-hidden rounded-2xl border-2 border-[var(--tmpl-card-border)] shadow-sm">
          <iframe
            src={embedUrl}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={t("livestream")}
          />
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
