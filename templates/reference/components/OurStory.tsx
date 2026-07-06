"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { SectionHeading } from "../ui";
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

function parentLine(father: string, mother: string) {
  const parts = [father.trim(), mother.trim()].filter(Boolean);
  return parts.join(" & ");
}

function CoupleProfile({
  name,
  roleLabel,
  parents,
  imageUrl,
}: {
  name: string;
  roleLabel: string;
  parents: { father: string; mother: string };
  imageUrl: string;
}) {
  const parentsText = parentLine(parents.father, parents.mother);
  if (!name.trim() && !parentsText) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-80 w-64 overflow-hidden rounded-t-full border-4 border-[var(--tmpl-card-border)] p-1 shadow-lg">
        <div className="relative h-full w-full overflow-hidden rounded-t-full bg-[#e8e4f4]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="tmpl-display text-2xl font-bold text-[var(--tmpl-heading)]">
          {name}
        </h3>
        {parentsText && (
          <>
            <p className="text-sm italic text-[var(--tmpl-body-muted)]">{roleLabel}</p>
            <p className="text-base font-medium text-[var(--tmpl-heading)]">{parentsText}</p>
          </>
        )}
      </div>
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

  const groomRole = locale === "id" ? "Putra dari" : "Son of";
  const brideRole = locale === "id" ? "Putri dari" : "Daughter of";

  return (
    <section id="story" className="px-6 py-16">
      <TemplateSectionReveal motion={motion}>
        <SectionHeading title={t("happyCouple")} className="mb-12" />
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-md flex-col gap-10">
        <TemplateSectionReveal motion={motion} delay={0.1}>
          <CoupleProfile
            name={data.couple.groomName}
            roleLabel={groomRole}
            parents={data.parents.groom}
            imageUrl={groomImage}
          />
        </TemplateSectionReveal>

        <TemplateSectionReveal motion={motion} delay={0.15}>
          <p className="tmpl-display text-center text-4xl italic text-[var(--tmpl-accent)]">
            &
          </p>
        </TemplateSectionReveal>

        <TemplateSectionReveal motion={motion} delay={0.2}>
          <CoupleProfile
            name={data.couple.brideName}
            roleLabel={brideRole}
            parents={data.parents.bride}
            imageUrl={brideImage}
          />
        </TemplateSectionReveal>
      </div>
    </section>
  );
}
