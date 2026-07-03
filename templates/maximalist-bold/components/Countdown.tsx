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

const UNIT_STYLES = [
  { bg: "mb-color-coral", rotate: "-rotate-2" },
  { bg: "mb-color-chartreuse", rotate: "rotate-1" },
  { bg: "mb-color-purple", rotate: "-rotate-1" },
  { bg: "mb-color-coral", rotate: "rotate-2" },
] as const;

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
    <section className="overflow-hidden px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-12 text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("countdown")}
        </h2>

        <div className="flex flex-wrap items-end gap-4 md:gap-6">
          {units.map((unit, index) => {
            const style = UNIT_STYLES[index];
            return (
              <div
                key={unit.label}
                className={`${style.bg} ${style.rotate} flex min-w-[72px] flex-1 flex-col items-center px-4 py-6 md:min-w-[100px] md:px-8 md:py-10`}
              >
                <span className="tmpl-display tabular-nums text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-none tracking-[-0.04em]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="tmpl-body mt-3 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
