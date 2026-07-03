"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = data.gallery;
  const isEmpty = displayImages.length === 0;

  const lightboxImages = displayImages.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  return (
    <section id="gallery" className="border-b border-[var(--tmpl-grid)] py-20 md:py-28">
      <TemplateSectionReveal motion={motion} className="mb-12 px-6 md:px-12">
        <div className="mx-auto max-w-6xl border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("gallery")}
          </h2>
        </div>
      </TemplateSectionReveal>

      {isEmpty ? (
        <TemplateSectionReveal motion={motion} className="px-6 md:px-12">
          <TemplateEmptyState title={t("gallery")} />
        </TemplateSectionReveal>
      ) : (
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-px bg-[var(--tmpl-grid)] px-6 md:px-12">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 3) * 0.08}
          >
            <button
              type="button"
              className="relative block aspect-square w-full overflow-hidden bg-[var(--tmpl-bg)]"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 33vw, 400px"
                loading={index < 3 ? "eager" : "lazy"}
                className="object-cover transition-opacity duration-300 hover:opacity-80"
              />
            </button>
          </TemplateSectionReveal>
        ))}
      </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
