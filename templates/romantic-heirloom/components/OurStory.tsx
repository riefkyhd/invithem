"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoryImageUrl } from "@/lib/invitation/template-utils";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

function TimelineDivider() {
  return (
    <div className="flex flex-col items-center py-6" aria-hidden>
      <div className="rh-embroidery-line w-24" />
      <span className="rh-ornament my-3">✦</span>
      <div className="rh-gold-rule w-16" />
    </div>
  );
}

export function OurStory({ data }: OurStoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("ourStory")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 max-w-xl">
        {data.story.map((milestone, index) => {
          const imageUrl = getStoryImageUrl(milestone.image_path);

          return (
            <div key={`${milestone.year}-${index}`}>
              <TemplateSectionReveal motion={motion} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <span className="tmpl-display text-sm font-medium tracking-[0.25em] text-[var(--tmpl-gold)]">
                    {milestone.year}
                  </span>

                  <div className="rh-photo-border mt-6 w-full max-w-sm">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={milestone.title}
                        fill
                        sizes="(max-width: 768px) 90vw, 384px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="tmpl-display mt-8 text-2xl font-medium tracking-wide text-[var(--tmpl-fg)]">
                    {milestone.title}
                  </h3>
                  <p className="tmpl-body mt-4 max-w-md text-base font-light leading-relaxed text-[var(--tmpl-muted)]">
                    {milestone.description}
                  </p>
                </div>
              </TemplateSectionReveal>

              {index < data.story.length - 1 && <TimelineDivider />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
