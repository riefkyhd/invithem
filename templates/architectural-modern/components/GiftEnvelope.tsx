"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="border-b border-[var(--tmpl-grid)] px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-3xl">
        <div className="mb-8 border-b border-[var(--tmpl-grid)] pb-8">
          <h2 className="tmpl-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase tracking-[-0.04em]">
            {t("gift")}
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--tmpl-muted)]">
            {t("giftDesc")}
          </p>
        </div>

        <div className="grid gap-px bg-[var(--tmpl-grid)]">
          {data.gift.bankAccounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="bg-[var(--tmpl-bg)] p-8 md:p-10"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {account.label}
              </p>
              <p className="mt-3 text-sm font-medium">{account.bank}</p>
              <p className="tmpl-display mt-6 text-xl font-semibold tracking-[-0.03em] md:text-2xl">
                {account.account_number}
              </p>
              <p className="mt-2 text-sm text-[var(--tmpl-muted)]">
                {account.account_name}
              </p>
              <div className="mt-6">
                <CopyButton value={account.account_number} />
              </div>
            </div>
          ))}
        </div>

        {data.gift.shippingAddress?.trim() && (
          <div className="mt-px bg-[var(--tmpl-grid)]">
            <div className="bg-[var(--tmpl-bg)] p-8 md:p-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {t("giftShipping")}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                {data.gift.shippingAddress}
              </p>
            </div>
          </div>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
