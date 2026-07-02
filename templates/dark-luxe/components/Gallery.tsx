"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-81e6c1e16d18?w=600&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
];

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages =
    data.gallery.length > 0
      ? data.gallery
      : PLACEHOLDER_IMAGES.map((src, i) => ({
          url: src,
          alt: `Gallery ${i + 1}`,
        }));

  const lightboxImages = displayImages.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  return (
    <section id="gallery" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("gallery")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-1">
        {displayImages.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 4) * 0.08}
          >
            <button
              type="button"
              className={`relative w-full overflow-hidden border border-[var(--tmpl-accent)]/30 transition-opacity hover:opacity-90 ${
                index % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
              }`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 384px"
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
