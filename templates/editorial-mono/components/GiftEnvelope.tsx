"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-4 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[-0.03em]">
          {t("gift")}
        </h2>
        <p className="mb-16 ml-[4vw] max-w-md text-[var(--tmpl-muted)]">{t("giftDesc")}</p>

        <div className="ml-[4vw] max-w-lg space-y-12">
          {data.gift.bankAccounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="border-t border-[var(--tmpl-fg)] pt-8"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {account.label}
              </p>
              <p className="mt-3 text-sm font-medium">{account.bank}</p>
              <p className="tmpl-display mt-6 text-2xl font-medium tracking-[-0.02em]">
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
          <div className="ml-[4vw] mt-12 max-w-lg border-t border-[var(--tmpl-fg)] pt-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("giftShipping")}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
              {data.gift.shippingAddress}
            </p>
          </div>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
