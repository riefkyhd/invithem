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

const FRAME_CLASSES = ["mb-frame-coral", "mb-frame-chartreuse", "mb-frame-purple"] as const;
const OFFSETS = [
  "translate-y-0",
  "translate-y-8 md:translate-y-12",
  "translate-y-4 md:translate-y-6",
  "translate-y-12 md:translate-y-16",
] as const;

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = getGalleryImages(data);

  const lightboxImages = displayImages.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  return (
    <section id="gallery" className="overflow-hidden py-20 md:py-28">
      <TemplateSectionReveal motion={motion} className="mb-14 px-6 md:px-12">
        <h2 className="tmpl-display text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("gallery")}
        </h2>
      </TemplateSectionReveal>

      <div className="grid grid-cols-2 gap-6 px-6 md:grid-cols-3 md:gap-8 md:px-12 lg:gap-10">
        {displayImages.map((image, index) => {
          const frameClass = FRAME_CLASSES[index % FRAME_CLASSES.length];
          const offset = OFFSETS[index % OFFSETS.length];
          const spanWide = index % 5 === 0;

          return (
            <TemplateSectionReveal
              key={image.url}
              motion={motion}
              delay={index * 0.06}
              className={`${offset} ${spanWide ? "col-span-2 md:col-span-1" : ""}`}
            >
              <button
                type="button"
                className={`relative block w-full overflow-hidden border-4 border-[var(--tmpl-fg)] ${frameClass} ${
                  spanWide ? "aspect-[16/10]" : "aspect-[3/4]"
                }`}
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            </TemplateSectionReveal>
          );
        })}
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
