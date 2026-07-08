"use client";

import { useI18n } from "@/lib/i18n/context";
import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { ShPrimaryButton, ShSectionTitle, shFieldClass } from "../ui";
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
      ? "Tinggalkan ucapan, doa, atau kenangan indah untuk pasangan."
      : "Leave a note of love, wisdom, or a cherished memory for the couple to keep forever.";

  return (
    <section id="wishes" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <ShSectionTitle>{t("wishes")}</ShSectionTitle>
        <p className="tmpl-body mt-4 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {intro}
        </p>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.08}>
        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-lg space-y-8">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={shFieldClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={shFieldClass} />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-muted)]">{t("wishSuccess")}</p>
          )}
          <ShPrimaryButton type="submit" disabled={isSubmitting} className="w-full">
            {t("wishSubmit")}
          </ShPrimaryButton>
        </form>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.12} className="mt-16">
        <p className="tmpl-body text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
          {locale === "id" ? "Ucapan Terbaru" : "Recent Wishes"}
        </p>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <div className="mx-auto mt-8 max-w-lg">
          <GuestBookSkeleton cardClassName="border-t border-[var(--tmpl-card-border)] py-8" />
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-lg space-y-10">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.04}
              >
                <blockquote className="tmpl-display text-lg italic leading-relaxed text-[var(--tmpl-heading)]">
                  &ldquo;{wish.message}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-4 text-sm text-[var(--tmpl-muted)]">
                  <span className="font-medium uppercase tracking-[0.12em]">{wish.name}</span>
                  <span className="h-px w-8 bg-[var(--tmpl-card-border)]" aria-hidden />
                </div>
              </TemplateSectionReveal>
            ))
          )}
        </div>
      )}
    </section>
  );
}
