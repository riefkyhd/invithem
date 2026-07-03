"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="px-6 py-24 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="mx-auto max-w-lg text-center">
          <span className="dl-ornament">◆</span>
          <h2 className="dl-section-title tmpl-display mt-4">{t("gift")}</h2>
          <div className="dl-gold-rule mx-auto mt-6 w-32" />
          <p className="mt-8 text-sm font-light leading-relaxed text-[var(--tmpl-muted)]">
            {t("giftDesc")}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md space-y-6">
          {data.gift.bankAccounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="border-t-2 border-[var(--tmpl-accent)] bg-[var(--tmpl-card)] px-8 py-8 text-center"
            >
              <p className="text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {account.label}
              </p>
              <p className="mt-3 font-normal">{account.bank}</p>
              <p className="tmpl-display mt-6 text-2xl font-light tracking-[0.15em] text-[var(--tmpl-accent)]">
                {account.account_number}
              </p>
              <p className="mt-3 text-sm font-light text-[var(--tmpl-muted)]">
                {account.account_name}
              </p>
              <div className="mt-6 flex justify-center">
                <CopyButton value={account.account_number} />
              </div>
            </div>
          ))}
        </div>

        {data.gift.shippingAddress?.trim() && (
          <div className="mx-auto mt-6 max-w-md border-t-2 border-[var(--tmpl-accent)] bg-[var(--tmpl-card)] px-8 py-8 text-center">
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("giftShipping")}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm font-light leading-relaxed">
              {data.gift.shippingAddress}
            </p>
          </div>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
