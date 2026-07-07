"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { SectionDivider } from "../assets/SectionDivider";
import { SectionTitle } from "../ui";
import { motion } from "../motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80";

function resolveImage(
  galleryUrl: string | undefined,
  storyPath: string | undefined
): string {
  if (galleryUrl) return galleryUrl;
  if (storyPath) return getStoragePublicUrl("story", storyPath);
  return PLACEHOLDER;
}

function CoupleCard({
  name,
  parentsLine,
  imageUrl,
}: {
  name: string;
  parentsLine: string;
  imageUrl: string;
}) {
  if (!name.trim()) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 h-80 w-64 overflow-hidden rounded-t-[7.5rem] shadow-[0_10px_40px_-10px_rgba(79,100,78,0.08)]">
        <div className="relative h-full w-full">
          <Image src={imageUrl} alt={name} fill sizes="256px" className="object-cover" />
        </div>
      </div>
      <h3 className="tmpl-display text-[2rem] text-[var(--tmpl-heading)]">{name}</h3>
      {parentsLine && (
        <p className="tmpl-body mt-2 text-center text-base italic text-[var(--tmpl-muted)]">
          {parentsLine}
        </p>
      )}
    </div>
  );
}

export function OurStory({ data }: OurStoryProps) {
  const { locale, t } = useI18n();
  const groomImage = resolveImage(
    data.gallery[0]?.url,
    data.story[0]?.image_path ?? undefined
  );
  const brideImage = resolveImage(
    data.gallery[1]?.url,
    data.story[1]?.image_path ?? undefined
  );

  const groomParents = (() => {
    const f = data.parents.groom.father.trim();
    const m = data.parents.groom.mother.trim();
    if (!f && !m) return "";
    return locale === "id"
      ? `Putra dari Bapak ${f}${m ? ` & Ibu ${m}` : ""}`
      : `Son of ${[f, m].filter(Boolean).join(" & ")}`;
  })();

  const brideParents = (() => {
    const f = data.parents.bride.father.trim();
    const m = data.parents.bride.mother.trim();
    if (!f && !m) return "";
    return locale === "id"
      ? `Putri dari Bapak ${f}${m ? ` & Ibu ${m}` : ""}`
      : `Daughter of ${[f, m].filter(Boolean).join(" & ")}`;
  })();

  return (
    <section id="story" className="px-5 py-16 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <SectionTitle>{t("happyCouple")}</SectionTitle>
      </TemplateSectionReveal>

      <div className="mx-auto mt-10 flex max-w-md flex-col gap-10">
        <TemplateSectionReveal motion={motion} delay={0.08}>
          <CoupleCard
            name={data.couple.groomName}
            parentsLine={groomParents}
            imageUrl={groomImage}
          />
        </TemplateSectionReveal>
        <TemplateSectionReveal motion={motion} delay={0.12}>
          <CoupleCard
            name={data.couple.brideName}
            parentsLine={brideParents}
            imageUrl={brideImage}
          />
        </TemplateSectionReveal>
      </div>

      <TemplateSectionReveal motion={motion} delay={0.16} className="mt-10">
        <SectionDivider />
      </TemplateSectionReveal>
    </section>
  );
}
