"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { RotiBuayaDivider } from "../assets/RotiBuayaDivider";
import { BwSectionTitle } from "../ui";
import { motion } from "../motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const SECTION_BG =
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=60";

function resolveImage(galleryUrl: string | undefined, storyPath: string | undefined) {
  if (galleryUrl) return galleryUrl;
  if (storyPath) return getStoragePublicUrl("story", storyPath);
  return PLACEHOLDER;
}

function PortraitCard({ name, imageUrl }: { name: string; imageUrl: string }) {
  return (
    <div className="bw-card overflow-hidden p-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 448px) 100vw, 400px"
          className="object-cover"
        />
      </div>
      <h3 className="tmpl-display mt-4 break-words text-center text-2xl text-[var(--tmpl-heading)]">
        {name}
      </h3>
    </div>
  );
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
  const bgImage = data.gallery[2]?.url ?? SECTION_BG;

  return (
    <section id="story" className="relative overflow-hidden py-24">
      <div className="absolute inset-0" aria-hidden>
        <Image src={bgImage} alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--tmpl-bg)]/85" />
      </div>

      <div className="relative px-6 md:px-8">
        <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
          <BwSectionTitle>
            {locale === "id" ? "Kisah Kami" : "Our Story"}
          </BwSectionTitle>
          <RotiBuayaDivider className="mt-6" />
        </TemplateSectionReveal>

        <div className="mx-auto mt-14 grid max-w-md gap-10">
          <TemplateSectionReveal motion={motion}>
            <PortraitCard name={data.couple.groomName} imageUrl={groomImage} />
          </TemplateSectionReveal>
          <TemplateSectionReveal motion={motion} delay={0.08}>
            <PortraitCard name={data.couple.brideName} imageUrl={brideImage} />
          </TemplateSectionReveal>
        </div>
      </div>
    </section>
  );
}
