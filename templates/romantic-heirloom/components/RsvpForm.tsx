"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function RsvpForm({ data }: RsvpFormProps) {
  const {
    attending,
    submitted,
    error,
    onSubmit,
    isSubmitting,
    errors,
    register,
    t,
  } = useRsvp(data.guest?.id, data.guest?.name ?? "");

  if (submitted) {
    return (
      <section id="rsvp" className="px-6 py-24 md:px-12 lg:px-24">
        <TemplateSectionReveal motion={motion}>
          <div className="mx-auto max-w-md text-center">
            <div className="rh-monogram-frame mx-auto inline-block">
              <span className="tmpl-display text-3xl font-medium tracking-[0.15em] text-[var(--tmpl-accent)]">
                {data.couple.monogram}
              </span>
            </div>
            <p className="tmpl-display mt-8 text-2xl font-medium text-[var(--tmpl-fg)]">
              {t("rsvpSuccess")}
            </p>
            <div className="rh-gold-rule mx-auto mt-6 w-24" />
          </div>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-md text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("rsvp")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-24" />
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-md space-y-6">
          <div>
            <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input {...register("name")} className="rh-input" />
            {errors.name && (
              <p className="mt-1 text-center text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="tmpl-body mb-3 block w-full text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center justify-center gap-3 border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] px-4 py-3 text-sm font-light transition-all has-[:checked]:border-[var(--tmpl-accent)] has-[:checked]:shadow-[0_0_0_1px_var(--tmpl-accent)]"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-accent)]"
                    {...register("attending")}
                  />
                  <span>{value === "yes" ? t("rsvpYes") : t("rsvpNo")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <>
              <div>
                <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpGuestCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  {...register("guest_count", { valueAsNumber: true })}
                  className="rh-input text-center"
                />
              </div>
              <div>
                <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpMeal")}
                </label>
                <select {...register("meal_preference")} className="rh-input">
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="tmpl-body mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea {...register("message")} rows={3} className="rh-input resize-none" />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </section>
  );
}
