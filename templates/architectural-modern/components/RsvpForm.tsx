"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const inputClass =
  "w-full border-0 border-b border-[var(--tmpl-grid)] bg-transparent px-0 py-3 text-sm outline-none transition-colors focus:border-[var(--tmpl-fg)]";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-lg space-y-20">
        {events.map((event) => (
          <EventRsvpForm
            key={event.id}
            data={data}
            eventId={event.id}
            eventLabel={event.label}
            highlight={highlightEventLabel === event.label}
          />
        ))}
      </div>
    </section>
  );
}

function EventRsvpForm({
  data,
  eventId,
  eventLabel,
  highlight,
}: {
  data: RsvpFormProps["data"];
  eventId: string;
  eventLabel: string;
  highlight?: boolean;
}) {
  const {
    attending,
    submitted,
    error,
    checkinToken,
    onSubmit,
    isSubmitting,
    errors,
    register,
    t,
  } = useRsvp(
    data.projectId,
    eventId,
    eventLabel,
    data.guest?.id,
    data.guest?.name ?? ""
  );

  const slug = eventSlugFromLabel(eventLabel);

  if (submitted) {
    return (
      <div id={`rsvp-${slug}`}>
        <TemplateSectionReveal motion={motion}>
          <RsvpConfirmation
            guestName={data.guest?.name ?? ""}
            eventLabel={eventLabel}
            checkinToken={checkinToken}
          />
        </TemplateSectionReveal>
      </div>
    );
  }

  return (
    <div
      id={`rsvp-${slug}`}
      className={highlight ? "border border-[var(--tmpl-accent)] p-6" : ""}
    >
      <TemplateSectionReveal motion={motion}>
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("rsvp")}
          </h2>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {eventLabel}
          </p>
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
    </div>
  );
}
