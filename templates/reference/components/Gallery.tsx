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
    <section id="gallery" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-12 text-4xl md:text-5xl">
          {t("gallery")}
        </h2>
      </TemplateSectionReveal>

      {isEmpty ? (
        <TemplateSectionReveal motion={motion}>
          <TemplateEmptyState title={t("gallery")} />
        </TemplateSectionReveal>
      ) : (
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 3) * 0.05}
          >
            <button
              type="button"
              className="relative aspect-square w-full overflow-hidden"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 hover:scale-105"
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
