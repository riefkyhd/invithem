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
    <section className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-4xl">
        <div className="mb-12 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("countdown")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[var(--tmpl-grid)] md:grid-cols-4">
          {units.map((unit, index) => (
            <TemplateSectionReveal
              key={unit.label}
              motion={motion}
              delay={index * 0.08}
            >
              <div className="flex flex-col items-center bg-[var(--tmpl-bg)] px-4 py-8 md:px-6 md:py-10">
                <span className="tmpl-display text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {unit.label}
                </span>
              </div>
            </TemplateSectionReveal>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
