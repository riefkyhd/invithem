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
  } = useRsvp(data.projectId, data.guest?.id, data.guest?.name ?? "");

  if (submitted) {
    return (
      <section id="rsvp" className="px-6 py-24 md:px-12 lg:px-24">
        <TemplateSectionReveal motion={motion}>
          <div className="mx-auto max-w-md text-center">
            <span className="dl-ornament">◆</span>
            <p className="tmpl-display mt-6 text-2xl font-light text-[var(--tmpl-accent)]">
              {t("rsvpSuccess")}
            </p>
          </div>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-md text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("rsvp")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-24" />
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-md space-y-6">
          <div>
            <label className="mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input {...register("name")} className="dl-input" />
            {errors.name && (
              <p className="mt-1 text-center text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 block w-full text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center justify-center gap-3 border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm font-light transition-all has-[:checked]:border-[var(--tmpl-accent)] has-[:checked]:shadow-[0_0_0_1px_var(--tmpl-accent)]"
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
                <label className="mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpGuestCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  {...register("guest_count", { valueAsNumber: true })}
                  className="dl-input text-center"
                />
              </div>
              <div>
                <label className="mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpMeal")}
                </label>
                <select {...register("meal_preference")} className="dl-input">
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-center text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea {...register("message")} rows={3} className="dl-input resize-none" />
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

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
