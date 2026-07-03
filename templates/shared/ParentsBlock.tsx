"use client";

import { useI18n } from "@/lib/i18n/context";
import type { ParentsBlockProps } from "@/lib/types/wedding-data";

interface SharedParentsBlockProps extends ParentsBlockProps {
  className?: string;
  sideClassName?: string;
  labelClassName?: string;
  nameClassName?: string;
}

function hasParents(parents: { father: string; mother: string }) {
  return parents.father.trim() || parents.mother.trim();
}

export function SharedParentsBlock({
  data,
  className = "",
  sideClassName = "space-y-4 text-center",
  labelClassName = "text-xs uppercase tracking-[0.2em] text-[var(--tmpl-muted)]",
  nameClassName = "tmpl-display text-lg md:text-xl",
}: SharedParentsBlockProps) {
  const { t } = useI18n();
  const groom = data.parents.groom;
  const bride = data.parents.bride;

  if (!hasParents(groom) && !hasParents(bride)) return null;

  return (
    <section className={`px-6 py-16 md:px-12 lg:px-24 ${className}`}>
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-12">
        {hasParents(groom) && (
          <div className={sideClassName}>
            <p className={labelClassName}>{t("parentsGroom")}</p>
            {groom.father.trim() && (
              <p className={nameClassName}>{groom.father}</p>
            )}
            {groom.mother.trim() && (
              <p className={nameClassName}>{groom.mother}</p>
            )}
          </div>
        )}
        {hasParents(bride) && (
          <div className={sideClassName}>
            <p className={labelClassName}>{t("parentsBride")}</p>
            {bride.father.trim() && (
              <p className={nameClassName}>{bride.father}</p>
            )}
            {bride.mother.trim() && (
              <p className={nameClassName}>{bride.mother}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
