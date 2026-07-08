"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";
import { ShEyebrow, ShSectionTitle } from "../ui";
import { motion } from "../motion";

function ParentCard({
  label,
  father,
  mother,
}: {
  label: string;
  father: string;
  mother: string;
}) {
  if (!father.trim() && !mother.trim()) return null;
  return (
    <div className="sh-parent-card px-10 py-10">
      <p className="tmpl-body text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
        {label}
      </p>
      {father.trim() && (
        <p className="tmpl-display mt-4 text-2xl text-[var(--tmpl-heading)]">{father}</p>
      )}
      {mother.trim() && (
        <p className="tmpl-display mt-2 text-2xl text-[var(--tmpl-heading)]">{mother}</p>
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
    <section className="relative overflow-hidden px-6 py-24 md:px-8">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-96 w-96 opacity-[0.06]"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="h-full w-full text-[var(--tmpl-accent)]" fill="currentColor">
          <ellipse cx="100" cy="100" rx="40" ry="90" />
        </svg>
      </div>

      <TemplateSectionReveal motion={motion} className="relative mx-auto max-w-lg">
        <ShEyebrow>{locale === "id" ? "Keluarga" : "The Families"}</ShEyebrow>
        <ShSectionTitle className="mt-4">
          {locale === "id" ? (
            <>
              Dengan
              <br />
              <span className="italic">Hormat</span>
            </>
          ) : (
            <>
              Honor Thy
              <br />
              <span className="italic">Heritage</span>
            </>
          )}
        </ShSectionTitle>

        <div className="mt-12 space-y-8">
          <ParentCard
            label={t("parentsGroom")}
            father={groom.father}
            mother={groom.mother}
          />
          <ParentCard
            label={t("parentsBride")}
            father={bride.father}
            mother={bride.mother}
          />
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
