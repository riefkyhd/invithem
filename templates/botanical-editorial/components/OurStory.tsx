"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoryImageUrl } from "@/lib/invitation/template-utils";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function OurStory({ data }: OurStoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion} className="text-center">
        <BotanicalDivider variant="branch" drift className="mx-auto mb-6 opacity-70" />
        <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
          {t("ourStory")}
        </h2>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-16">
        {data.story.map((milestone, index) => {
          const imageUrl = getStoryImageUrl(milestone.image_path);

          return (
            <div key={`${milestone.year}-${index}`}>
              <TemplateSectionReveal motion={motion} delay={index * 0.08}>
                <div
                  className={`flex flex-col items-center gap-8 md:gap-10 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-md shadow-[var(--tmpl-accent)]/10 md:w-5/12">
                    <Image
                      src={imageUrl}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[var(--tmpl-olive)]/8 mix-blend-multiply" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center text-center md:text-left">
                    <span className="tmpl-display text-4xl text-[var(--tmpl-accent-secondary)]/70">
                      {milestone.year}
                    </span>
                    <h3 className="tmpl-display mt-2 text-2xl text-[var(--tmpl-fg)] md:text-3xl">
                      {milestone.title}
                    </h3>
                    <p className="prose-invite tmpl-body mt-4 leading-relaxed text-[var(--tmpl-muted)]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </TemplateSectionReveal>

              {index < data.story.length - 1 && (
                <div className="my-12 flex justify-center">
                  <BotanicalDivider
                    variant={index % 2 === 0 ? "sprig" : "leaves"}
                    drift
                    className="opacity-50"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
