"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { LivestreamProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Livestream({ data }: LivestreamProps) {
  const { t } = useI18n();
  const url = data.livestreamUrl;

  if (!url) return null;

  const embedUrl = url.includes("youtube.com/watch")
    ? url.replace("watch?v=", "embed/")
    : url.includes("youtu.be/")
      ? `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`
      : url;

  return (
    <section id="livestream" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-3xl text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("livestream")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-32" />
          <p className="mt-8 text-sm font-light leading-relaxed text-[var(--tmpl-muted)]">
            {t("livestreamDesc")}
          </p>
          <div className="mt-10 aspect-video overflow-hidden border border-[var(--tmpl-accent)]/30">
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
