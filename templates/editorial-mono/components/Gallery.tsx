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
    <section id="gallery" className="py-24 md:py-32">
      <TemplateSectionReveal motion={motion} className="mb-12 px-8 md:px-16 lg:px-24">
        <h2 className="tmpl-display text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("gallery")}
        </h2>
      </TemplateSectionReveal>

      {isEmpty ? (
        <TemplateSectionReveal motion={motion} className="px-8 md:px-16 lg:px-24">
          <TemplateEmptyState title={t("gallery")} />
        </TemplateSectionReveal>
      ) : (
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 pb-4 md:gap-6 md:px-16 lg:px-24">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={index * 0.05}
            className="shrink-0 snap-start"
          >
            <button
              type="button"
              className="relative block h-[60vw] w-[75vw] overflow-hidden md:h-[420px] md:w-[320px]"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 75vw, 320px"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover grayscale transition-opacity duration-300 hover:opacity-80"
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
