"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { EventDetailsProps, WeddingEventData } from "@/lib/types/wedding-data";
import { ReferencePrimaryButton, SectionHeading } from "../ui";
import { motion } from "../motion";

function EventIcon({ label }: { label: string }) {
  const isCeremony = /akad|ceremony|nikah/i.test(label);
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tmpl-accent)] text-white">
      {isCeremony ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M12 2 4 9h2v11h12V9h2L12 2zm0 3.5L17 10v9H7v-9l5-4.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M4 10h16v2H4v-2zm2 4h12v2H6v-2zm1 4h10v2H7v-2z" />
        </svg>
      )}
    </div>
  );
}

function ReferenceEventCard({
  event,
  locale,
}: {
  event: WeddingEventData;
  locale: "id" | "en";
}) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);
  const dateLocale = locale === "id" ? idLocale : enUS;
  const eventDate = event.datetime
    ? format(new Date(event.datetime), "EEEE, d MMMM yyyy", { locale: dateLocale })
    : "";
  const eventTime = event.datetime
    ? format(new Date(event.datetime), "HH.mm") + " WIB"
    : event.time;

  function openMaps() {
    const query = encodeURIComponent(
      `${event.venueName} ${event.venueAddress}`.trim()
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div
      id={`event-${slug}`}
      className="relative rounded-2xl border border-white/50 bg-white/70 p-8 pt-20 text-center shadow-md backdrop-blur-sm"
    >
      <div className="absolute left-1/2 top-8 -translate-x-1/2">
        <EventIcon label={event.label} />
      </div>
      <h3 className="tmpl-display text-2xl text-[var(--tmpl-heading)]">{event.label}</h3>
      {eventDate && (
        <p className="mt-2 text-lg font-semibold text-[var(--tmpl-heading)]">{eventDate}</p>
      )}
      {eventTime && (
        <p className="mt-1 text-base text-[var(--tmpl-body-muted)]">{eventTime}</p>
      )}
      <div className="mt-6 border-t border-[var(--tmpl-card-border)]/50 pt-4">
        <p className="font-medium text-[var(--tmpl-heading)]">{event.venueName}</p>
        <p className="mt-1 text-xs text-[var(--tmpl-muted)]">{event.venueAddress}</p>
      </div>
      <ReferencePrimaryButton
        type="button"
        onClick={openMaps}
        className="mt-8 px-6 py-2 text-sm"
      >
        {t("viewOnMaps")}
      </ReferencePrimaryButton>
    </div>
  );
}

export function EventDetails({ data }: EventDetailsProps) {
  const { locale, t } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="events" className="bg-[var(--tmpl-section-tint)] px-6 py-16">
      <TemplateSectionReveal motion={motion}>
        <SectionHeading title={t("agendaAcara")} className="mb-10" />
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-md flex-col gap-8">
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.1}>
            <ReferenceEventCard event={event} locale={locale} />
          </TemplateSectionReveal>
        ))}
      </div>
    </section>
  );
}
