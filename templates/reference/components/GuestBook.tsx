"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

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
  } = useWishes(data.wishes, data.guest?.name ?? "");

  return (
    <section id="wishes" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-8 text-4xl md:text-5xl">{t("wishes")}</h2>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form onSubmit={onSubmit} className="mx-auto mb-12 max-w-lg space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input
              {...register("name")}
              className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={4}
              className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-accent)]">{t("wishSuccess")}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--tmpl-accent)] px-6 py-3 text-sm font-medium text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("wishSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>

      <div className="mx-auto max-w-3xl space-y-4">
        {wishes.length === 0 ? (
          <p className="text-center text-[var(--tmpl-muted)]">{t("noWishes")}</p>
        ) : (
          wishes.map((wish, index) => (
            <TemplateSectionReveal
              key={wish.id}
              motion={motion}
              delay={(index % 5) * 0.05}
            >
              <div className="rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-6">
                <p className="font-medium">{wish.name}</p>
                <p className="mt-2 leading-relaxed text-[var(--tmpl-muted)]">
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
