"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useI18n } from "@/lib/i18n/context";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { GalleryImage } from "@/lib/types/database";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

interface GalleryProps {
  images: GalleryImage[];
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-81e6c1e16d18?w=600&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
];

export function Gallery({ images }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages =
    images.length > 0
      ? images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            src: getStoragePublicUrl("gallery", img.path),
            alt: img.alt,
          }))
      : PLACEHOLDER_IMAGES.map((src, i) => ({
          src,
          alt: `Gallery ${i + 1}`,
        }));

  return (
    <section id="gallery" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-12 text-4xl md:text-5xl">
          {t("gallery")}
        </h2>
      </SectionReveal>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {displayImages.map((image, index) => (
          <SectionReveal key={image.src} delay={(index % 3) * 0.05}>
            <button
              type="button"
              className="relative aspect-square w-full overflow-hidden"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          </SectionReveal>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={displayImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
