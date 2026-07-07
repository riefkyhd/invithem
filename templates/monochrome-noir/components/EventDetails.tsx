"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { EventDetailsProps, WeddingEventData } from "@/lib/types/wedding-data";
import { MnPrimaryButton } from "../ui";
import { motion } from "../motion";

function EventRow({
  event,
  locale,
  filled,
}: {
  event: WeddingEventData;
  locale: "id" | "en";
  filled: boolean;
}) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);
  const dateLocale = locale === "id" ? idLocale : enUS;
  const timeLabel = event.datetime
    ? format(new Date(event.datetime), "HH:mm", { locale: dateLocale })
    : event.time;

  function openMaps() {
    const query = encodeURIComponent(`${event.venueName} ${event.venueAddress}`.trim());
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div id={`event-${slug}`} className="border-t border-white/10 py-16 first:border-t-0">
      <p className="tmpl-display text-8xl leading-none text-white/20">{timeLabel}</p>
      <h3 className="tmpl-display mt-8 text-4xl uppercase tracking-[0.1em] text-white">
        {event.label}
      </h3>
      <div className="tmpl-body mt-6 max-w-sm text-base leading-relaxed text-white/60">
        <p>{event.venueName}</p>
        <p>{event.venueAddress}</p>
      </div>
      <MnPrimaryButton
        type="button"
        variant={filled ? "inverse-solid" : "inverse-outline"}
        onClick={openMaps}
        className="mt-10"
      >
        {t("viewOnMaps")}
      </MnPrimaryButton>
    </div>
  );
}

export function EventDetails({ data }: EventDetailsProps) {
  const { locale } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  const dateLocale = locale === "id" ? idLocale : enUS;
  const headerDate = format(new Date(data.weddingDate), "d MMMM yyyy", {
    locale: dateLocale,
  }).toUpperCase();

  return (
    <section id="events" className="mn-inverse px-6 py-20 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-md">
        <div className="flex items-end justify-between gap-6">
          <h2 className="tmpl-display text-6xl leading-none text-white">
            {locale === "id" ? (
              <>
                Agenda
                <br />
                <span className="italic">Acara</span>
              </>
            ) : (
              <>
                The
                <br />
                <span className="italic">Ceremonies</span>
              </>
            )}
          </h2>
          <p className="tmpl-body text-base tracking-[0.4em] text-white/40">{headerDate}</p>
        </div>

        <div className="mt-12 border-y border-white/10 bg-white/5">
          {events.map((event, index) => (
            <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.08}>
              <EventRow event={event} locale={locale} filled={index === 0} />
            </TemplateSectionReveal>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
