"use client";

import { useI18n } from "@/lib/i18n/context";
import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { BwPrimaryButton, BwSectionTitle, bwFieldClass } from "../ui";
import { motion } from "../motion";

export function GuestBook({ data }: GuestBookProps) {
  const { locale, t } = useI18n();
  const {
    wishes,
    wishesLoading,
    error,
    submitted,
    onSubmit,
    isSubmitting,
    errors,
    register,
  } = useWishes(data.projectId, data.projectSlug, data.wishes, data.guest?.name ?? "");

  const intro =
    locale === "id"
      ? "Tinggalkan ucapan dan doa untuk pasangan bahagia."
      : "Leave your wishes and blessings for the happy couple.";

  return (
    <section id="wishes" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <BwSectionTitle>{t("wishes")}</BwSectionTitle>
        <p className="tmpl-body mt-4 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {intro}
        </p>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.08}>
        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-lg space-y-6">
          <div className="bw-card p-8 space-y-6">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
                {t("wishName")}
              </label>
              <input {...register("name")} className={bwFieldClass} />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
                {t("wishMessage")}
              </label>
              <textarea {...register("message")} rows={4} className={bwFieldClass} />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {submitted && (
              <p className="text-sm text-[var(--tmpl-muted)]">{t("wishSuccess")}</p>
            )}
            <BwPrimaryButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {t("wishSubmit")}
            </BwPrimaryButton>
          </div>
        </form>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.12} className="mt-16">
        <p className="tmpl-body text-center text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
          {locale === "id" ? "Ucapan Terbaru" : "Recent Wishes"}
        </p>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <div className="mx-auto mt-8 max-w-lg">
          <GuestBookSkeleton cardClassName="border-l-2 border-[var(--tmpl-accent)] pl-6 py-6" />
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-lg space-y-8">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.04}
              >
                <blockquote className="border-l-2 border-[var(--tmpl-accent)] pl-6">
                  <p className="tmpl-display text-lg italic leading-relaxed text-[var(--tmpl-heading)]">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                  <p className="tmpl-body mt-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--tmpl-muted)]">
                    {wish.name}
                  </p>
                </blockquote>
              </TemplateSectionReveal>
            ))
          )}
        </div>
      )}
    </section>
  );
}
