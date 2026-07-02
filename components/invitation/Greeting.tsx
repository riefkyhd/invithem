"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { useI18n } from "@/lib/i18n/context";

interface GreetingProps {
  guestName?: string | null;
}

export function Greeting({ guestName }: GreetingProps) {
  const { t } = useI18n();

  if (!guestName) return null;

  return (
    <SectionReveal className="px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-3xl border-l-2 border-accent pl-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">
          {t("dear")}
        </p>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">{guestName}</h2>
      </div>
    </SectionReveal>
  );
}
