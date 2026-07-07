"use client";

import { useI18n } from "@/lib/i18n/context";
import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import { TemplateEmptyState } from "@/templates/shared/TemplateEmptyState";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import { MnPrimaryButton, mnFieldClass } from "../ui";
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
    <section id="wishes" className="px-6 py-20 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display text-center text-5xl leading-none text-[var(--tmpl-fg)]">
          {t("wishes")}
        </h2>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.08}>
        <form onSubmit={onSubmit} className="mn-card mx-auto mt-12 max-w-md space-y-8 p-10">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishName")}
            </label>
            <input {...register("name")} className={mnFieldClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("wishMessage")}
            </label>
            <textarea {...register("message")} rows={4} className={mnFieldClass} />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-muted)]">{t("wishSuccess")}</p>
          )}
          <MnPrimaryButton type="submit" disabled={isSubmitting} variant="solid" className="w-full">
            {t("wishSubmit")}
          </MnPrimaryButton>
        </form>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.12} className="mt-14">
        <p className="tmpl-body text-center text-[10px] uppercase tracking-[0.4em] text-[var(--tmpl-muted)]">
          {locale === "id" ? "Ucapan Terbaru" : "Recent Wishes"}
        </p>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <div className="mx-auto mt-8 max-w-md">
          <GuestBookSkeleton cardClassName="border-t border-black/10 py-8" />
        </div>
      ) : (
        <div className="mx-auto mt-6 max-h-[28rem] max-w-md space-y-0 overflow-y-auto">
          {wishes.length === 0 ? (
            <TemplateEmptyState title={t("noWishes")} />
          ) : (
            wishes.map((wish, index) => (
              <TemplateSectionReveal
                key={wish.id}
                motion={motion}
                delay={(index % 5) * 0.04}
              >
                <div className="border-t border-black/10 py-8">
                  <p className="tmpl-body text-sm font-semibold uppercase tracking-[0.12em]">
                    {wish.name}
                  </p>
                  <p className="tmpl-display mt-3 text-lg italic leading-relaxed text-[var(--tmpl-muted)]">
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
