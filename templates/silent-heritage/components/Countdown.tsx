"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { CountdownProps } from "@/lib/types/wedding-data";
import { ShEyebrow } from "../ui";
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
    <section className="px-6 py-16 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-md text-center">
        <ShEyebrow>{t("countdown")}</ShEyebrow>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {units.map((unit) => (
            <div key={unit.label}>
              <span className="tmpl-display tabular-nums block text-3xl text-[var(--tmpl-fg)] md:text-4xl">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="tmpl-body mt-2 block text-[10px] uppercase tracking-[0.2em] text-[var(--tmpl-muted)]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
