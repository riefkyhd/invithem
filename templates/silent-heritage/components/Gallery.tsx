"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GalleryProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { ShSectionTitle } from "../ui";
import { motion } from "../motion";

const Lightbox = dynamic(
  () => import("@/components/invitation/Lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[16/7]", "aspect-[4/5]"] as const;

export function Gallery({ data }: GalleryProps) {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = data.gallery;
  if (images.length === 0) return null;

  const lightboxImages = images.map((img) => ({ src: img.url, alt: img.alt }));

  return (
    <section id="gallery" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <ShSectionTitle>{t("gallery")}</ShSectionTitle>
        <div className="mt-4 h-0.5 w-24 bg-[var(--tmpl-accent)]" />
      </TemplateSectionReveal>

      <div className="mx-auto mt-12 flex max-w-md flex-col gap-6">
        {images.map((image, index) => (
          <TemplateSectionReveal
            key={image.url}
            motion={motion}
            delay={(index % 4) * 0.05}
          >
            <button
              type="button"
              className={`relative w-full overflow-hidden ${ASPECTS[index % ASPECTS.length]}`}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 448px) 100vw, 400px"
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover"
              />
            </button>
          </TemplateSectionReveal>
        ))}
      </div>

      {images.length === 0 && <TemplateEmptyState title={t("gallery")} />}

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
