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
    <section id="events" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("eventDetails")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-32" />
        </div>
      </TemplateSectionReveal>

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
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

      <TemplateSectionReveal motion={motion} className="mt-12 text-center" delay={0.3}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="border border-[var(--tmpl-accent)]/40 px-8 py-3 text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-accent)] transition-colors hover:border-[var(--tmpl-accent)] hover:bg-[var(--tmpl-accent)]/5"
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
    <div className="border-t-2 border-[var(--tmpl-accent)] bg-[var(--tmpl-card)] px-8 py-10 text-center">
      <h3 className="tmpl-display text-2xl font-light tracking-wide">{title}</h3>
      <div className="dl-gold-rule mx-auto mt-6 w-16" />
      <div className="mt-8 space-y-6 text-sm font-light">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("time")}
          </p>
          <p className="tmpl-display mt-2 text-xl text-[var(--tmpl-accent)]">{time}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
            {t("venue")}
          </p>
          <p className="mt-2 font-normal">{venue}</p>
          <p className="mt-1 text-[var(--tmpl-muted)]">{address}</p>
        </div>
      </div>
      {mapsUrl && (
        <div className="mt-8 aspect-video overflow-hidden border border-[var(--tmpl-accent)]/20">
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
