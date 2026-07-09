"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { EventDetailsProps, WeddingEventData } from "@/lib/types/wedding-data";
import { ShEyebrow, ShPrimaryButton, ShSectionTitle } from "../ui";
import { motion } from "../motion";

function EventCard({ event, locale }: { event: WeddingEventData; locale: "id" | "en" }) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);
  const dateLocale = locale === "id" ? idLocale : enUS;
  const timeLabel = event.datetime
    ? format(new Date(event.datetime), "hh:mm a", { locale: dateLocale })
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
    <div id={`event-${slug}`} className="sh-card p-10">
      <p className="tmpl-body text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
        {timeLabel}
      </p>
      <h3 className="tmpl-display mt-4 text-3xl text-[var(--tmpl-heading)]">{event.label}</h3>
      <div className="mt-6 flex gap-3">
        <span className="text-[var(--tmpl-accent)]" aria-hidden>
          ◎
        </span>
        <div className="tmpl-body text-sm leading-relaxed text-[var(--tmpl-muted)]">
          <p className="font-medium text-[var(--tmpl-fg)]">{event.venueName}</p>
          <p className="mt-1 break-words">{event.venueAddress}</p>
        </div>
      </div>
      <ShPrimaryButton
        type="button"
        variant="outline"
        onClick={openMaps}
        className="mt-8 w-full sm:w-auto"
      >
        {t("viewOnMaps")}
      </ShPrimaryButton>
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
  });

  return (
    <section id="events" className="px-6 py-24 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg">
        <div className="flex flex-col gap-4 border-b border-[var(--tmpl-card-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <ShEyebrow>{locale === "id" ? "Agenda Acara" : "The Ceremonies"}</ShEyebrow>
            <ShSectionTitle className="mt-3">
              {locale === "id" ? "Detail Acara" : "Event Details"}
            </ShSectionTitle>
          </div>
          <p className="tmpl-body shrink-0 text-[10px] uppercase tracking-[0.25em] text-[var(--tmpl-muted)]">
            {headerDate}
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {events.map((event, index) => (
            <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.08}>
              <EventCard event={event} locale={locale} />
            </TemplateSectionReveal>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
