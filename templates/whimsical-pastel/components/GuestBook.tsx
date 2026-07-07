"use client";

import { useI18n } from "@/lib/i18n/context";
import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { SectionTitle, WpPrimaryButton, wpFieldClass } from "../ui";
import { motion } from "../motion";

export function GuestBook({ data }: GuestBookProps) {
  const { locale } = useI18n();
  const {
    wishes,
    wishesLoading,
    error,
    submitted,
    onSubmit,
    isSubmitting,
    errors,
    register,
    t,
  } = useWishes(data.projectId, data.projectSlug, data.wishes, data.guest?.name ?? "");

  return (
    <section id="wishes" className="px-5 py-16 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <SectionTitle>{t("wishes")}</SectionTitle>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.08}>
        <form onSubmit={onSubmit} className="wp-card mx-auto mt-10 max-w-md space-y-6 p-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--tmpl-heading)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={wpFieldClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--tmpl-heading)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={wpFieldClass} />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-accent-secondary)]">{t("wishSuccess")}</p>
          )}
          <WpPrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full normal-case tracking-normal"
          >
            {t("wishSubmit")}
          </WpPrimaryButton>
        </form>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.12} className="mt-12">
        <h3 className="tmpl-display text-center text-2xl text-[var(--tmpl-heading)]">
          {locale === "id" ? "Ucapan Terbaru" : "Recent Wishes"}
        </h3>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <GuestBookSkeleton cardClassName="wp-card p-5" />
      ) : (
        <div className="mx-auto mt-6 max-h-[28rem] max-w-md space-y-4 overflow-y-auto pr-1">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.04}
              >
                <div className="wp-card border-l-4 border-[var(--tmpl-sage)] p-5">
                  <p className="tmpl-body font-semibold text-[var(--tmpl-fg)]">{wish.name}</p>
                  <p className="tmpl-body mt-2 text-sm leading-relaxed text-[var(--tmpl-muted)]">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                </div>
              </TemplateSectionReveal>
            ))
          )}
        </div>
      )}
    </section>
  );
}
