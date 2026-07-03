"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { CountdownProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function OrnamentalDivider() {
  return (
    <div className="flex flex-col items-center gap-2 px-2 md:px-4" aria-hidden>
      <span className="text-[10px] text-[var(--tmpl-gold)]">✦</span>
      <div className="h-10 w-px bg-[var(--tmpl-gold)]/40 md:h-14" />
      <div className="rh-embroidery-line w-4" />
    </div>
  );
}

export function Countdown({ data }: CountdownProps) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(new Date(data.weddingDate))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(data.weddingDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [data.weddingDate]);

  const units = [
    { value: timeLeft.days, label: t("days") },
    { value: timeLeft.hours, label: t("hours") },
    { value: timeLeft.minutes, label: t("minutes") },
    { value: timeLeft.seconds, label: t("seconds") },
  ];

  return (
    <section className="relative px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <span className="rh-ornament">✦</span>
          <h2 className="rh-section-title tmpl-display mt-4">{t("countdown")}</h2>
          <div className="rh-double-rule mx-auto mt-6 w-32" />
        </div>

        <div className="relative mx-auto mt-16 flex max-w-3xl items-center justify-center">
          <span
            className="tmpl-display pointer-events-none absolute select-none text-[clamp(5rem,18vw,10rem)] font-medium leading-none text-[var(--tmpl-gold)]/15"
            aria-hidden
          >
            &
          </span>
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center">
              <div className="flex flex-col items-center px-3 md:px-6">
                <span className="tmpl-display text-4xl font-medium tabular-nums text-[var(--tmpl-fg)] md:text-5xl">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="tmpl-body mt-3 text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {unit.label}
                </span>
              </div>
              {index < units.length - 1 && <OrnamentalDivider />}
            </div>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
