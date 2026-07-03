"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="botanical-section px-6 py-20 md:px-12 lg:px-24">
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
        <TemplateSectionReveal motion={motion} className="text-center">
          <BotanicalDivider variant="leaves" className="mx-auto mb-6 opacity-60" />
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
      className={highlight ? "rounded-2xl ring-2 ring-[var(--tmpl-accent-secondary)]/30" : ""}
    >
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <BotanicalDivider variant="branch" drift className="mx-auto mb-6 opacity-60" />
          <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
            {t("rsvp")}
          </h2>
          <p className="tmpl-body mt-3 text-sm uppercase tracking-[0.2em] text-[var(--tmpl-accent)]">
            {eventLabel}
          </p>
        </div>
        <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-lg space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("rsvpName")}
            </label>
            <input
              {...register("name")}
              className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 transition-all has-[:checked]:border-[var(--tmpl-accent-secondary)] has-[:checked]:bg-[var(--tmpl-accent-secondary)]/5"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-accent-secondary)]"
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
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
                  {t("rsvpGuestCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  {...register("guest_count", { valueAsNumber: true })}
                  className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
                  {t("rsvpMeal")}
                </label>
                <select
                  {...register("meal_preference")}
                  className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
                >
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("rsvpMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className="w-full rounded-2xl border-2 border-[var(--tmpl-card-border)]/50 bg-[var(--tmpl-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--tmpl-accent)]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--tmpl-accent-secondary)] px-6 py-3.5 text-sm font-medium text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("rsvpSubmit")}
          </button>
        </form>
      </TemplateSectionReveal>
    </div>
  );
}
