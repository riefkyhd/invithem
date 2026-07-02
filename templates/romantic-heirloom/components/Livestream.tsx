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
    <section id="livestream" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("livestream")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-32" />
          <p className="tmpl-body mt-8 text-base font-light leading-relaxed text-[var(--tmpl-muted)]">
            {t("livestreamDesc")}
          </p>
          <div className="rh-photo-border mt-10">
            <div className="aspect-video overflow-hidden">
              <iframe
                src={embedUrl}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t("livestream")}
              />
            </div>
          </div>
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
