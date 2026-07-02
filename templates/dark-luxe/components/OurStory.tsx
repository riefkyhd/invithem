"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function OurStory({ data }: OurStoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("ourStory")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className="relative mx-auto mt-20 max-w-2xl">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--tmpl-accent)]/40"
          aria-hidden
        />

        <div className="flex flex-col gap-24">
          {data.story.map((milestone, index) => {
            const imageUrl = milestone.image_path
              ? getStoragePublicUrl("story", milestone.image_path)
              : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

            return (
              <TemplateSectionReveal
                key={`${milestone.year}-${index}`}
                motion={motion}
                delay={index * 0.12}
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tmpl-accent)] bg-[var(--tmpl-bg)]">
                    <span className="text-[10px] font-light tracking-wider text-[var(--tmpl-accent)]">
                      {milestone.year}
                    </span>
                  </div>

                  <div className="relative mt-8 aspect-[4/3] w-full max-w-sm overflow-hidden border border-[var(--tmpl-accent)]/30">
                    <Image
                      src={imageUrl}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 384px"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="tmpl-display mt-8 text-2xl font-light tracking-wide">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-[var(--tmpl-muted)]">
                    {milestone.description}
                  </p>
                </div>
              </TemplateSectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
