"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { CountdownProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
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
    <section className="botanical-section px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion} className="text-center">
        <BotanicalDivider variant="sprig" drift className="mx-auto mb-6 opacity-60" />
        <h2 className="tmpl-display text-3xl text-[var(--tmpl-fg)] md:text-4xl">
          {t("countdown")}
        </h2>
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3 md:gap-4">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex min-w-[4.5rem] flex-col items-center rounded-full bg-[var(--tmpl-surface)] px-5 py-4 shadow-sm md:min-w-[5.5rem] md:px-6 md:py-5"
            >
              <span className="tmpl-display text-3xl text-[var(--tmpl-accent-secondary)] md:text-4xl">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="tmpl-body mt-1 text-[0.65rem] uppercase tracking-wider text-[var(--tmpl-muted)]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
