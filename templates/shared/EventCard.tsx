"use client";

import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { WeddingEventData } from "@/lib/types/wedding-data";
import { useI18n } from "@/lib/i18n/context";

interface EventCardProps {
  event: WeddingEventData;
  cardClassName?: string;
  titleClassName?: string;
}

export function SharedEventCard({
  event,
  cardClassName = "rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-8",
  titleClassName = "tmpl-display text-2xl",
}: EventCardProps) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);

  return (
    <div id={`event-${slug}`} className={cardClassName}>
      <h3 className={titleClassName}>{event.label}</h3>
      <div className="mt-6 space-y-4 text-sm">
        {event.time && (
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
              {t("time")}
            </p>
            <p className="mt-1">{event.time}</p>
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
            {t("venue")}
          </p>
          <p className="mt-1 font-medium">{event.venueName}</p>
          <p className="mt-1 text-[var(--tmpl-muted)]">{event.venueAddress}</p>
        </div>
      </div>
      {event.mapsEmbedUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl">
          <iframe
            src={event.mapsEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map for ${event.venueName}`}
          />
        </div>
      )}
    </div>
  );
}
