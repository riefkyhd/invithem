"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoryImageUrl } from "@/lib/invitation/template-utils";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function OurStory({ data }: OurStoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-6xl">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("ourStory")}
          </h2>
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-6xl flex-col gap-px bg-[var(--tmpl-grid)]">
        {data.story.map((milestone, index) => {
          const imageUrl = getStoryImageUrl(milestone.image_path);
          const isEven = index % 2 === 0;

          return (
            <TemplateSectionReveal
              key={`${milestone.year}-${index}`}
              motion={motion}
              delay={index * 0.1}
            >
              <div
                className={`grid grid-cols-1 gap-px bg-[var(--tmpl-grid)] md:grid-cols-12 ${
                  isEven ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div className="relative aspect-[4/3] bg-[var(--tmpl-bg)] md:col-span-5">
                  <Image
                    src={imageUrl}
                    alt={milestone.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center bg-[var(--tmpl-bg)] p-8 md:col-span-7 md:p-12">
                  <div className="mb-4 inline-flex w-fit border border-[var(--tmpl-grid)] px-4 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
                      {milestone.year}
                    </span>
                  </div>
                  <h3 className="tmpl-display text-xl font-semibold tracking-[-0.03em] md:text-2xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--tmpl-muted)]">
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
