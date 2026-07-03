"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import { motion } from "../motion";

const inputClass =
  "w-full border-b border-[var(--tmpl-card-border)] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-fg)]";

export function GuestBook({ data }: GuestBookProps) {
  const {
    wishes,
    error,
    submitted,
    onSubmit,
    isSubmitting,
    errors,
    register,
    t,
  } = useWishes(data.projectId, data.projectSlug, data.wishes, data.guest?.name ?? "");

  return (
    <section id="wishes" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-16 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("wishes")}
        </h2>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form onSubmit={onSubmit} className="ml-[4vw] mb-20 max-w-lg space-y-8">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--tmpl-fg)]">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={inputClass} />
            {errors.message && (
              <p className="mt-1 text-sm text-[var(--tmpl-fg)]">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-[var(--tmpl-fg)]">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-muted)]">{t("wishSuccess")}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--tmpl-fg)] px-10 py-3 text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {t("wishSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>

      <div className="ml-[4vw] max-w-2xl space-y-0">
        {wishes.length === 0 ? (
          <TemplateEmptyState title={t("noWishes")} />
        ) : (
          wishes.map((wish, index) => (
            <TemplateSectionReveal
              key={wish.id}
              motion={motion}
              delay={(index % 5) * 0.05}
            >
              <div className="border-t border-[var(--tmpl-card-border)] py-8">
                <p className="text-sm font-medium uppercase tracking-wide">{wish.name}</p>
                <p className="mt-3 leading-relaxed text-[var(--tmpl-muted)]">
                  {wish.message}
                </p>
              </div>
            </TemplateSectionReveal>
          ))
        )}
      </div>
    </section>
  );
}
