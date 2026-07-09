"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { BwSectionTitle } from "../ui";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[4/5]", "aspect-square"] as const;

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = data.gallery;
  if (images.length === 0) return null;

  const lightboxImages = images.map((img) => ({ src: img.url, alt: img.alt }));

  return (
    <section id="gallery" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-md">
        <BwSectionTitle>{t("gallery")}</BwSectionTitle>
        <div className="mt-4 h-1 w-20 bg-[var(--tmpl-accent)]" />
      </TemplateSectionReveal>

      <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-4">
        {images.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 4) * 0.05}
            className={index % 2 === 1 ? "mt-8" : undefined}
          >
            <button
              type="button"
              className={`relative w-full overflow-hidden border border-[var(--tmpl-card-border)] ${ASPECTS[index % ASPECTS.length]}`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 448px) 50vw, 200px"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover"
              />
            </button>
          </TemplateSectionReveal>
        ))}
      </div>

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
