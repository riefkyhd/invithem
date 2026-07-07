"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { MnEyebrow, MnPrimaryButton, mnFieldClass } from "../ui";
import { motion } from "../motion";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-md space-y-16">
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
      className={highlight ? "border-l-2 border-black pl-6" : undefined}
    >
      <TemplateSectionReveal motion={motion}>
        {showTitle && (
          <h2 className="tmpl-display mb-10 text-5xl leading-none text-[var(--tmpl-fg)]">
            RSVP
          </h2>
        )}
        <MnEyebrow>{eventLabel}</MnEyebrow>

        <form onSubmit={onSubmit} className="mt-10 space-y-8">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpName")}
            </label>
            <input
              {...register("name")}
              className={mnFieldClass}
              aria-label={t("rsvpName")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpAttending")}
            </legend>
            <div className="flex gap-8">
              {(["yes", "no"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 text-sm uppercase tracking-[0.12em]"
                >
                  <input
                    type="radio"
                    value={value}
                    className="accent-black"
                    {...register("attending")}
                  />
                  <span>{value === "yes" ? t("rsvpYes") : t("rsvpNo")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {t("rsvpGuestCount")}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                {...register("guest_count", { valueAsNumber: true })}
                className={mnFieldClass}
                aria-label={t("rsvpGuestCount")}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("rsvpMessage")}
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className={mnFieldClass}
              aria-label={t("rsvpMessage")}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <MnPrimaryButton type="submit" disabled={isSubmitting} variant="solid">
            {t("rsvpSubmit")}
          </MnPrimaryButton>
        </form>
      </TemplateSectionReveal>
    </div>
  );
}
