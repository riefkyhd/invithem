"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const inputClass =
  "tmpl-body w-full border-2 border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-coral)]";

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
      <section id="rsvp" className="px-6 py-20 md:px-12 md:py-28">
        <TemplateSectionReveal motion={motion}>
          <div className="mb-color-chartreuse inline-block px-8 py-6">
            <p className="tmpl-body text-lg font-semibold">{t("rsvpSuccess")}</p>
          </div>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-12 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("rsvp")}
        </h2>
        <form
          onSubmit={onSubmit}
          className="max-w-lg space-y-8 border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] p-8 shadow-[10px_10px_0_var(--tmpl-coral)]"
        >
          <div>
            <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
              {t("rsvpName")}
            </label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="tmpl-body mt-1 text-sm text-[var(--tmpl-coral)]">
                {errors.name.message}
              </p>
            )}
          </div>

          <fieldset className="space-y-4">
            <legend className="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
              {t("rsvpAttending")}
            </legend>
            <div className="flex flex-wrap gap-4">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="tmpl-body flex cursor-pointer items-center gap-3 text-sm font-medium"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-coral)]"
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
                <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
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
                <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
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
            <label className="tmpl-body mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
              {t("rsvpMessage")}
            </label>
            <textarea {...register("message")} rows={3} className={inputClass} />
          </div>

          {error && (
            <p className="tmpl-body text-sm text-[var(--tmpl-coral)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mb-color-purple tmpl-body px-10 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </section>
  );
}
