"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-4 text-4xl md:text-5xl">{t("gift")}</h2>
        <p className="mb-10 max-w-xl text-[var(--tmpl-muted)]">{t("giftDesc")}</p>

        <div className="mx-auto grid max-w-3xl gap-6">
          {data.gift.bankAccounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-8"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
                {account.label}
              </p>
              <p className="mt-2 font-medium">{account.bank}</p>
              <p className="tmpl-display mt-4 text-2xl tracking-wider">
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
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-8">
            <p className="text-xs uppercase tracking-wider text-[var(--tmpl-muted)]">
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
