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
    <section id="livestream" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("livestream")}
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--tmpl-muted)]">
            {t("livestreamDesc")}
          </p>
        </div>

        <div className="aspect-video w-full overflow-hidden border border-[var(--tmpl-grid)]">
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
