"use client";

import { useRsvp } from "@/lib/invitation/hooks/use-rsvp";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { RsvpConfirmation } from "@/templates/shared/RsvpConfirmation";
import type { RsvpFormProps } from "@/lib/types/wedding-data";
import { BwPrimaryButton, BwSectionTitle, bwFieldClass } from "../ui";
import { motion } from "../motion";

export function RsvpForm({ data, highlightEventLabel }: RsvpFormProps) {
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="rsvp" className="px-6 py-24 md:px-8">
      <div className="mx-auto max-w-lg space-y-16">
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
      className={highlight ? "border-l-2 border-[var(--tmpl-accent)] pl-6" : undefined}
    >
      <TemplateSectionReveal motion={motion}>
        <div className="bw-card p-8">
          {showTitle && (
            <BwSectionTitle className="text-center">{t("rsvp")}</BwSectionTitle>
          )}
          <p className="tmpl-body mt-4 text-center text-sm uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
            {eventLabel}
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <Field label={t("rsvpName")} error={errors.name?.message}>
              <input {...register("name")} className={bwFieldClass} aria-label={t("rsvpName")} />
            </Field>

            <fieldset>
              <legend className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
                {t("rsvpAttending")}
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                {(["yes", "no"] as const).map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-sm text-[var(--tmpl-fg)]"
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
              <Field label={t("rsvpGuestCount")}>
                <input
                  type="number"
                  min={1}
                  max={10}
                  {...register("guest_count", { valueAsNumber: true })}
                  className={bwFieldClass}
                  aria-label={t("rsvpGuestCount")}
                />
              </Field>
            )}

            <Field label={t("rsvpMessage")}>
              <textarea
                {...register("message")}
                rows={3}
                className={bwFieldClass}
                aria-label={t("rsvpMessage")}
              />
            </Field>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-center pt-2">
              <BwPrimaryButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {t("rsvpSubmit")}
              </BwPrimaryButton>
            </div>
          </form>
        </div>
      </TemplateSectionReveal>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
