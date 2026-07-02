"use client";

import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { downloadIcsFile } from "@/lib/utils/ics";
import type { EventDetailsProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const HEADER_COLORS = ["mb-color-coral", "mb-color-purple"] as const;

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
    <section id="events" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-14 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("eventDetails")}
        </h2>
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <TemplateSectionReveal motion={motion} delay={0.1}>
          <EventCard
            headerClass={HEADER_COLORS[0]}
            title={t("ceremony")}
            time={data.venues.ceremony.time}
            venue={data.venues.ceremony.name}
            address={data.venues.ceremony.address}
            mapsUrl={data.venues.ceremony.mapsEmbedUrl}
            offset="md:translate-x-4"
          />
        </TemplateSectionReveal>
        <TemplateSectionReveal motion={motion} delay={0.2}>
          <EventCard
            headerClass={HEADER_COLORS[1]}
            title={t("reception")}
            time={data.venues.reception.time}
            venue={data.venues.reception.name}
            address={data.venues.reception.address}
            mapsUrl={data.venues.reception.mapsEmbedUrl}
            offset="md:-translate-x-4"
          />
        </TemplateSectionReveal>
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

function EventCard({
  headerClass,
  title,
  time,
  venue,
  address,
  mapsUrl,
  offset = "",
}: {
  headerClass: string;
  title: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  offset?: string;
}) {
  const { t } = useI18n();

  return (
    <div
      className={`overflow-hidden border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] shadow-[8px_8px_0_var(--tmpl-chartreuse)] ${offset}`}
    >
      <div className={`${headerClass} px-6 py-4`}>
        <h3 className="tmpl-display text-xl font-extrabold uppercase tracking-[-0.02em] md:text-2xl">
          {title}
        </h3>
      </div>
      <div className="space-y-6 px-6 py-8">
        <div>
          <p className="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-coral)]">
            {t("time")}
          </p>
          <p className="tmpl-body mt-2 font-medium">{time}</p>
        </div>
        <div>
          <p className="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--tmpl-purple)]">
            {t("venue")}
          </p>
          <p className="tmpl-body mt-2 font-semibold">{venue}</p>
          <p className="tmpl-body mt-1 text-[var(--tmpl-muted)]">{address}</p>
        </div>
        {mapsUrl && (
          <div className="aspect-video w-full overflow-hidden border-2 border-[var(--tmpl-fg)]">
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
    </div>
  );
}
