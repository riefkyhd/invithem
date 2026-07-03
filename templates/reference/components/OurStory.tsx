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
    <section id="story" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-16 text-4xl md:text-5xl">
          {t("ourStory")}
        </h2>
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-5xl flex-col gap-20">
        {data.story.map((milestone, index) => {
          const imageUrl = milestone.image_path
            ? getStoragePublicUrl("story", milestone.image_path)
            : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

          return (
            <TemplateSectionReveal
              key={`${milestone.year}-${index}`}
              motion={motion}
              delay={index * 0.1}
            >
              <div
                className={`flex flex-col gap-8 md:gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden md:w-1/2">
                  <Image
                    src={imageUrl}
                    alt={milestone.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[var(--tmpl-accent)]/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center md:w-1/2">
                  <span className="tmpl-display text-5xl text-[var(--tmpl-accent)]/60">
                    {milestone.year}
                  </span>
                  <h3 className="tmpl-display mt-2 text-2xl md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="prose-invite mt-4 leading-relaxed text-[var(--tmpl-muted)]">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </TemplateSectionReveal>
          );
        })}
      </div>
    </section>
  );
}
