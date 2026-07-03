"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { downloadIcsFile } from "@/lib/utils/ics";
import { SharedEventCard } from "@/templates/shared/EventCard";
import type { EventDetailsProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function EventDetails({ data }: EventDetailsProps) {
  const { t } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  const gridClass =
    events.length === 1
      ? "mx-auto grid max-w-xl gap-8"
      : events.length === 2
        ? "mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
        : "mx-auto grid max-w-5xl gap-8 sm:grid-cols-2";

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
    <section id="events" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion} className="text-center">
        <BotanicalDivider variant="branch" drift className="mx-auto mb-6 opacity-70" />
        <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className={`mt-14 ${gridClass}`}>
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.1}>
            <SharedEventCard
              event={event}
              cardClassName="overflow-hidden rounded-2xl border-2 border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-8 shadow-sm"
              titleClassName="tmpl-display text-2xl text-[var(--tmpl-fg)]"
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} className="mt-12 text-center" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="rounded-full border-2 border-[var(--tmpl-accent)] bg-transparent px-8 py-3 text-sm text-[var(--tmpl-olive)] transition-colors hover:bg-[var(--tmpl-accent)]/10"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}
