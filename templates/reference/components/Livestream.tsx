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
    <section id="livestream" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-4 text-4xl md:text-5xl">
          {t("livestream")}
        </h2>
        <p className="mb-8 max-w-xl text-[var(--tmpl-muted)]">
          {t("livestreamDesc")}
        </p>
        <div className="aspect-video max-w-4xl overflow-hidden rounded-2xl border border-[var(--tmpl-card-border)]">
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
