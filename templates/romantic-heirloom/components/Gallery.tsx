"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getGalleryImages } from "@/lib/invitation/template-utils";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = getGalleryImages(data);
  const lightboxImages = displayImages.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  return (
    <section id="gallery" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("gallery")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 4) * 0.08}
          >
            <button
              type="button"
              className="rh-photo-border block w-full transition-opacity hover:opacity-90"
              onClick={() => setLightboxIndex(index)}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  index % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 320px"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
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
