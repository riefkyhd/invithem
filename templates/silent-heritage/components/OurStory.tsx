"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { OurStoryProps } from "@/lib/types/wedding-data";
import { ShSectionTitle } from "../ui";
import { motion } from "../motion";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

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
  return `${label} ${[f, m].filter(Boolean).join(" & ")}`;
}

function CoupleBlock({
  name,
  parents,
  imageUrl,
  alignRight,
}: {
  name: string;
  parents: string;
  imageUrl: string;
  alignRight?: boolean;
}) {
  return (
    <div>
      <div className="relative aspect-[342/456] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 448px) 100vw, 400px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-4 border border-white/50" />
      </div>
      <div className={`mt-6 ${alignRight ? "text-right" : "text-left"}`}>
        <h3 className="tmpl-display break-words text-[clamp(1.75rem,7vw,2.5rem)] text-[var(--tmpl-heading)]">
          {name}
        </h3>
        {parents && (
          <p className="tmpl-body mt-3 text-sm leading-relaxed text-[var(--tmpl-muted)]">
            {parents}
          </p>
        )}
      </div>
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

  return (
    <section id="story" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-md text-center">
        <ShSectionTitle>
          {locale === "id" ? (
            <>
              Pasangan
              <br />
              <span className="italic">Bahagia</span>
            </>
          ) : (
            <>
              The Happy
              <br />
              <span className="italic">Couple</span>
            </>
          )}
        </ShSectionTitle>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 flex max-w-md flex-col gap-12">
        <TemplateSectionReveal motion={motion}>
          <CoupleBlock
            name={data.couple.groomName}
            parents={parentLine(
              data.parents.groom.father,
              data.parents.groom.mother,
              locale,
              "groom"
            )}
            imageUrl={groomImage}
          />
        </TemplateSectionReveal>

        <p className="tmpl-display text-center text-6xl font-light italic text-[var(--tmpl-accent)]">
          &
        </p>

        <TemplateSectionReveal motion={motion} delay={0.1}>
          <CoupleBlock
            name={data.couple.brideName}
            parents={parentLine(
              data.parents.bride.father,
              data.parents.bride.mother,
              locale,
              "bride"
            )}
            imageUrl={brideImage}
            alignRight
          />
        </TemplateSectionReveal>
      </div>
    </section>
  );
}
