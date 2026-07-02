"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GreetingProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function Greeting({ data }: GreetingProps) {
  const { t } = useI18n();
  const guestName = data.guest?.name;

  if (!guestName) return null;

  return (
    <TemplateSectionReveal motion={motion}>
      <section className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-5xl grid-cols-12 gap-px bg-[var(--tmpl-grid)]">
          <div className="col-span-12 bg-[var(--tmpl-bg)] p-8 md:col-span-4 md:p-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--tmpl-muted)]">
              {t("dear")}
            </p>
          </div>
          <div className="col-span-12 bg-[var(--tmpl-bg)] p-8 md:col-span-8 md:p-10">
            <h2 className="tmpl-display text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-tight tracking-[-0.04em]">
              {guestName}
            </h2>
            <div className="mt-8 h-px w-full max-w-xs bg-[var(--tmpl-grid)]" />
          </div>
        </div>
      </section>
    </TemplateSectionReveal>
  );
}
