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
    <section id="story" className="overflow-hidden px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-20 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("ourStory")}
        </h2>
      </TemplateSectionReveal>

      <div className="flex flex-col gap-32 md:gap-40">
        {data.story.map((milestone, index) => {
          const imageUrl = getStoryImageUrl(milestone.image_path);
          const isEven = index % 2 === 0;

          return (
            <TemplateSectionReveal
              key={`${milestone.year}-${index}`}
              motion={motion}
              delay={index * 0.08}
            >
              <div
                className={`relative grid items-center gap-10 md:grid-cols-12 md:gap-16 ${
                  isEven ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <span
                  className={`tmpl-display pointer-events-none absolute -top-8 select-none text-[clamp(6rem,20vw,14rem)] font-medium leading-none tracking-[-0.05em] text-[var(--tmpl-surface)] ${
                    isEven ? "-left-4 md:-left-12" : "-right-4 md:-right-12"
                  }`}
                  aria-hidden
                >
                  {milestone.year}
                </span>

                <div
                  className={`relative z-10 md:col-span-5 ${
                    isEven ? "md:col-start-1 md:ml-[6vw]" : "md:col-start-7 md:mr-[4vw]"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover grayscale"
                    />
                  </div>
                </div>

                <div
                  className={`relative z-10 md:col-span-5 ${
                    isEven
                      ? "md:col-start-7 md:mt-16 md:pl-8"
                      : "md:col-start-1 md:mt-24 md:pr-8"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
                    {milestone.year}
                  </p>
                  <h3 className="tmpl-display mt-3 text-2xl font-medium uppercase tracking-[-0.02em] md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="prose-invite mt-6 leading-relaxed text-[var(--tmpl-muted)]">
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
