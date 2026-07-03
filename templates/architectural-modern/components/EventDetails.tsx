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
      ? "grid grid-cols-1 gap-px bg-[var(--tmpl-grid)]"
      : events.length === 2
        ? "grid grid-cols-1 gap-px bg-[var(--tmpl-grid)] md:grid-cols-2"
        : "grid grid-cols-1 gap-px bg-[var(--tmpl-grid)] sm:grid-cols-2";

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
    <section id="events" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-6xl">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("eventDetails")}
          </h2>
        </div>
      </TemplateSectionReveal>

      <div className={`mx-auto max-w-6xl ${gridClass}`}>
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.1}>
            <SharedEventCard
              event={event}
              cardClassName="flex h-full flex-col bg-[var(--tmpl-bg)] p-8 md:p-10"
              titleClassName="tmpl-display border-b border-[var(--tmpl-grid)] pb-4 text-lg font-semibold uppercase tracking-[-0.03em] md:text-xl"
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} delay={0.3} className="mx-auto mt-10 max-w-6xl">
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] px-8 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-accent-fg)] transition-opacity hover:opacity-85"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}
