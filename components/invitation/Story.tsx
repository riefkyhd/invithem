"use client";

import Image from "next/image";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useI18n } from "@/lib/i18n/context";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { StoryMilestone } from "@/lib/types/database";

interface StoryProps {
  milestones: StoryMilestone[];
}

export function Story({ milestones }: StoryProps) {
  const { t } = useI18n();

  return (
    <section id="story" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-16 text-4xl md:text-5xl">
          {t("ourStory")}
        </h2>
      </SectionReveal>

      <div className="mx-auto flex max-w-5xl flex-col gap-20">
        {milestones.map((milestone, index) => {
          const imageUrl = milestone.image_path
            ? getStoragePublicUrl("story", milestone.image_path)
            : `https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80`;

          return (
            <SectionReveal key={`${milestone.year}-${index}`} delay={index * 0.1}>
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
                  <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center md:w-1/2">
                  <span className="font-display text-5xl text-accent/60">
                    {milestone.year}
                  </span>
                  <h3 className="font-display mt-2 text-2xl md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}
