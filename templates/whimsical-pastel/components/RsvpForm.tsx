"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { SectionTitle, WpPrimaryButton, wpFieldClass } from "../ui";
import { motion } from "../motion";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-md space-y-10">
        {events.map((event, index) => (
          <EventRsvpForm
            key={event.id}
            data={data}
            eventId={event.id}
            eventLabel={event.label}
            highlight={highlightEventLabel === event.label}
            showTitle={index === 0}
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
  showTitle,
}: {
  data: RsvpFormProps["data"];
  eventId: string;
  eventLabel: string;
  highlight?: boolean;
  showTitle: boolean;
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
        <RsvpConfirmation
          guestName={data.guest?.name ?? ""}
          eventLabel={eventLabel}
          checkinToken={checkinToken}
        />
      </div>
    );
  }

  return (
    <div
      id={`rsvp-${slug}`}
      className={highlight ? "rounded-[2rem] ring-2 ring-[var(--tmpl-sage)]/40" : undefined}
    >
      <TemplateSectionReveal motion={motion}>
        {showTitle && (
          <div className="mb-8 text-center">
            <SectionTitle>{t("rsvp")}</SectionTitle>
          </div>
        )}
        <p className="tmpl-display mb-6 text-center text-xl text-[var(--tmpl-heading)]">
          {eventLabel}
        </p>

        <form onSubmit={onSubmit} className="wp-card space-y-5 p-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--tmpl-heading)]">
              {t("rsvpName")}
            </label>
            <input
              {...register("name")}
              className={wpFieldClass}
              aria-label={t("rsvpName")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium text-[var(--tmpl-heading)]">
              {t("rsvpAttending")}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--tmpl-card-border)] bg-white px-4 py-3 has-[:checked]:border-[var(--tmpl-sage)] has-[:checked]:ring-2 has-[:checked]:ring-[var(--tmpl-sage)]/20"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-[var(--tmpl-accent)]"
                    {...register("attending")}
                  />
                  <span className="text-sm">{value === "yes" ? t("rsvpYes") : t("rsvpNo")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--tmpl-heading)]">
                {t("rsvpGuestCount")}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                {...register("guest_count", { valueAsNumber: true })}
                className={wpFieldClass}
                aria-label={t("rsvpGuestCount")}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--tmpl-heading)]">
              {t("rsvpMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className={wpFieldClass}
              aria-label={t("rsvpMessage")}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <WpPrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full normal-case tracking-normal"
          >
            {t("rsvpSubmit")}
          </WpPrimaryButton>
        </form>
      </TemplateSectionReveal>
    </div>
  );
}
