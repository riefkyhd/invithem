"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { motion } from "../motion";

export function GuestBook({ data }: GuestBookProps) {
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
    <section id="wishes" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-md text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("wishes")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-24" />
        </div>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-md space-y-6">
          <div>
            <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className="rh-input" />
            {errors.name && (
              <p className="mt-1 text-center text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className="rh-input resize-none" />
            {errors.message && (
              <p className="mt-1 text-center text-sm text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {submitted && (
            <p className="text-center text-sm text-[var(--tmpl-accent)]">{t("wishSuccess")}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("wishSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <div className="mx-auto mt-16 max-w-md">
          <GuestBookSkeleton cardClassName="rh-card-top-border bg-[var(--tmpl-card)] px-6 py-6" />
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-md space-y-6">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.06}
              >
                <div className="rh-card-top-border bg-[var(--tmpl-card)] px-6 py-6 text-center">
                  <p className="tmpl-display text-lg font-medium tracking-wide text-[var(--tmpl-fg)]">
                    {wish.name}
                  </p>
                  <div className="rh-embroidery-line mx-auto mt-3 w-16" />
                  <p className="tmpl-body mt-4 text-sm font-light leading-relaxed text-[var(--tmpl-muted)]">
                    {wish.message}
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
