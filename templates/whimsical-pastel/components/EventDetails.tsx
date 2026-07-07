"use client";

import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import type { EventDetailsProps, WeddingEventData } from "@/lib/types/wedding-data";
import { SectionDivider } from "../assets/SectionDivider";
import { SectionTitle, WpPrimaryButton } from "../ui";
import { motion } from "../motion";

function EventIcon({ label }: { label: string }) {
  const isCeremony = /akad|ceremony|nikah/i.test(label);
  return (
    <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center text-[var(--tmpl-heading)]">
      {isCeremony ? (
        <svg viewBox="0 0 30 32" className="h-8 w-8" fill="currentColor" aria-hidden>
          <path d="M15 2 5 10h2v18h16V10h2L15 2zm0 4.5L21 12v14H9V12l6-5.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 31" className="h-8 w-8" fill="currentColor" aria-hidden>
          <path d="M8 4h16v4H8V4zm-2 8h20v3H6v-3zm1 7h18v3H7v-3z" />
        </svg>
      )}
    </div>
  );
}

function EventCard({
  event,
  locale,
  variant,
}: {
  event: WeddingEventData;
  locale: "id" | "en";
  variant: "sage" | "rose";
}) {
  const { t } = useI18n();
  const slug = eventSlugFromLabel(event.label);
  const dateLocale = locale === "id" ? idLocale : enUS;
  const eventDate = event.datetime
    ? format(new Date(event.datetime), "EEEE, d MMMM yyyy", { locale: dateLocale })
    : "";
  const eventTime = event.datetime
    ? `${format(new Date(event.datetime), "HH.mm")} WIB`
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
    <div id={`event-${slug}`} className="wp-card flex flex-col items-center px-8 py-8 text-center">
      <EventIcon label={event.label} />
      <h3 className="tmpl-display text-[2rem] text-[var(--tmpl-heading)]">{event.label}</h3>
      {eventDate && (
        <p className="tmpl-body mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--tmpl-accent-secondary)]">
          {eventDate}
        </p>
      )}
      <div className="tmpl-body mt-6 space-y-2 text-base text-[var(--tmpl-muted)]">
        {eventTime && <p className="font-semibold text-[var(--tmpl-fg)]">{eventTime}</p>}
        <p>{event.venueName}</p>
        <p>{event.venueAddress}</p>
      </div>
      <WpPrimaryButton
        type="button"
        variant={variant}
        onClick={openMaps}
        className="mt-8 w-full max-w-xs text-base font-normal normal-case tracking-normal"
      >
        <svg viewBox="0 0 12 14" className="h-3.5 w-3" fill="currentColor" aria-hidden>
          <path d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 8 6 8s6-3.5 6-8c0-3.3-2.7-6-6-6zm0 8.2c-1.2 0-2.2-1-2.2-2.2S4.8 3.8 6 3.8 8.2 4.8 8.2 6 7.2 8.2 6 8.2z" />
        </svg>
        {t("viewOnMaps")}
      </WpPrimaryButton>
    </div>
  );
}

export function EventDetails({ data }: EventDetailsProps) {
  const { locale, t } = useI18n();
  const events = data.events;
  if (events.length === 0) return null;

  return (
    <section id="events" className="px-5 py-16 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <SectionTitle>{t("agendaAcara")}</SectionTitle>
      </TemplateSectionReveal>

      <div className="mx-auto mt-10 flex max-w-md flex-col gap-6">
        {events.map((event, index) => (
          <TemplateSectionReveal key={event.id} motion={motion} delay={index * 0.08}>
            <EventCard
              event={event}
              locale={locale}
              variant={index % 2 === 0 ? "sage" : "rose"}
            />
          </TemplateSectionReveal>
        ))}
      </div>

      <TemplateSectionReveal motion={motion} delay={0.2} className="mt-10">
        <SectionDivider />
      </TemplateSectionReveal>
    </section>
  );
}
