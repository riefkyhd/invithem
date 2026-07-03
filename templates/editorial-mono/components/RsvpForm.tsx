"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const inputClass =
  "w-full border-b border-[var(--tmpl-card-border)] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-fg)]";

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
      <section id="rsvp" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <TemplateSectionReveal motion={motion}>
          <p className="ml-[4vw] text-lg text-[var(--tmpl-fg)]">{t("rsvpSuccess")}</p>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-16 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("rsvp")}
        </h2>
        <form onSubmit={onSubmit} className="ml-[4vw] max-w-lg space-y-8">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--tmpl-fg)]">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-4">
            <legend className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="flex gap-6">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-fg)]"
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
                <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpGuestCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  {...register("guest_count", { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {t("rsvpMeal")}
                </label>
                <select
                  {...register("meal_preference")}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea {...register("message")} rows={3} className={inputClass} />
          </div>

          {error && <p className="text-sm text-[var(--tmpl-fg)]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--tmpl-fg)] px-10 py-3 text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </section>
  );
}
