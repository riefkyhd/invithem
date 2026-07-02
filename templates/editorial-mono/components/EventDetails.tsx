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
    <section id="events" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-20 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className="ml-[4vw] flex max-w-5xl flex-col gap-20 md:flex-row md:gap-16 lg:gap-24">
        <TemplateSectionReveal motion={motion} delay={0.1} className="flex-1 md:mt-8">
          <EventCard
            title={t("ceremony")}
            time={data.venues.ceremony.time}
            venue={data.venues.ceremony.name}
            address={data.venues.ceremony.address}
            mapsUrl={data.venues.ceremony.mapsEmbedUrl}
          />
        </TemplateSectionReveal>
        <TemplateSectionReveal motion={motion} delay={0.2} className="flex-1 md:mt-20">
          <EventCard
            title={t("reception")}
            time={data.venues.reception.time}
            venue={data.venues.reception.name}
            address={data.venues.reception.address}
            mapsUrl={data.venues.reception.mapsEmbedUrl}
          />
        </TemplateSectionReveal>
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
    <div className="border-t border-[var(--tmpl-fg)] pt-8">
      <h3 className="tmpl-display text-xl font-medium uppercase tracking-[-0.02em] md:text-2xl">
        {title}
      </h3>
      <div className="mt-8 space-y-6 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("time")}
          </p>
          <p className="mt-2">{time}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("venue")}
          </p>
          <p className="mt-2 font-medium">{venue}</p>
          <p className="mt-1 text-[var(--tmpl-muted)]">{address}</p>
        </div>
      </div>
      {mapsUrl && (
        <div className="mt-8 aspect-video w-full overflow-hidden border border-[var(--tmpl-card-border)]">
          <iframe
            src={mapsUrl}
            className="h-full w-full border-0 grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map for ${venue}`}
          />
        </div>
      )}
    </div>
  );
}
