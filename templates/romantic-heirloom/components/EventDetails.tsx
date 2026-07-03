"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { downloadIcsFile } from "@/lib/utils/ics";
import { SharedEventCard } from "@/templates/shared/EventCard";
import type { EventDetailsProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function EventDetails({ data }: EventDetailsProps) {
  const { t } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  const gridClass =
    events.length === 1
      ? "mx-auto grid max-w-md gap-10"
      : events.length === 2
        ? "mx-auto grid max-w-3xl gap-10 md:grid-cols-2"
        : "mx-auto grid max-w-3xl gap-10 sm:grid-cols-2";

  function handleAddToCalendar() {
    const first = events[0];
    const start = first.datetime ? new Date(first.datetime) : new Date(data.weddingDate);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    downloadIcsFile({
      title: `${data.couple.groomName} & ${data.couple.brideName} Wedding`,
      description: `${first.label} at ${first.venueName}`,
      location: first.venueAddress,
      start,
      end,
    });
  }

  return (
    <section id="events" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("eventDetails")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className={`mt-16 ${gridClass}`}>
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.1}>
            <SharedEventCard
              event={event}
              cardClassName="rh-card-top-border bg-[var(--tmpl-card)] px-8 py-10 text-center shadow-sm"
              titleClassName="tmpl-display text-2xl font-medium tracking-wide text-[var(--tmpl-fg)]"
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} className="mt-12 text-center" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="border border-[var(--tmpl-gold)] px-8 py-3 text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-fg)] transition-colors hover:bg-[var(--tmpl-surface)]"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}
