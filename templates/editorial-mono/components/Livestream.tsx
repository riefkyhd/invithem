"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getLivestreamEmbedUrl } from "@/lib/invitation/template-utils";
import type { LivestreamProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Livestream({ data }: LivestreamProps) {
  const { t } = useI18n();
  const url = data.livestreamUrl;

  if (!url) return null;

  const embedUrl = getLivestreamEmbedUrl(url);

  return (
    <section id="livestream" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-4 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("livestream")}
        </h2>
        <p className="mb-12 ml-[4vw] max-w-md text-[var(--tmpl-muted)]">
          {t("livestreamDesc")}
        </p>
        <div className="ml-[4vw] aspect-video max-w-4xl overflow-hidden border border-[var(--tmpl-card-border)]">
          <iframe
            src={embedUrl}
            className="h-full w-full border-0 grayscale"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={t("livestream")}
          />
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
