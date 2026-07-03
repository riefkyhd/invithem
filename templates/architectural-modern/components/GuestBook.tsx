"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { motion } from "../motion";

const inputClass =
  "w-full border-0 border-b border-[var(--tmpl-grid)] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-fg)]";

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
    <section id="wishes" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-2xl">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("wishes")}
          </h2>
        </div>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1} className="mx-auto mb-16 max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--tmpl-accent)]">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={inputClass} />
            {errors.message && (
              <p className="mt-1 text-sm text-[var(--tmpl-accent)]">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-[var(--tmpl-accent)]">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-muted)]">{t("wishSuccess")}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-10 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {t("wishSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <div className="mx-auto max-w-2xl">
          <GuestBookSkeleton cardClassName="bg-[var(--tmpl-bg)] p-6 md:p-8" />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl gap-px bg-[var(--tmpl-grid)]">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} className="bg-[var(--tmpl-bg)]" />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.06}
              >
                <div className="bg-[var(--tmpl-bg)] p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    {wish.name}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--tmpl-muted)]">
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
