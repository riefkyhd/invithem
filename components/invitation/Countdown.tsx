"use client";

import { useEffect, useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { useI18n } from "@/lib/i18n/context";

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(new Date(targetDate))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: t("days") },
    { value: timeLeft.hours, label: t("hours") },
    { value: timeLeft.minutes, label: t("minutes") },
    { value: timeLeft.seconds, label: t("seconds") },
  ];

  return (
    <section className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-12 text-center text-3xl md:text-4xl">
          {t("countdown")}
        </h2>
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-4 md:gap-8">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <span className="font-display block text-4xl md:text-6xl text-accent">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-xs uppercase tracking-wider text-muted">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
