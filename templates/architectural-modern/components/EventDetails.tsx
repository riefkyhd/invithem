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
    <section id="events" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-6xl">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("eventDetails")}
          </h2>
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-[var(--tmpl-grid)] md:grid-cols-2">
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
    <div className="flex h-full flex-col bg-[var(--tmpl-bg)] p-8 md:p-10">
      <h3 className="tmpl-display border-b border-[var(--tmpl-grid)] pb-4 text-lg font-semibold uppercase tracking-[-0.03em] md:text-xl">
        {title}
      </h3>

      <div className="mt-8 space-y-6 text-sm">
        <div className="border-b border-[var(--tmpl-grid)] pb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("time")}
          </p>
          <p className="mt-2 font-medium">{time}</p>
        </div>
        <div className="border-b border-[var(--tmpl-grid)] pb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("venue")}
          </p>
          <p className="mt-2 font-medium">{venue}</p>
          <p className="mt-1 text-[var(--tmpl-muted)]">{address}</p>
        </div>
      </div>

      {mapsUrl && (
        <div className="mt-8 aspect-video w-full overflow-hidden border border-[var(--tmpl-grid)]">
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
