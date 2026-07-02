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
    <section className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-16 text-[clamp(1.5rem,4vw,2.5rem)] font-medium uppercase tracking-[-0.02em]">
          {t("countdown")}
        </h2>

        <div className="ml-[4vw] flex max-w-3xl items-stretch">
          {units.map((unit, index) => (
            <div key={unit.label} className="flex flex-1 items-stretch">
              {index > 0 && (
                <div className="w-px shrink-0 self-stretch bg-[var(--tmpl-card-border)]" />
              )}
              <div className="flex flex-1 flex-col justify-center px-6 py-4 md:px-10">
                <span className="tmpl-display text-[clamp(2rem,6vw,4rem)] font-medium leading-none tracking-[-0.04em]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
