"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { LivestreamProps } from "@/lib/types/wedding-data";
import { ShEyebrow, ShSectionTitle } from "../ui";
import { motion } from "../motion";

export function Livestream({ data }: LivestreamProps) {
  const { locale, t } = useI18n();
  const url = data.livestreamUrl;
  if (!url) return null;

  const embedUrl = url.includes("youtube.com/watch")
    ? url.replace("watch?v=", "embed/")
    : url.includes("youtu.be/")
      ? `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`
      : url;

  const description =
    locale === "id"
      ? "Bagi yang tidak dapat hadir secara langsung, kami mengundang Anda menyaksikan akad melalui siaran digital kami."
      : t("livestreamDesc");

  return (
    <section id="livestream" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <ShEyebrow>{locale === "id" ? "Kehadiran Jarak Jauh" : "Remote Attendance"}</ShEyebrow>
        <ShSectionTitle className="mt-3">
          {locale === "id" ? (
            <>
              Ikut dari
              <br />
              <span className="italic">Jauh</span>
            </>
          ) : (
            <>
              Joining From
              <br />
              <span className="italic">Afar</span>
            </>
          )}
        </ShSectionTitle>
        <p className="tmpl-body mt-6 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {description}
        </p>
        <div className="relative mt-10 aspect-video overflow-hidden border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)]">
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
