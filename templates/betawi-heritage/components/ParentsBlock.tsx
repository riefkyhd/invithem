"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";
import { BwEyebrow, BwSectionTitle } from "../ui";
import { motion } from "../motion";

function ParentLines({
  father,
  mother,
}: {
  father: string;
  mother: string;
}) {
  if (!father.trim() && !mother.trim()) return null;
  return (
    <div className="space-y-1">
      {father.trim() && (
        <p className="tmpl-display text-xl text-[var(--tmpl-heading)]">{father}</p>
      )}
      {mother.trim() && (
        <p className="tmpl-display text-xl text-[var(--tmpl-heading)]">{mother}</p>
      )}
    </div>
  );
}

export function ParentsBlock({ data }: ParentsBlockProps) {
  const { locale, t } = useI18n();
  const groom = data.parents.groom;
  const bride = data.parents.bride;
  const hasGroom = groom.father.trim() || groom.mother.trim();
  const hasBride = bride.father.trim() || bride.mother.trim();
  if (!hasGroom && !hasBride) return null;

  return (
    <section className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg text-center">
        <BwEyebrow>{locale === "id" ? "Keluarga" : "The Families"}</BwEyebrow>
        <BwSectionTitle className="mt-4">
          {locale === "id" ? "Dengan Hormat" : "With Respect"}
        </BwSectionTitle>

        <div className="mt-12 space-y-10">
          {hasGroom && (
            <div>
              <p className="tmpl-body text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
                {t("parentsGroom")}
              </p>
              <div className="mt-4">
                <ParentLines father={groom.father} mother={groom.mother} />
              </div>
            </div>
          )}
          {hasGroom && hasBride && (
            <div className="mx-auto h-px w-16 bg-[var(--tmpl-card-border)]" />
          )}
          {hasBride && (
            <div>
              <p className="tmpl-body text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
                {t("parentsBride")}
              </p>
              <div className="mt-4">
                <ParentLines father={bride.father} mother={bride.mother} />
              </div>
            </div>
          )}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
