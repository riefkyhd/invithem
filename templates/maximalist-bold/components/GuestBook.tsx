"use client";

import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const inputClass =
  "tmpl-body w-full border-2 border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-coral)]";

const WISH_ACCENTS = [
  "border-l-4 border-[var(--tmpl-coral)]",
  "border-l-4 border-[var(--tmpl-chartreuse)]",
  "border-l-4 border-[var(--tmpl-purple)]",
] as const;

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
    <section id="wishes" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-12 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("wishes")}
        </h2>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form
          onSubmit={onSubmit}
          className="mb-16 max-w-lg space-y-8 border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] p-8 shadow-[10px_10px_0_var(--tmpl-chartreuse)]"
        >
          <div>
            <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="tmpl-body mt-1 text-sm text-[var(--tmpl-coral)]">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={inputClass} />
            {errors.message && (
              <p className="tmpl-body mt-1 text-sm text-[var(--tmpl-coral)]">
                {errors.message.message}
              </p>
            )}
          </div>
          {error && (
            <p className="tmpl-body text-sm text-[var(--tmpl-coral)]">{error}</p>
          )}
          {submitted && (
            <p className="tmpl-body text-sm font-medium text-[var(--tmpl-purple)]">
              {t("wishSuccess")}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mb-color-coral tmpl-body px-10 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {t("wishSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>

      <div className="max-w-2xl space-y-4">
        {wishes.length === 0 ? (
          <p className="tmpl-body text-[var(--tmpl-muted)]">{t("noWishes")}</p>
        ) : (
          wishes.map((wish, index) => (
            <TemplateSectionReveal
              key={wish.id}
              motion={motion}
              delay={(index % 5) * 0.05}
            >
              <div
                className={`bg-[var(--tmpl-card)] py-6 pl-6 pr-4 ${WISH_ACCENTS[index % WISH_ACCENTS.length]}`}
              >
                <p className="tmpl-display text-sm font-bold uppercase tracking-wide">
                  {wish.name}
                </p>
                <p className="tmpl-body mt-3 leading-relaxed text-[var(--tmpl-muted)]">
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
