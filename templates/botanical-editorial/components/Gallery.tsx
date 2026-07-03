"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

const MASONRY_OFFSETS = [
  "mt-0",
  "mt-8 md:mt-12",
  "mt-4 md:mt-0",
  "mt-10 md:mt-6",
  "mt-2 md:mt-10",
  "mt-6 md:mt-4",
];

const MASONRY_ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

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
    <section id="gallery" className="botanical-section px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion} className="text-center">
        <BotanicalDivider variant="leaves" drift className="mx-auto mb-6 opacity-60" />
        <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
          {t("gallery")}
        </h2>
      </TemplateSectionReveal>

      {isEmpty ? (
        <TemplateSectionReveal motion={motion} className="mt-14">
          <TemplateEmptyState title={t("gallery")} />
        </TemplateSectionReveal>
      ) : (
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={`${image.url}-${index}`}
            motion={motion}
            delay={(index % 3) * 0.06}
            className={MASONRY_OFFSETS[index % MASONRY_OFFSETS.length]}
          >
            <button
              type="button"
              className={`relative w-full overflow-hidden rounded-2xl shadow-md shadow-[var(--tmpl-accent)]/10 transition-transform duration-500 hover:scale-[1.02] ${MASONRY_ASPECTS[index % MASONRY_ASPECTS.length]}`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover"
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
