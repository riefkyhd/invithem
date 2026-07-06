"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import {
  ReferencePrimaryButton,
  ReferenceTextArea,
  ReferenceTextField,
  SectionHeading,
} from "../ui";
import { motion } from "../motion";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="px-6 py-16">
      <div className="mx-auto max-w-md space-y-12">
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
      className={
        highlight
          ? "rounded-2xl ring-2 ring-[var(--tmpl-gold)]/40"
          : undefined
      }
    >
      <TemplateSectionReveal motion={motion}>
        <SectionHeading title={t("rsvp")} subtitle={eventLabel} className="mb-8" />

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <ReferenceTextField
              {...register("name")}
              placeholder={t("rsvpName")}
              aria-label={t("rsvpName")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--tmpl-card-border)] bg-white px-4 py-3 transition-all has-[:checked]:border-[var(--tmpl-gold)] has-[:checked]:ring-2 has-[:checked]:ring-[var(--tmpl-gold)]/20"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-heading)]"
                    {...register("attending")}
                  />
                  <span className="text-sm text-[var(--tmpl-heading)]">
                    {value === "yes" ? t("rsvpYes") : t("rsvpNo")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <>
              <div>
                <ReferenceTextField
                  type="number"
                  min={1}
                  max={10}
                  {...register("guest_count", { valueAsNumber: true })}
                  placeholder={t("rsvpGuestCount")}
                  aria-label={t("rsvpGuestCount")}
                />
              </div>
              <div>
                <select
                  {...register("meal_preference")}
                  className="w-full rounded-lg border border-[var(--tmpl-card-border)] bg-white px-4 py-3 text-sm text-[var(--tmpl-heading)] outline-none focus:border-[var(--tmpl-gold)]"
                >
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <ReferenceTextArea
              {...register("message")}
              rows={3}
              placeholder={t("rsvpMessage")}
              aria-label={t("rsvpMessage")}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end pt-2">
            <ReferencePrimaryButton
              type="submit"
              disabled={isSubmitting}
              className="px-10"
            >
              {t("rsvpSubmit")}
            </ReferencePrimaryButton>
          </div>
        </form>
      </TemplateSectionReveal>
    </div>
  );
}
