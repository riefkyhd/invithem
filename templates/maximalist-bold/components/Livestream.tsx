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
    <section id="livestream" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <div className="relative">
          <div
            className="absolute -left-4 top-8 h-full w-[60%] bg-[var(--tmpl-purple)] opacity-20"
            aria-hidden
          />
          <h2 className="tmpl-display relative mb-4 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
            {t("livestream")}
          </h2>
          <p className="tmpl-body relative mb-10 max-w-md leading-relaxed text-[var(--tmpl-muted)]">
            {t("livestreamDesc")}
          </p>
          <div className="relative aspect-video max-w-4xl overflow-hidden border-4 border-[var(--tmpl-fg)] mb-frame-purple">
            <iframe
              src={embedUrl}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={t("livestream")}
            />
          </div>
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
