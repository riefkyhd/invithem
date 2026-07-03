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
      ? "grid max-w-2xl gap-16"
      : events.length === 2
        ? "grid gap-16 md:grid-cols-2 md:gap-16 lg:gap-24"
        : "grid gap-16 sm:grid-cols-2";

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
    <section id="events" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-20 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className={`ml-[4vw] ${gridClass}`}>
        {events.map((event, index) => (
          <TemplateSectionReveal
            key={event.id}
            motion={motion}
            delay={index * 0.1}
          >
            <SharedEventCard
              event={event}
              cardClassName="border-t border-[var(--tmpl-fg)] pt-8"
              titleClassName="tmpl-display text-xl font-medium uppercase tracking-[-0.02em] md:text-2xl"
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} className="ml-[4vw] mt-16" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="border border-[var(--tmpl-fg)] px-8 py-3 text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-60"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}
