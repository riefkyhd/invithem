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
      <section id="rsvp" className="px-6 py-20 md:px-12 lg:px-24">
        <TemplateSectionReveal motion={motion}>
          <p className="text-center text-lg text-[var(--tmpl-accent)]">
            {t("rsvpSuccess")}
          </p>
        </TemplateSectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-8 text-4xl md:text-5xl">{t("rsvp")}</h2>
        <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input
              {...register("name")}
              className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 transition-all has-[:checked]:border-[var(--tmpl-accent)] has-[:checked]:ring-2 has-[:checked]:ring-[var(--tmpl-accent)]/20"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-accent)]"
                    {...register("attending")}
                  />
                  <span className="text-sm">
                    {value === "yes" ? t("rsvpYes") : t("rsvpNo")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
                  {t("rsvpGuestCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  {...register("guest_count", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
                  {t("rsvpMeal")}
                </label>
                <select
                  {...register("meal_preference")}
                  className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
                >
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className="w-full rounded-xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--tmpl-accent)] px-6 py-3 text-sm font-medium text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </section>
  );
}
