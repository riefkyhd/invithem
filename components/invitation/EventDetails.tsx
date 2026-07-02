"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import { downloadIcsFile } from "@/lib/utils/ics";
import type { AdminSettings } from "@/lib/types/database";

interface EventDetailsProps {
  settings: AdminSettings;
}

export function EventDetails({ settings }: EventDetailsProps) {
  const { t } = useI18n();

  function handleAddToCalendar() {
    const start = new Date(settings.wedding_date);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    downloadIcsFile({
      title: `${settings.groom_name} & ${settings.bride_name} Wedding`,
      description: `Ceremony at ${settings.ceremony_venue_name}`,
      location: settings.ceremony_venue_address,
      start,
      end,
    });
  }

  return (
    <section id="events" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-12 text-4xl md:text-5xl">
          {t("eventDetails")}
        </h2>
      </SectionReveal>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <SectionReveal delay={0.1}>
          <EventCard
            title={t("ceremony")}
            time={settings.ceremony_time}
            venue={settings.ceremony_venue_name}
            address={settings.ceremony_venue_address}
            mapsUrl={settings.ceremony_maps_embed_url}
          />
        </SectionReveal>
        <SectionReveal delay={0.2}>
          <EventCard
            title={t("reception")}
            time={settings.reception_time}
            venue={settings.reception_venue_name}
            address={settings.reception_venue_address}
            mapsUrl={settings.reception_maps_embed_url}
          />
        </SectionReveal>
      </div>

      <SectionReveal className="mt-10 text-center" delay={0.3}>
        <Button variant="secondary" onClick={handleAddToCalendar}>
          {t("addToCalendar")}
        </Button>
      </SectionReveal>
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
    <div className="rounded-2xl border border-card-border bg-card p-8">
      <h3 className="font-display text-2xl">{title}</h3>
      <div className="mt-6 space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {t("time")}
          </p>
          <p className="mt-1">{time}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {t("venue")}
          </p>
          <p className="mt-1 font-medium">{venue}</p>
          <p className="mt-1 text-muted">{address}</p>
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
