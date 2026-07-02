"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { downloadIcsFile } from "@/lib/utils/ics";
import type { EventDetailsProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function EventDetails({ data }: EventDetailsProps) {
  const { t } = useI18n();

  function handleAddToCalendar() {
    const start = new Date(data.weddingDate);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    downloadIcsFile({
      title: `${data.couple.groomName} & ${data.couple.brideName} Wedding`,
      description: `Ceremony at ${data.venues.ceremony.name}`,
      location: data.venues.ceremony.address,
      start,
      end,
    });
  }

  return (
    <section id="events" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-12 text-4xl md:text-5xl">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <TemplateSectionReveal motion={motion} delay={0.1}>
          <EventCard
            title={t("ceremony")}
            time={data.venues.ceremony.time}
            venue={data.venues.ceremony.name}
            address={data.venues.ceremony.address}
            mapsUrl={data.venues.ceremony.mapsEmbedUrl}
          />
        </TemplateSectionReveal>
        <TemplateSectionReveal motion={motion} delay={0.2}>
          <EventCard
            title={t("reception")}
            time={data.venues.reception.time}
            venue={data.venues.reception.name}
            address={data.venues.reception.address}
            mapsUrl={data.venues.reception.mapsEmbedUrl}
          />
        </TemplateSectionReveal>
      </div>

      <TemplateSectionReveal motion={motion} className="mt-10 text-center" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="rounded-full border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-6 py-3 text-sm transition-colors hover:border-[var(--tmpl-accent)]"
        >
          {t("addToCalendar")}
        </button>
      </TemplateSectionReveal>
    </section>
  );
}

function EventCard({
  title,
  time,
  venue,
  address,
  mapsUrl,
}: {
  title: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-8">
      <h3 className="tmpl-display text-2xl">{title}</h3>
      <div className="mt-6 space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
            {t("time")}
          </p>
          <p className="mt-1">{time}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
            {t("venue")}
          </p>
          <p className="mt-1 font-medium">{venue}</p>
          <p className="mt-1 text-[var(--tmpl-muted)]">{address}</p>
        </div>
      </div>
      {mapsUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl">
          <iframe
            src={mapsUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map for ${venue}`}
          />
        </div>
      )}
    </div>
  );
}
