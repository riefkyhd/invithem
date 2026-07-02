"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
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
      <TemplateSectionReveal motion={motion} className="text-center">
        <BotanicalDivider variant="leaves" drift className="mx-auto mb-6 opacity-60" />
        <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
          {t("wishes")}
        </h2>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form onSubmit={onSubmit} className="mx-auto mb-14 mt-10 max-w-lg space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("wishName")}
            </label>
            <input
              {...register("name")}
              className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("wishMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={4}
              className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-accent-secondary)]">
              {t("wishSuccess")}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--tmpl-accent-secondary)] px-6 py-3.5 text-sm font-medium text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
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
              <div className="rounded-2xl border-2 border-[var(--tmpl-card-border)]/40 bg-[var(--tmpl-card)] p-6 shadow-sm">
                <p className="tmpl-display text-lg text-[var(--tmpl-fg)]">
                  {wish.name}
                </p>
                <p className="tmpl-body mt-2 leading-relaxed text-[var(--tmpl-muted)]">
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
