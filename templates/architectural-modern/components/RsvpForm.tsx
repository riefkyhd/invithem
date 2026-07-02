"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const inputClass =
  "w-full border-0 border-b border-[var(--tmpl-grid)] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-fg)]";

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
      <section id="rsvp" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
        <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
          <p className="text-base text-[var(--tmpl-fg)]">{t("rsvpSuccess")}</p>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("rsvp")}
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--tmpl-accent)]">
                {errors.name.message}
              </p>
            )}
          </div>

          <fieldset className="space-y-4">
            <legend className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="flex gap-8">
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
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
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
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
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
            <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea {...register("message")} rows={3} className={inputClass} />
          </div>

          {error && <p className="text-sm text-[var(--tmpl-accent)]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-10 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </section>
  );
}
