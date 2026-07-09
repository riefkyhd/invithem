"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { EventDetailsProps, WeddingEventData } from "@/lib/types/wedding-data";
import { BatikBorder } from "../assets/BatikBorder";
import { BwEyebrow, BwPrimaryButton, BwSectionTitle } from "../ui";
import { motion } from "../motion";

function EventCard({ event, locale }: { event: WeddingEventData; locale: "id" | "en" }) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);
  const dateLocale = locale === "id" ? idLocale : enUS;
  const timeLabel = event.datetime
    ? format(new Date(event.datetime), "hh:mm a", { locale: dateLocale })
    : event.time;

  function openMaps() {
    const query = encodeURIComponent(`${event.venueName} ${event.venueAddress}`.trim());
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div id={`event-${slug}`} className="bw-event-card overflow-hidden">
      <BatikBorder />
      <div className="p-8">
        <p className="tmpl-body text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--tmpl-accent)]">
          {timeLabel}
        </p>
        <h3 className="tmpl-display mt-3 text-2xl font-semibold text-[var(--tmpl-heading)]">
          {event.label}
        </h3>
        <div className="mt-5 flex gap-3">
          <span className="mt-0.5 text-[var(--tmpl-accent-secondary)]" aria-hidden>
            ◎
          </span>
          <div className="tmpl-body text-sm leading-relaxed text-[var(--tmpl-muted)]">
            <p className="font-medium text-[var(--tmpl-fg)]">{event.venueName}</p>
            <p className="mt-1 break-words">{event.venueAddress}</p>
          </div>
        </div>
        <BwPrimaryButton
          type="button"
          variant="outline"
          onClick={openMaps}
          className="mt-8 w-full sm:w-auto"
        >
          {t("viewOnMaps")}
        </BwPrimaryButton>
      </div>
    </div>
  );
}

export function EventDetails({ data }: EventDetailsProps) {
  const { locale } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  const dateLocale = locale === "id" ? idLocale : enUS;
  const headerDate = format(new Date(data.weddingDate), "d MMMM yyyy", {
    locale: dateLocale,
  });

  return (
    <section id="events" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <BwEyebrow>{locale === "id" ? "Agenda Acara" : "The Ceremonies"}</BwEyebrow>
            <BwSectionTitle className="mt-3">
              {locale === "id" ? "Detail Acara" : "Event Details"}
            </BwSectionTitle>
          </div>
          <p className="tmpl-body shrink-0 text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
            {headerDate}
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {events.map((event, index) => (
            <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.08}>
              <EventCard event={event} locale={locale} />
            </TemplateSectionReveal>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
