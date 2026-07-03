"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { downloadIcsFile } from "@/lib/utils/ics";
import { SharedEventCard } from "@/templates/shared/EventCard";
import type { EventDetailsProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const CARD_SHADOWS = [
  "shadow-[8px_8px_0_var(--tmpl-coral)]",
  "shadow-[8px_8px_0_var(--tmpl-purple)]",
  "shadow-[8px_8px_0_var(--tmpl-chartreuse)]",
] as const;

export function EventDetails({ data }: EventDetailsProps) {
  const { t } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  const gridClass =
    events.length === 1
      ? "mx-auto grid max-w-2xl gap-8"
      : events.length === 2
        ? "mx-auto grid max-w-4xl gap-8 md:grid-cols-2"
        : "mx-auto grid max-w-4xl gap-8 sm:grid-cols-2";

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
    <section id="events" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-14 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className={gridClass}>
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.1}>
            <SharedEventCard
              event={event}
              cardClassName={`overflow-hidden border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] px-6 py-8 ${CARD_SHADOWS[index % CARD_SHADOWS.length]}`}
              titleClassName="tmpl-display text-xl font-extrabold uppercase tracking-[-0.02em] md:text-2xl"
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} className="mt-12 text-center" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="mb-color-chartreuse tmpl-body inline-block px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity hover:opacity-80"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}
