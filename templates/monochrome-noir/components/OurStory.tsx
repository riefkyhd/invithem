"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80&sat=-100";

function resolveImage(galleryUrl: string | undefined, storyPath: string | undefined) {
  if (galleryUrl) return galleryUrl;
  if (storyPath) return getStoragePublicUrl("story", storyPath);
  return PLACEHOLDER;
}

function parentLine(
  father: string,
  mother: string,
  locale: "id" | "en",
  role: "groom" | "bride"
) {
  const f = father.trim();
  const m = mother.trim();
  if (!f && !m) return "";
  if (locale === "id") {
    const prefix = role === "groom" ? "Putra dari" : "Putri dari";
    return `${prefix} Bapak ${f}${m ? ` & Ibu ${m}` : ""}`;
  }
  const label = role === "groom" ? "Son of" : "Daughter of";
  return `${label} ${[f, m].filter(Boolean).join(" & ")}`.toUpperCase();
}

export function OurStory({ data }: OurStoryProps) {
  const { locale } = useI18n();
  const groomImage = resolveImage(
    data.gallery[0]?.url,
    data.story[0]?.image_path ?? undefined
  );
  const brideImage = resolveImage(
    data.gallery[1]?.url,
    data.story[1]?.image_path ?? undefined
  );

  return (
    <section id="story" className="px-6 py-20 md:px-8">
      <div className="mx-auto flex max-w-md flex-col gap-16">
        <TemplateSectionReveal motion={motion}>
          <div className="border border-black/5">
            <div className="relative aspect-[340/425] w-full overflow-hidden">
              <Image
                src={groomImage}
                alt={data.couple.groomName}
                fill
                sizes="(max-width: 448px) 100vw, 400px"
                className="object-cover grayscale"
              />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="tmpl-display text-5xl leading-none text-[var(--tmpl-fg)]">
              {data.couple.groomName}
            </h3>
            <p className="tmpl-body mt-4 text-base tracking-[0.2em] text-[var(--tmpl-muted)]">
              {parentLine(
                data.parents.groom.father,
                data.parents.groom.mother,
                locale,
                "groom"
              )}
            </p>
          </div>
        </TemplateSectionReveal>

        <div className="flex justify-center" aria-hidden>
          <span className="tmpl-display text-8xl text-black/10">&</span>
        </div>

        <TemplateSectionReveal motion={motion} delay={0.1}>
          <div className="border border-black/5">
            <div className="relative aspect-[340/425] w-full overflow-hidden">
              <Image
                src={brideImage}
                alt={data.couple.brideName}
                fill
                sizes="(max-width: 448px) 100vw, 400px"
                className="object-cover grayscale"
              />
            </div>
          </div>
          <div className="mt-8 text-right">
            <h3 className="tmpl-display text-5xl leading-none text-[var(--tmpl-fg)]">
              {data.couple.brideName}
            </h3>
            <p className="tmpl-body mt-4 text-base tracking-[0.2em] text-[var(--tmpl-muted)]">
              {parentLine(
                data.parents.bride.father,
                data.parents.bride.mother,
                locale,
                "bride"
              )}
            </p>
          </div>
        </TemplateSectionReveal>
      </div>
    </section>
  );
}
