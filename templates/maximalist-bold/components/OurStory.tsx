"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoryImageUrl } from "@/lib/invitation/template-utils";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const PANEL_COLORS = [
  "bg-[var(--tmpl-coral)]",
  "bg-[var(--tmpl-chartreuse)]",
  "bg-[var(--tmpl-purple)]",
] as const;

const FRAME_CLASSES = ["mb-frame-coral", "mb-frame-chartreuse", "mb-frame-purple"] as const;

export function OurStory({ data }: OurStoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="overflow-hidden px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <div className="mb-16 flex items-end gap-4">
          <h2 className="tmpl-display text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase leading-none tracking-[-0.04em]">
            {t("ourStory")}
          </h2>
          <span className="mb-2 h-3 flex-1 max-w-[120px] bg-[var(--tmpl-coral)]" aria-hidden />
        </div>
      </TemplateSectionReveal>

      <div className="flex flex-col gap-24 md:gap-32">
        {data.story.map((milestone, index) => {
          const imageUrl = getStoryImageUrl(milestone.image_path);
          const isEven = index % 2 === 0;
          const panelColor = PANEL_COLORS[index % PANEL_COLORS.length];
          const frameClass = FRAME_CLASSES[index % FRAME_CLASSES.length];
          const textOnDark = index % 3 === 2;

          return (
            <TemplateSectionReveal
              key={`${milestone.year}-${index}`}
              motion={motion}
              delay={index * 0.08}
            >
              <div
                className={`relative grid items-center gap-10 md:grid-cols-12 md:gap-8 ${
                  isEven ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div
                  className={`absolute inset-y-[-2rem] ${isEven ? "-left-6 right-[30%]" : "-right-6 left-[30%]"} -z-0 ${panelColor} ${isEven ? "-rotate-1" : "rotate-1"}`}
                  aria-hidden
                />

                <div
                  className={`relative z-10 md:col-span-5 ${
                    isEven ? "md:col-start-1 md:ml-[4vw]" : "md:col-start-8 md:mr-[2vw]"
                  }`}
                >
                  <div
                    className={`relative aspect-[3/4] w-full overflow-hidden border-4 border-[var(--tmpl-fg)] ${frameClass}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`relative z-10 md:col-span-6 ${
                    isEven
                      ? "md:col-start-7 md:mt-12 md:pl-4"
                      : "md:col-start-1 md:mt-16 md:pr-4"
                  }`}
                >
                  <p
                    className={`tmpl-display text-[clamp(3rem,10vw,6rem)] font-black leading-none tracking-[-0.05em] ${
                      textOnDark ? "text-[var(--tmpl-accent-fg)]" : "text-[var(--tmpl-purple)]"
                    } opacity-30`}
                    aria-hidden
                  >
                    {milestone.year}
                  </p>
                  <p className="tmpl-body -mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--tmpl-coral)]">
                    {milestone.year}
                  </p>
                  <h3 className="tmpl-display mt-4 text-2xl font-extrabold uppercase tracking-[-0.02em] md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="prose-invite tmpl-body mt-5 leading-relaxed text-[var(--tmpl-muted)]">
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
